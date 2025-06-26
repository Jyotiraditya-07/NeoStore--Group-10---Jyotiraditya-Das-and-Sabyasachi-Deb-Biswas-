import slugify from "slugify";
import { Product } from "../models/ProductModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/categoryModel.js";
import braintree from "braintree";
import { Order } from "../models/orderModel.js";
import dotenv from "dotenv";

dotenv.config();
// payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
});
const createProduct = asyncHandler(async (req, res) => {
  const { name, slug, description, price, category, quantity, shipping } =
    req.fields;

  const { photo } = req.files;

  if (
    [name, slug, description, price, category, quantity].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!photo || photo > 1000000) {
    throw new ApiError(400, "Photo is required and should be less than 1mb");
  }

  const product = await Product.create({ ...req.fields, slug: slugify(name) });

  if (!product) {
    throw new ApiError(404, "Error While Creating Product");
  }
  product.photo.data = fs.readFileSync(photo.path);
  product.photo.contentType = photo.type;
  await product.save();

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created SuccessFully!"));
});

const getProduct = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("category")
    .select("-photo")
    .limit(12)
    .sort({ createdAt: -1 });

  if (!products) {
    throw new ApiError(404, "Products not found");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        products,
        `All products Fetched (total : ${products.length}) !`
      )
    );
});

const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .select("-photo")
    .populate("category");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product Fetched!"));
});

const productPhoto = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.pid).select("photo");

  if (!product?.photo?.data) {
    throw new ApiError(404, "Product Photo not found");
  }

  res.set("Content-Type", product.photo.contentType);
  return res.status(201).send(product.photo.data);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.pid).select(
    "-photo"
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product Deleted SuccessFully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity, shipping } = req.fields;
  const { photo } = req.files;

  if (
    [name, description, price, category, quantity].some(
      (field) => !field?.trim()
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.name = name;
  product.description = description;
  product.price = price;
  product.category = category;
  product.quantity = quantity;
  product.shipping = shipping === "true";
  product.slug = slugify(name);

  if (photo) {
    if (photo.size > 1000000) {
      throw new ApiError(400, "Photo should be less than 1MB");
    }
    product.photo.data = fs.readFileSync(photo.path);
    product.photo.contentType = photo.type;
  }

  await product.save();

  const updatedProduct = await Product.findById(product._id).select("-photo");
  res
    .status(201)
    .json(
      new ApiResponse(201, updatedProduct, "Product updated successfully!")
    );
});

const productFilter = asyncHandler(async (req, res) => {
  const { checked, radio } = req.body;
  let args = {};

  if (checked.length > 0) args.category = checked;
  if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

  const products = await Product.find(args);

  if (!products) {
    throw new ApiError(404, "Products not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, products, "Filtered Products !"));
});

const productCount = asyncHandler(async (req, res) => {
  const total = await Product.find().estimatedDocumentCount();

  if (!total) {
    throw new ApiError(404, "Products not found");
  }

  return res.status(201).json(new ApiResponse(201, total, "Prodcts Fetched !"));
});

const productListPerPage = asyncHandler(async (req, res) => {
  const perPage = 2;
  const page = req.params.page ? req.params.page : 1;

  const products = await Product.find()
    .select("-photo")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ createdAt: -1 });

  return res
    .status(201)
    .json(new ApiResponse(201, products, "Loaded More Products!"));
});
const searchProduct = asyncHandler(async (req, res) => {
  const { keyword } = req.params;

  const result = await Product.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  }).select("-photo");

  return res
    .status(201)
    .json(new ApiResponse(201, result, "Searched Products!"));
});

const SimilarProduct = asyncHandler(async (req, res) => {
  const { pid, cat } = req.params;

  const products = await Product.find({
    category: cat,
    _id: { $ne: pid },
  })
    .select("-photo")
    .limit(3)
    .populate("category");

  return res
    .status(201)
    .json(new ApiResponse(201, products, "Similar Products!"));
});

const getProductByCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params?.slug });

  const Products = await Product.find({ category }).populate("category");

  if (!Products) {
    throw new ApiError(404, "No Products for this category ");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { Products, category },
        "Category wise Products Fetched!"
      )
    );
});

// payment gateway controllers

const TokenController = asyncHandler(async (_, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      throw new ApiError(404, "Error While Generating Token");
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          response.clientToken,
          "Token Generated SuccessFully !"
        )
      );
  });
});

const paymentController = asyncHandler(async (req, res) => {
  const { cart, nonce } = req.body;
  let total = 0;
  cart.map((i) => {
    total += i.price;
  });

  gateway.transaction.sale(
    {
      amount: total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    },
    async function (error, result) {
      if (result) {
        try {
          const order = await Order.create({
            products: cart,
            payment: result,
            buyer: req.user._id,
          });
          res.json({ pk: true });
        } catch (err) {
          res.status(500).send(err);
        }
      } else {
        res.status(500).send(error);
      }
    }
  );
});

export {
  createProduct,
  getProduct,
  getSingleProduct,
  productPhoto,
  deleteProduct,
  updateProduct,
  productFilter,
  productCount,
  productListPerPage,
  searchProduct,
  SimilarProduct,
  getProductByCategory,
  TokenController,
  paymentController,
};
