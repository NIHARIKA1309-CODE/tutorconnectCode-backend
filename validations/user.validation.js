import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["student", "teacher", "admin"], {
    required_error: "Role is required",
  }),
  // Optional fields for student registration
  phone: z.union([z.string(), z.number()]).optional(),
  school: z.string().optional(),
  city: z.string().optional(),
  subjects: z.string().optional(),
  goals: z.string().optional(),
  // Optional fields for teacher registration
  qualification: z.string().optional(),
  experience: z.union([z.string(), z.number()]).optional(),
  bio: z.string().optional(),
  address: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
