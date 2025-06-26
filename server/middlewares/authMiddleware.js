import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";

export const requireSignIn = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");

  console.log(token);

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decodedToken._id);

  req.user = user;
  next();
});

export const IsAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user?._id);

  if (user.role !== 1) {
    return res.status(401).send({
      success: false,
      message: "UnAuthorized Access",
    });
  } else {
    next();
  }
});
