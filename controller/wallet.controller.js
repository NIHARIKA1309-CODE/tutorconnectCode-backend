import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* -------------------------------- CREATE RAZORPAY ORDER -------------------------------- */
export const createOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json(new ApiResponse(400, null, "Valid amount is required"));
  }

  // For now, return a mock order - integrate Razorpay SDK later
  const order = {
    id: `order_${Date.now()}`,
    amount: amount * 100, // Convert to paise
    currency: "INR",
    status: "created"
  };

  return res.status(201).json({
    success: true,
    order: order,
    message: "Order created successfully"
  });
});

/* -------------------------------- VERIFY PAYMENT -------------------------------- */
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json(new ApiResponse(400, null, "Payment details are required"));
  }

  // For now, assume verification is successful - integrate actual Razorpay verification later
  return res.status(200).json(new ApiResponse(200, { verified: true }, "Payment verified successfully"));
});

/* -------------------------------- GET WALLET BALANCE -------------------------------- */
export const getWalletBalance = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // For now, return a mock balance - integrate with user wallet model later
  const balance = 0;

  return res.status(200).json(new ApiResponse(200, { balance }, "Wallet balance fetched"));
});
