import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    // Relationships
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      required: true,
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
    },

    // Performance Details
    marksObtained: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalMarks: {
      type: Number,
      default: 100,
      min: 1,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    timeTaken: {
      type: Number,
      default: 1000,
    },

    // Feedback & Evaluation
    feedback: {
      strengths: [String],
      improvements: [String],
      overallGrade: {
        type: String,
        enum: ["A", "B", "C", "D", "E", "F"],
      },
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Optional fields
    passed: {
      type: Boolean,
      default: false, // will be recalculated in pre("save")
    },
  },
  { timestamps: true }
);

// Auto-calculate percentage and passed before saving
reportSchema.pre("save", function (next) {
  if (this.totalMarks > 0) {
    this.percentage = (this.marksObtained / this.totalMarks) * 100;
    this.passed = this.percentage >= 40;
  }
  next();
});

// Index for efficient lookups
reportSchema.index({ student: 1, teacher: 1, test: 1 });

//  Prevent OverwriteModelError
const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);

export default Report;
