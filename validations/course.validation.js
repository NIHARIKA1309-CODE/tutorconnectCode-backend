import { z } from "zod";

// ----------------------------------------------------
// ZOD SCHEMA
// ----------------------------------------------------
export const courseSchema = z.object({
  teacher: z.string().optional(), // will be overwritten by req.user._id
  title: z.string().min(2, "Title must be at least 2 characters"),
  subjects: z.array(z.string()).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  duration: z.number().min(1, "Duration must be at least 1 hour").optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),

  content: z
    .array(
      z.object({
        title: z.string().nonempty("Content title is required"),
        contentType: z.enum(["video", "pdf", "text"]),
        url: z.string().url("Invalid content URL"),
        duration: z.number().optional(),
      })
    )
    .optional(),
});

// ----------------------------------------------------
// VALIDATION MIDDLEWARE
// ----------------------------------------------------
export const validateCourse = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors[0].message,
    });
  }

  req.body = parsed.data;
  next();
};
