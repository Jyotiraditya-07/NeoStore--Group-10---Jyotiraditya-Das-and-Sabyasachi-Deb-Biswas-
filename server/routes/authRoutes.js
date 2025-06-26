import express from "express";
import {
  forgotController,
  loginController,
  registerController,
  testController,
  updateProfileController,
  getOrderController,
  getAllOrderController,
  OrderStatusController,
} from "../controllers/authController.js";
import { IsAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotController);
router.get("/test", requireSignIn, testController);

//protected routes

router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/admin-auth", requireSignIn, IsAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.put("/profile", requireSignIn, updateProfileController);
router.get("/orders", requireSignIn, getOrderController);
router.get("/all-orders", requireSignIn, IsAdmin, getAllOrderController);
router.put(
  "/order-status/:orderId",
  requireSignIn,
  IsAdmin,
  OrderStatusController
);

export default router;
