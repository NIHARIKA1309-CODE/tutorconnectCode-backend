import Payment from "../models/Payment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

//   Create a new payment (Student)
export const createPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.create(req.body);
  return res.status(201).json(
    new ApiResponse(201, { payment }, "Payment created successfully")
  );
});

//   Get all payments (Admin)
export const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate("student", "user grade")
    .populate("teacher", "user subjects");

  if (!payments) throw new ApiError(404, "No payments found");

  return res.status(200).json(
    new ApiResponse(200, { payments }, "All payments fetched successfully")
  );
});

//   Get payment by ID (Authorized users)
export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate("student", "user grade")
    .populate("teacher", "user subjects");

  if (!payment) throw new ApiError(404, "Payment not found");

  return res.status(200).json(
    new ApiResponse(200, { payment }, "Payment fetched successfully")
  );
});

//   Update payment status (Admin)
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!payment) throw new ApiError(404, "Payment not found");

  return res.status(200).json(
    new ApiResponse(200, { payment }, "Payment status updated successfully")
  );
});

//   Get payments by student
export const getPaymentsByStudent = asyncHandler(async (req, res) => {
  const studentId = req.params.studentId;
  const payments = await Payment.find({ student: studentId })
    .populate("teacher", "user subjects");

  if (!payments) throw new ApiError(404, "No payments found for this student");

  return res.status(200).json(
    new ApiResponse(200, { payments }, "Payments fetched successfully")
  );
});

//   Get payments by teacher
export const getPaymentsByTeacher = asyncHandler(async (req, res) => {
  const teacherId = req.params.teacherId;
  const payments = await Payment.find({ teacher: teacherId })
    .populate("student", "user grade");

  if (!payments) throw new ApiError(404, "No payments found for this teacher");

  return res.status(200).json(
    new ApiResponse(200, { payments }, "Payments fetched successfully")
  );
});
