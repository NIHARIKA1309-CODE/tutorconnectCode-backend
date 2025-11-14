import express from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByStudent,
  getPaymentsByTeacher,
  updatePaymentStatus,
} from "../controller/payment.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createPaymentSchema, updatePaymentStatusSchema } from "../validations/payment.validation.js";
import validateObjectId from "../middleware/validateObjectId.middleware.js";

const router = express.Router();

// Create a payment (Student)
router.post("/", protect, authorizeRoles("student"), validate(createPaymentSchema), createPayment);

// Get all payments (Admin only)
router.get("/", protect, authorizeRoles("admin"), getAllPayments);

// Get payments by Student
router.get("/student/:studentId", protect, authorizeRoles("student", "admin"), getPaymentsByStudent);

// Get payments by Teacher
router.get("/teacher/:teacherId", protect, authorizeRoles("teacher", "admin"), getPaymentsByTeacher);

// Get payment by ID
router.get("/:id", protect,validateObjectId("id") ,authorizeRoles("student", "teacher", "admin"), getPaymentById);

// Update payment status (Admin only)
router.put("/:id/status", protect, authorizeRoles("admin"), validate(updatePaymentStatusSchema), updatePaymentStatus);

export default router;
