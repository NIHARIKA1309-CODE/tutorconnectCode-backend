import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    //   Who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //   Who received it
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //   Text message (optional if file/image)
    message: {
      type: String,
      trim: true,
    },

    //   Type of message (text, image, pdf, etc.)
    type: {
      type: String,
      enum: ["text", "image", "pdf", "file", "emoji", "video"],
      default: "text",
    },

    //   File or media link (stored in Cloudinary, AWS S3, etc.)
    mediaUrl: {
      type: String,
    },

    //   File metadata
    fileName: {
      type: String,
    },
    fileSize: {
      type: Number, // in bytes
    },

    //   Seen status
    seen: {
      type: Boolean,
      default: false,
    },

    //   Optional read time
    seenAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

//   Optimized index for fast chat lookups (sorted by time)
messageSchema.index({ sender: 1, receiver: 1, createdAt: 1 });

// Automatically update 'seenAt' when marked as seen
messageSchema.pre("save", function (next) {
  if (this.isModified("seen") && this.seen === true && !this.seenAt) {
    this.seenAt = new Date();
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
