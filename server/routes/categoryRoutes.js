import express from "express";
import { IsAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createCategoryController,
  updateCategoryController,
  allCategoriesController,
} from "../controllers/categoryController.js";
import { singleCategoryController } from "../controllers/categoryController.js";
import { deleteCategoryController } from "../controllers/categoryController.js";

const router = express.Router();

router.post(
  "/create-category",
  requireSignIn,
  IsAdmin,
  createCategoryController
);

router.put(
  "/update-category/:id",
  requireSignIn,
  IsAdmin,
  updateCategoryController
);

router.get("/categories", allCategoriesController);

router.get("/single-category/:slug", singleCategoryController);
router.delete(
  "/delete-category/:id",
  requireSignIn,
  IsAdmin,
  deleteCategoryController
);
export default router;
