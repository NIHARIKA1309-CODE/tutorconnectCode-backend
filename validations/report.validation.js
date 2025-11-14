import { z } from "zod";

// ✅ Create Report schema
export const createReportSchema = z.object({
  student: z.string().min(1, "Student ID is required"),
  teacher: z.string().min(1, "Teacher ID is required"),
  test: z.string().optional(),
  marksObtained: z.number().min(0, "Marks cannot be negative"),
  totalMarks: z.number().min(1, "Total marks must be at least 1"),
  remarks: z.string().max(1000).optional(),
  feedback: z.object({
    strengths: z.array(z.string()).optional(),
    improvements: z.array(z.string()).optional(),
    overallGrade: z.enum(["A", "B", "C", "D", "E", "F"]).optional(),
  }).optional(),
});

// ✅ Update Report schema
export const updateReportSchema = z.object({
  marksObtained: z.number().min(0).optional(),
  totalMarks: z.number().min(1).optional(),
  remarks: z.string().max(1000).optional(),
  feedback: z.object({
    strengths: z.array(z.string()).optional(),
    improvements: z.array(z.string()).optional(),
    overallGrade: z.enum(["A", "B", "C", "D", "E", "F"]).optional(),
  }).optional(),
});
