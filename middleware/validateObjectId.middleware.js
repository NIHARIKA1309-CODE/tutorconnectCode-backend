import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";


//validation of object id 
const validateObjectId = (param = "id") => (req, res, next) => {
  const id = req.params[param]; // <-- use 'params' instead of 'param'

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, `Invalid ${param} ID`));
  }

  next();
};

export default validateObjectId;
