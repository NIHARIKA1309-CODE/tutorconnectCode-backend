import { ApiResponse } from "./ApiResponse.js";

export const sendToken = (user, res, statusCode = 200, message = "Success") => {
  try {
    const token = user.generateToken();
    const isProduction = process.env.NODE_ENV === "production";

    //send the token to the user 
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // HTTPS in production
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove sensitive info
    const userResponse = user.toJSON();

  
    
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, { user: userResponse, token }, message));
  } catch (error) {
    console.error("Error in sendToken:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error"));
  }
};
