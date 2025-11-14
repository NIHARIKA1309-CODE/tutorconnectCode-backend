import mongoose from "mongoose";

const teacherProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subjects: [{ type: String,
       required: true }],
    qualification: { type: String,
                  required: true },

    experience: { type: Number,
                      default: 0 },

    bio: { type: String,
       required: true },
    city: { type: String, 
      required: true },
    address: { type: String,
       required: true },
    ratings: { type: Number,
       default: 0 },
    offlineAvailable: { type: Boolean,
       default: true },
    verified: { type: Boolean,
       default: false },
    avatar: { type: String }, // optional avatar specific to profile
  },
  { timestamps: true }
);

const TeacherProfile = mongoose.model("TeacherProfile", teacherProfileSchema);
export default TeacherProfile;
