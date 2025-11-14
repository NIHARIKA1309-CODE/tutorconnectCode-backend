import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    grade: { type: String },
    subjectsChosen: [{ type: String }],
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
    },
    performance: { type: Number,
       default: 0 },
    attendance: { type: Number,
                   default: 0 },
    assignment: { type: Number,
                default: 0 },
    achievements: { type: [String], required: true },
    walletBalance: { type: Number,
       default: 0 },
    city: { type: String ,required:true},

    contactNumber: { type: String },
    // after login this will fetched from user details if he is student 
    avatar: { type: String }, 
  },
  { timestamps: true }
);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);
export default StudentProfile;
