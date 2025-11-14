import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from cookies or Authorization header
  if (req.cookies?.token) {
    token = req.cookies.token;

  } else if (

    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")

  ) {
    token = req.headers.authorization.split(" ")[1];
  }


  if (!token) {
    return next(new ApiError(401, "Not authorized - no token provided"));
  }


  //verify using jwt during login jwt is from website ke taraf se hai aur 
  // token create hota isliye matching ke dauran uska presence compulsory rhta hai 
  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return next(new ApiError(401, "Invalid token"));
    }

    // Fetch user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return next(new ApiError(404, "User not found"));

    // Attach user object
    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
 
      teacherProfile: null,
      studentProfile: null,
    };


    // role dependent search for checking the role 
    if (user.role === "teacher") {
      const teacherProfile = await TeacherProfile.findOne({ user: user._id });
      if (teacherProfile) req.user.teacherProfile = teacherProfile._id;
    }

    // Attach StudentProfile ID if user is student  
    if (user.role === "student") {
      const studentProfile = await StudentProfile.findOne({ user: user._id });
      if (studentProfile) req.user.studentProfile = studentProfile._id;
    }

    next(); // allow access to the protected route
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return next(new ApiError(401, "Not authorized - token verification failed"));
  }
});
