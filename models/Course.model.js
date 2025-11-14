import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      required: true,
    },

  
    title: { type: String, required: true, trim: true },

    
    subjects: [
      {
        type: String,
        trim: true,
      },
    ],

    description: { type: String, trim: true },

  
    price: { type: Number, default: 0, min: 0 },
    duration: { type: Number, min: 1 }, // in hours

    //   Enrolled students
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentProfile",
      },
    ],

    
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },

    //   Course content (videos, PDFs, notes)
    //acoring to the need uploading will be handled easily 
    content: [
      {
        title: { type: String, trim: true },
        contentType: {
          type: String,
          enum: ["video", "pdf", "text"],
          default: "video",
        },
        url: { type: String, trim: true }, // Cloudinary or S3 link
        duration: { type: Number }
      },
    ],

   
    category: { type: String, trim: true },
    tags: [String],

    //   Whether course is published or in draft
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for faster search by teacher or category
courseSchema.index({ teacher: 1, category: 1 });

const Course = mongoose.model("Course", courseSchema);
export default Course;
