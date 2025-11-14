import { z } from "zod";

//  Question schema for test creation
const questionSchema = z.object({
  questionText: z.string().min(1, "Question text is required"),
  options: z.array(z.string()).min(2, "At least two options are required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  marks: z.number().optional(),
});

//  Create Test schema
export const createTestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().optional(),
  questions: z.array(questionSchema).min(1, "At least one question is required"),
  dueDate: z.string().optional(), // ISO date string
  duration: z.number().optional(),
  status: z.enum(["draft", "active", "closed"]).optional(),
});


//   Update Test schema
export const updateTestSchema = z.object({
  title: z.string().optional(),
  subject: z.string().optional(),
  questions: z.array(questionSchema).optional(),
  dueDate: z.string().optional(),
  duration: z.number().optional(),
  status: z.enum(["draft", "active", "closed"]).optional(),
});



//  Assign Test to students schema
export const assignTestSchema = z.object({
  studentIds: z.array(z.string()).min(1, "At least one student ID is required"),
});
