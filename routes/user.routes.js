import express from "express";
import {
  registerUser,
  loginUser,
  getMyProfile,
  getAllUsers,
  logoutUser,
} from "../controller/user.controller.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { validate } from "../middleware/validate.js"; // ✅ import validator
import { registerSchema, loginSchema } from "../validations/user.validation.js"; // ✅ import schemas




const router = express.Router();

// Register route (file + validation)
router.post("/register", upload.single("avatar"), validate(registerSchema), registerUser);

// Login route (validation)
router.post("/login", validate(loginSchema), loginUser);

router.get("/me", protect, getMyProfile);
router.post("/logout", protect, logoutUser);
router.get("/all", protect, authorizeRoles("admin"), getAllUsers);

export default router;
