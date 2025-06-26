import slugify from "slugify";
import { Category } from "../models/categoryModel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCategoryController = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(401, "Name is required");
  }

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new ApiError(400, "Category already exists");
  }

  const category = await Category.create({ name, slug: slugify(name) });

  if (!category) {
    throw new ApiError(404, "Error While Creating Category");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Created Category Successfully"));
});

const updateCategoryController = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category updated Successfully"));
});

const allCategoriesController = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  if (!categories) {
    throw new ApiError(404, "Categories not found");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, categories, "All Categories Found!"));
});

const singleCategoryController = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category Found!"));
});

const deleteCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete({ _id: id });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  res.status(201).json(new ApiResponse(201, category, "Category Deleted!"));
});

export {
  createCategoryController,
  updateCategoryController,
  allCategoriesController,
  singleCategoryController,
  deleteCategoryController,
};
