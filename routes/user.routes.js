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

// Add logging to see if route is reached
router.use((req, res, next) => {
  console.log(`🔸 User route hit: ${req.method} ${req.path}`);
  next();
});

// Register route (file + validation)
router.post("/register", 
  (req, res, next) => {
    console.log("🔸 Step 1: Before multer");
    next();
  },
  upload.single("avatar"), 
  (req, res, next) => {
    console.log("🔸 Step 2: After multer, before validation");
    next();
  },
  validate(registerSchema), 
  (req, res, next) => {
    console.log("🔸 Step 3: After validation, calling controller");
    next();
  },
  registerUser
);

// Login route (validation)
router.post("/login", validate(loginSchema), loginUser);

router.get("/me", protect, getMyProfile);
router.post("/logout", protect, logoutUser);
router.get("/all", protect, authorizeRoles("admin"), getAllUsers);

export default router;
