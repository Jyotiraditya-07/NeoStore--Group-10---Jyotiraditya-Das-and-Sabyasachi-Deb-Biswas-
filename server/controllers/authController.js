import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import jwt from "jsonwebtoken";
import { Order } from "../models/orderModel.js";

//register

const registerController = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, answer } = req.body;

  if (
    [name, email, password, phone, address, answer].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User already Exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    answer,
  });

  const createdUser = await User.findById(user._id).select("-password");

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

//login

const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(404, "Invalid email or password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "email is not registered");
  }

  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(200, "Invalid Password");
  }
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", token, options)
    .json(new ApiResponse(201, { user, token }, "login Successfully"));
});

//forgot

const forgotController = asyncHandler(async (req, res) => {
  const { email, answer, newPassword } = req.body;
  if ([email, answer, newPassword].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email, answer });

  if (!user) {
    throw new ApiError(404, "email or answer is wrong !");
  }

  const newHashedPassword = await hashPassword(newPassword);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { password: newHashedPassword },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(201, updatedUser, "Password Reset Successfully"));
});
const testController = asyncHandler((req, res) => {
  res.send("protected route!");
});

const updateProfileController = asyncHandler(async (req, res) => {
  const { name, email, password, address, phone } = req.body;

  const user = await User.findById(req.user._id);

  if (password && password.length < 6) {
    throw new ApiError(
      400,
      "Password is required and should be min 6 characters long"
    );
  }

  const hashedPassword = await hashPassword(password);

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: name || user.name,
      password: hashedPassword || user.password,
      phone: phone || user.phone,
      address: address || user.address,
    },
    { new: true }
  );

  return res
    .status(201)
    .json(new ApiResponse(201, updatedUser, "User Details updated !"));
});

const getOrderController = asyncHandler(async (req, res) => {
  const AllOrders = await Order.find({})
    .populate("products", "-photo")
    .populate("buyer", "name");
  if (!AllOrders) {
    throw new ApiError(401, "No Orders found !");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, AllOrders, "Orders Fetched!"));
});

const getAllOrderController = asyncHandler(async (req, res) => {
  const AllOrders = await Order.find({})
    .populate("products", "-photo")
    .populate("buyer", "name")
    .sort({ createdAt: -1 });

  return res
    .status(201)
    .json(new ApiResponse(201, AllOrders, "Orders Fetched!"));
});
const OrderStatusController = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res.status(201).json(new ApiResponse(201, order, "Order Found!"));
});
export {
  registerController,
  loginController,
  testController,
  forgotController,
  updateProfileController,
  getOrderController,
  getAllOrderController,
  OrderStatusController,
};
