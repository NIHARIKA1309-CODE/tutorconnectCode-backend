import Message from "../models/Message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";




/// this will complete depend upon what you have to used for the conversation so
// this is the raw data for this 
// ----------------- SEND MESSAGE -----------------
export const sendMessage = asyncHandler(async (req, res) => {
  const { sender, receiver, message, type, mediaUrl } = req.body;

  if (!sender || !receiver || (!message && !mediaUrl)) {
    throw new ApiError(400, "Sender, receiver, and message or mediaUrl are required");
  }

  const newMessage = await Message.create({ sender, receiver, message, type, mediaUrl });

  return res.status(201).json(new ApiResponse(201, { message: newMessage }, "Message sent successfully"));
});

// ----------------- GET CONVERSATION BETWEEN TWO USERS -----------------
export const getConversation = asyncHandler(async (req, res) => {
  const { userId } = req.params; // user to get conversation with
  const currentUserId = req.user._id;

  const messages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: userId },
      { sender: userId, receiver: currentUserId },
    ],
  }).sort({ createdAt: 1 });

  return res.status(200).json(new ApiResponse(200, { messages }, "Conversation fetched successfully"));
});

// ----------------- GET ALL USER CONVERSATIONS -----------------
export const getUserConversations = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  // Aggregate distinct conversation partners
  const conversations = await Message.aggregate([
    { $match: { $or: [{ sender: currentUserId }, { receiver: currentUserId }] } },
    {
      $project: {
        otherUser: {
          $cond: [
            { $eq: ["$sender", currentUserId] },
            "$receiver",
            "$sender",
          ],
        },
        message: 1,
        createdAt: 1,
        seen: 1,
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$otherUser",
        lastMessage: { $first: "$message" },
        lastMessageTime: { $first: "$createdAt" },
        seen: { $first: "$seen" },
      },
    },
  ]);

  return res.status(200).json(new ApiResponse(200, { conversations }, "User conversations fetched successfully"));
});

// ----------------- MARK MESSAGE AS SEEN -----------------
export const markAsSeen = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const message = await Message.findById(messageId);

  if (!message) throw new ApiError(404, "Message not found");

  // Only receiver can mark as seen
  if (message.receiver.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to mark this message as seen");
  }

  message.seen = true;
  await message.save();

  return res.status(200).json(new ApiResponse(200, { message }, "Message marked as seen"));
});
