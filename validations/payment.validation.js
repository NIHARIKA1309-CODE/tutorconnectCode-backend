import { z } from "zod";

// ✅ Create Payment schema
export const createPaymentSchema = z.object({
  student: z.string().min(1, "Student ID is required"),
  teacher: z.string().min(1, "Teacher ID is required"),
  amount: z.number().min(1, "Amount must be at least 1"),
  currency: z.string().default("USD"),
  status: z.enum(["pending", "completed", "failed", "refunded"]).default("pending"),
  description: z.string().optional(),
});

// ✅ Update Payment status schema
export const updatePaymentStatusSchema = z.object({
  status: z.enum(["pending", "completed", "failed", "refunded"], {
    required_error: "Status is required",
  }),
});
