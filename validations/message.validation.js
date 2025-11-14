import { z } from "zod";

// Send message schema
export const sendMessageSchema = z.object({
  receiver: z.string().min(1, "Receiver ID is required"),
  message: z.string().optional(),
  type: z.enum(["text", "image", "pdf", "file", "emoji", "video"]).default("text"),
  mediaUrl: z.string().url().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
});

// Mark as seen schema
export const markAsSeenSchema = z.object({
  messageId: z.string().min(1, "Message ID is required"),
});
