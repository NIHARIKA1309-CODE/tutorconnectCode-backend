import express from "express";
import {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
  getAllStudents,
  deleteStudentProfile,
  teacherUpdateStudentMetrics
} from "../controller/student.controller.js";


import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.middleware.js";
import validateObjectId from "../middleware/validateObjectId.middleware.js";
import { validate } from "../middleware/validate.js";
import {
  createStudentSchema,
  updateStudentSchema,
  teacherUpdateMetricsSchema
} from "../validations/student.validation.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();


// ✅ Create student profile (STUDENT only)
router.post(
  "/",
  protect,
  authorizeRoles("student"),
  upload.single("avatar"),
  validate(createStudentSchema),
  createStudentProfile
);


// ✅ Get own student profile (STUDENT only)
router.get(
  "/me",
  protect,
  authorizeRoles("student"),
  getStudentProfile
);


// ✅ Update own profile (STUDENT only)
router.put(
  "/me/update",
  protect,
  authorizeRoles("student"),
  upload.single("avatar"),
  validate(updateStudentSchema),
  updateStudentProfile
);


// 🟥 NEW: Teacher updating metrics
// performance, attendance, assignment
router.put(
  "/:id/metrics",
  protect,
  authorizeRoles("teacher"),
  validateObjectId("id"),
  validate(teacherUpdateMetricsSchema),
  teacherUpdateStudentMetrics
);


// ✅ Get all students (TEACHER or ADMIN)
router.get(
  "/",
  protect,
  authorizeRoles("teacher", "admin"),
  getAllStudents
);


// ❌ Delete student profile (ADMIN only)
router.delete(
  "/:id",
  protect,
  validateObjectId("id"),
  authorizeRoles("admin"),
  deleteStudentProfile
);

export default router;
