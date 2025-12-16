export const validate = (schema) => (req, res, next) => {
  try {
    console.log("🔸 Validation - Raw body:", req.body);
    
    // Convert string fields into JSON if needed (for multipart/form-data)
    if (typeof req.body === "object") {
      for (let key in req.body) {
        try {
          req.body[key] = JSON.parse(req.body[key]);
        } catch (_) {}
      }
    }

    console.log("🔸 Validation - Parsed body:", req.body);
    req.body = schema.parse(req.body);
    console.log("🔸 Validation - SUCCESS");
    next();

  } catch (error) {
    console.log("🔸 Validation - FAILED:", error);
    // Zod Errors → safe to read error.errors
    if (error.errors) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors.map(err => ({
          path: err.path.join("."),
          message: err.message
        }))
      });
    }

    // NON-Zod Errors (body empty, parse fail, etc.)
    return res.status(400).json({
      success: false,
      message: "Invalid request data",
      error: error.message
    });
  }
};
