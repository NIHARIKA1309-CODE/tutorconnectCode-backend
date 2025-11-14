import express from "express";
import {
  sendMessage,
  getConversation,
  getUserConversations,
  markAsSeen,
} from "../controller/message.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { sendMessageSchema, markAsSeenSchema } from "../validations/message.validation.js";

const router = express.Router();

// Send a message
router.post("/", protect, authorizeRoles("student", "teacher"), validate(sendMessageSchema), sendMessage);

// Get conversation between two users
router.get("/conversation/:userId", protect, authorizeRoles("student", "teacher"), getConversation);

// Get all conversations for a user
router.get("/my", protect, authorizeRoles("student", "teacher"), getUserConversations);

// Mark message as seen
router.put("/:messageId/seen", protect, authorizeRoles("student", "teacher"),validate(markAsSeenSchema), markAsSeen);

export default router;
