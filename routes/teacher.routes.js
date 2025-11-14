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

/* --------------------------------------------------
   CREATE TEACHER PROFILE (Teacher Only)
--------------------------------------------------- */
// tested working well 
router.post(
  "/",
  protect,
  authorizeRoles("teacher"),
  upload.single("avatar"),
  // validate(teacherProfileSchema),
  createTeacherProfile
);

/* --------------------------------------------------
   GET CURRENT TEACHER PROFILE
--------------------------------------------------- */
// tested working well 
router.get(
  "/me",
  protect,
  authorizeRoles("teacher"),
  getTeacherProfile
);


/* --------------------------------------------------
   UPDATE TEACHER PROFILE (Teacher Only)
--------------------------------------------------- */
router.put(
  "/me/update",
  protect,
  authorizeRoles("teacher"),
  upload.single("avatar"),
  validate(teacherProfileSchema), // allow partial updates
  updateTeacherProfile
);

/* --------------------------------------------------
   GET ALL TEACHERS (Any Logged-in User)
--------------------------------------------------- */
router.get("/", protect, getAllTeachers);

/* --------------------------------------------------
   DELETE TEACHER PROFILE (Admin Only)
--------------------------------------------------- */
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  validateObjectId("id"),
  deleteTeacherProfile
);

export default router;
