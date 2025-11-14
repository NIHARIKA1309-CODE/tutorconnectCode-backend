import User from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendToken } from "../utils/sendToken.js";
import fs from "fs";

/* -------------------------------- REGISTER -------------------------------- */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log("Incoming Registration:", { name, email, role });

  // Validate required fields
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, " All fields including role are required"));
  }

  // Check if user already exists
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return res
      .status(409)
      .json(new ApiResponse(409, null, " User with this email already exists"));
  }

  // Validate and upload avatar
  const avatarFile = req.file;
  if (!avatarFile) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, " Avatar image is required"));
  }

  const uploadedAvatar = await uploadOnCloudinary(avatarFile.path, "image");
  if (fs.existsSync(avatarFile.path)) fs.unlinkSync(avatarFile.path);

  // Create new user
  const newUser = await User.create({
    name,
    email,
    password,
    role,
    avatar: uploadedAvatar.secure_url,
  });

  // Send JWT token & response via helper
  return sendToken(newUser, res, 201, "🎉 User registered successfully!");
});



/* ---------------------------------- LOGIN --------------------------------- */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("Login Attempt:", { email });

  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Email and password are required"));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, " Invalid email or password"));
  }

  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, " Invalid email or password"));
  }

  // Send token and response via sendToken
  return sendToken(user, res, 200, "🎉 User logged in successfully!");
});






/* ----------------------------- GET MY PROFILE ----------------------------- */
export const getMyProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User profile fetched successfully"));
});




/* ------------------------------ GET ALL USERS ----------------------------- */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, { users }, "All users fetched successfully"));
});

/* --------------------------------- LOGOUT --------------------------------- */
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", { maxAge: 0, httpOnly: true });
  return res
    .status(200)
    .json(new ApiResponse(200, null, " Logged out successfully"));
});
