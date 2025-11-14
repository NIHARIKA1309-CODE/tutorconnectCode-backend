import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    // Teacher who created the test
    // After formation of teacher profile this will work correctly so after 
    // registration check that you make your teacher profile or not then try to
    // made the test 

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      required: true,
    },

    // Test title and subject
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },

    // Question set

    // this is the different section acording to the formation of
    // website we have to made this time to time 
    questions: [
      {
        questionText: { type: String,
           required: true },
        options: [{ type: String,
           required: true }],
        correctAnswer: { type: String,
           required: true },
        marks: { type: Number, 
          default: 1 }, // optional field to assign marks per question
      },
    ],

    // Students assigned this test
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentProfile",
      },
    ],

    // Total marks for test (can also be computed)
    totalMarks: {
      type: Number,
      default: 0,
    },

    //this are changed accordingly the frontend is formed 
    dueDate: { type: Date },

    duration: { type: Number }, 

    // Optional: status of test (draft, active, closed)
    status: {
      type: String,
      enum: ["draft", "active", "closed"],
      default: "draft",
    },
  },
  { timestamps: true }
);



const Test = mongoose.model("Test", testSchema);
export default Test;
