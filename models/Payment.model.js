import mongoose from "mongoose";


const paymentSchema = new mongoose.Schema(
  {
    // Student who made the payment
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },

    // Teacher receiving the payment
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      required: true,
    },

    // Optional: related report for which payment is made
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },

    // Payment amount
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Payment status
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    // Optional: payment method
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "wallet", "other"],
      default: "card",
    },

    // Optional: transaction reference
    transactionId: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
paymentSchema.index({ student: 1, teacher: 1, report: 1, status: 1 });


const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
