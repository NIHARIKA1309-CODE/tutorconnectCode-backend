import { z } from "zod";

// ✅ Student profile creation schema
export const createStudentSchema = z.object({
  grade: z.string().min(1, "Grade is required"),
  subjectsChosen: z.array(z.string()).min(1, "At least one subject is required"),
  teacher: z.string().optional(),
  city: z.string().optional(),
  contactNumber: z.string().optional(),
});

// ✅ Student profile update schema
export const updateStudentSchema = z.object({
  grade: z.string().optional(),
  subjectsChosen: z.array(z.string()).optional(),
  teacher: z.string().optional(),
  city: z.string().optional(),
  contactNumber: z.string().optional(),
});

// ✅ Teacher can update metrics (performance, attendance, assignment)
export const teacherUpdateMetricsSchema = z
  .object({
    performance: z.coerce.number().min(0).max(100).optional(),
    attendance: z.coerce.number().min(0).max(100).optional(),
    assignment: z.coerce.number().min(0).max(100).optional(),
  })
  .refine(
    (data) =>
      data.performance !== undefined ||
      data.attendance !== undefined ||
      data.assignment !== undefined,
    {
      message: "At least one metric (performance, attendance, assignment) must be provided",
      path: ["metrics"],
    }
  );
