import express from "express";
import {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
  getReportsByStudent,
  getReportsByTeacher,
} from "../controller/report.controller.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.js"
import { createReportSchema, updateReportSchema } from "../validations/report.validation.js";
import validateObjectId from "../middleware/validateObjectId.middleware.js";

const router = express.Router();

// Create a new report (Teacher only)
router.post("/", protect, authorizeRoles("teacher"), validate(createReportSchema), createReport);

// Get all reports (Admin only)
router.get("/", protect, authorizeRoles("admin"), getAllReports);

// Get reports by student
router.get("/student/:studentId", protect, authorizeRoles("student", "teacher", "admin"), getReportsByStudent);

// Get reports by teacher
router.get("/teacher/:teacherId", protect, authorizeRoles("teacher", "admin"), getReportsByTeacher);

// Get single report by ID
router.get("/:id", protect , validateObjectId("id") ,authorizeRoles("student", "teacher", "admin"), getReportById);

// Update a report (Teacher/Admin)
router.put("/:id", protect, validateObjectId("id") ,authorizeRoles("teacher", "admin"), validate(updateReportSchema), updateReport);

// Delete a report (Admin only)
router.delete("/:id", protect , validateObjectId("id") ,authorizeRoles("admin"), deleteReport);

export default router;
