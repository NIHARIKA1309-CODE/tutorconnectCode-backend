// validation/teacher.validation.js
import { z } from "zod";

export const teacherProfileSchema = z.object({
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  qualification: z.string().min(2),
  experience: z.number().min(0),
  bio: z.string().min(10),
  city: z.string().min(2),
  address: z.string().min(5),
  offlineAvailable: z.boolean().optional(),
});
