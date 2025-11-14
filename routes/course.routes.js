import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getCoursesByTeacher,
  getEnrolledCoursesByStudent,
} from "../controller/course.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateCourse, courseSchema } from "../validations/course.validation.js";
import validateObjectId from "../middleware/validateObjectId.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// ----------------- COURSE CRUD -----------------

// Create a course (Teacher only)
router.post("/", protect, authorizeRoles("teacher"), validateCourse(courseSchema), createCourse);

// Get all courses (Public)
router.get("/", getAllCourses);

// Get a course by ID
router.get("/:id", validateObjectId("id"), getCourseById);

// Update course (Teacher only, must own course)
router.put(
  "/:id",
  protect,
  validateObjectId("id"),
  authorizeRoles("teacher"),
  validateCourse(courseSchema),
  updateCourse
);

// Delete course (Teacher who owns or Admin)
router.delete(
  "/:id",
  protect,
  validateObjectId("id"),
  authorizeRoles("teacher", "admin"),
  deleteCourse
);

// ----------------- ENROLLMENT -----------------

// Enroll in course (Student only)
router.post("/:id/enroll", protect, authorizeRoles("student"), enrollInCourse);

// ----------------- COURSE FILTERS -----------------

// Get courses by a teacher (Teacher/Admin)
router.get("/teacher/:teacherId", protect, authorizeRoles("teacher", "admin"), getCoursesByTeacher);

// Get courses enrolled by a student (Student/Admin)
router.get("/student/:studentId", protect, authorizeRoles("student", "admin"), getEnrolledCoursesByStudent);

export default router;
