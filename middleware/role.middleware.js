import { ApiError } from "../utils/ApiError.js"

// this is for role based athority because
// you seen that each route we have to check the role always 
export const authorizeRoles = (...roles)=>{
     return (req,res,next)=>{
          if(!roles.includes(req.user.role)){
            return next(new ApiError(403, "Access denied"));
          }
          console.log("Authorized bhi ho rha jis avatar me h woo");
          next();
     };
};