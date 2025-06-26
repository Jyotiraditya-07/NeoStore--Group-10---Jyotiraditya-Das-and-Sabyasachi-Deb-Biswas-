import express from "express";
import formidable from "express-formidable";
import { IsAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getSingleProduct,
  productPhoto,
  updateProduct,
  productFilter,
  productCount,
  productListPerPage,
  searchProduct,
  SimilarProduct,
  getProductByCategory,
  TokenController,
  paymentController,
} from "../controllers/productController.js";
const router = express.Router();

router.post(
  "/create-product",
  requireSignIn,
  IsAdmin,
  formidable(),
  createProduct
);
router.put(
  "/update-product/:id",
  requireSignIn,
  IsAdmin,
  formidable(),
  updateProduct
);

router.get("/get-products", getProduct);
router.get("/get-product/:slug", getSingleProduct);
router.get("/product-photo/:pid", productPhoto);
router.delete("/delete-product/:pid", deleteProduct);
router.post("/product-filter", productFilter);
router.get("/product-count", productCount);
router.get("/product-list/:page", productListPerPage);
router.get("/search/:keyword", searchProduct);
router.get("/related-product/:pid/:cat", SimilarProduct);
router.get("/product-category/:slug", getProductByCategory);

// payment gateway routes

router.get("/braintree/token", TokenController);
router.post("/braintree/payment", requireSignIn, paymentController);
export default router;
