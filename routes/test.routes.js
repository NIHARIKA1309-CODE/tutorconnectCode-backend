import express from "express";
import {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
  assignTestToStudents,
} from "../controller/test.controller.js";

import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { createTestSchema, updateTestSchema, assignTestSchema } from "../validations/test.validation.js";
import validateObjectId from "../middleware/validateObjectId.middleware.js";

const router = express.Router();

// Create a new test (Teacher only)
router.post("/", protect, authorizeRoles("teacher"), validate(createTestSchema), createTest);

// Get all tests
router.get("/", protect, getAllTests);

// Get single test by ID
router.get("/:id", protect, getTestById);

// Update a test (Teacher only)
router.put("/:id", protect, authorizeRoles("teacher"), validate(updateTestSchema), updateTest);

// Delete a test (Teacher only)
router.delete("/:id", protect,validateObjectId("id"), authorizeRoles("teacher"), deleteTest);

// Assign test to students (Teacher only)
router.post("/:id/assign", protect, authorizeRoles("teacher"), validate(assignTestSchema), assignTestToStudents);

export default router;
