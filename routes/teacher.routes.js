// import express from "express";
// import {
//   createTeacherProfile,
//   getTeacherProfile,
//   updateTeacherProfile,
//   getAllTeachers,
//   deleteTeacherProfile,
// } from "../controller/teacher.controller.js";

// import { protect } from "../middleware/authMiddleware.js";
// import { authorizeRoles } from "../middleware/role.middleware.js";
// import { upload } from "../middleware/multer.middleware.js";
// import { validate } from "../middleware/validate.js";
// import { teacherProfileSchema } from "../validations/teacher.validation.js";
// import validateObjectId from "../middleware/validateObjectId.middleware.js";

// const router = express.Router();

// // Create teacher profile (Teacher only)
// router.post(
//   "/",
//   protect,
//   authorizeRoles("teacher"),
//   upload.single("avatar"), // Optional avatar upload
//   // validate(teacherProfileSchema),
//   createTeacherProfile
// );

// // Get current teacher profile
// router.get("/me", protect, authorizeRoles("teacher"), getTeacherProfile);

// // Update teacher profile
// router.put(
//   "/me/update",
//   protect,
//   authorizeRoles("teacher"),
//   upload.single("avatar"), // Optional avatar upload for update
//   // validate(teacherProfileSchema),
//   updateTeacherProfile
// );

// // Get all teachers (Students or Admin)
// router.get("/", protect, getAllTeachers);

// // Delete teacher profile (Admin only)
// router.delete("/:id", protect , validateObjectId("id") ,authorizeRoles("admin"), deleteTeacherProfile);

// export default router;



import express from "express";
import {
  createTeacherProfile,
  getTeacherProfile,
  updateTeacherProfile,
  getAllTeachers,
  deleteTeacherProfile,
} from "../controller/teacher.controller.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { validate } from "../middleware/validate.js";
import { teacherProfileSchema } from "../validations/teacher.validation.js";
import validateObjectId from "../middleware/validateObjectId.middleware.js";

const router = express.Router();

// Get current teacher profile
router.get("/me", protect, authorizeRoles("teacher"), getTeacherProfile);

// Update teacher profile
router.put(
  "/update",
  protect,
  authorizeRoles("teacher"),
  upload.single("avatar"),
  updateTeacherProfile
);

// Get all teachers (Any authenticated user for chat)
router.get("/", protect, getAllTeachers);

// Delete teacher profile (Admin only)
router.delete("/:id", protect, validateObjectId("id"), authorizeRoles("admin"), deleteTeacherProfile);

export default router;
