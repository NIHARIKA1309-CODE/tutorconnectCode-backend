import express from "express";
import {
  createOrder,
  verifyPayment,
  getWalletBalance
} from "../controller/wallet.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Razorpay order
router.post("/create-order", protect, createOrder);

// Verify payment
router.post("/verify-payment", protect, verifyPayment);

// Get wallet balance
router.get("/balance", protect, getWalletBalance);

export default router;
