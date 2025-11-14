import Test from "../models/Test.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// ----------------- CREATE TEST -----------------
export const createTest = asyncHandler(async (req, res) => {
  if (req.user.role !== "teacher" || !req.user.teacherProfile) {
    throw new ApiError(403, "Only teachers can create tests");
  }

  const { title, subject, questions, dueDate, duration, status } = req.body;

  if (!questions || questions.length === 0) {
    throw new ApiError(400, "At least one question is required");
  }

  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);

  const test = await Test.create({
    teacher: req.user.teacherProfile,
    title,
    subject,
    questions,
    totalMarks,
    dueDate,
    duration,
    status,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { test }, "Test created successfully"));
});











// ----------------- GET ALL TESTS -----------------
export const getAllTests = asyncHandler(async (req, res) => {
  let tests;

  if (req.user.role === "teacher") {
    tests = await Test.find({ teacher: req.user.teacherProfile });
  } else if (req.user.role === "student") {
    tests = await Test.find({ assignedTo: req.user.studentProfile });
  } else {
    tests = await Test.find(); // Admin sees all tests
  }

  return res.status(200).json(new ApiResponse(200, { tests }, "Tests fetched successfully"));
});

// ----------------- GET TEST BY ID -----------------
export const getTestById = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id)
    .populate("teacher", "user subjects")
    .populate("assignedTo", "user name");

  if (!test) throw new ApiError(404, "Test not found");

  // Students can only access tests assigned to them
  if (
    req.user.role === "student" &&
    !test.assignedTo.some((s) => s._id.equals(req.user.studentProfile))
  ) {
    throw new ApiError(403, "You are not assigned to this test");
  }

  return res.status(200).json(new ApiResponse(200, { test }, "Test fetched successfully"));
});

// ----------------- UPDATE TEST -----------------
export const updateTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (!test) throw new ApiError(404, "Test not found");

  if (req.user.role === "teacher" && !test.teacher.equals(req.user.teacherProfile)) {
    throw new ApiError(403, "Not authorized to update this test");
  }

  const updates = { ...req.body };
  if (updates.questions) {
    updates.totalMarks = updates.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
  }

  Object.assign(test, updates);
  await test.save();

  return res.status(200).json(new ApiResponse(200, { test }, "Test updated successfully"));
});

// ----------------- DELETE TEST -----------------
export const deleteTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (!test) throw new ApiError(404, "Test not found");

  if (req.user.role === "teacher" && !test.teacher.equals(req.user.teacherProfile)) {
    throw new ApiError(403, "Not authorized to delete this test");
  }

  await test.deleteOne();
  return res.status(200).json(new ApiResponse(200, null, "Test deleted successfully"));
});

// ----------------- ASSIGN TEST TO STUDENTS -----------------
export const assignTestToStudents = asyncHandler(async (req, res) => {
  if (req.user.role !== "teacher" || !req.user.teacherProfile) {
    throw new ApiError(403, "Only teachers can assign tests");
  }

  const test = await Test.findById(req.params.id);
  if (!test) throw new ApiError(404, "Test not found");

  if (!test.teacher.equals(req.user.teacherProfile)) {
    throw new ApiError(403, "You can only assign your own tests");
  }

  const { studentIds } = req.body;
  if (!studentIds || !Array.isArray(studentIds)) {
    throw new ApiError(400, "studentIds must be an array of IDs");
  }

  const validStudents = await StudentProfile.find({ _id: { $in: studentIds } });
  const validStudentIds = validStudents.map((s) => s._id.toString());

  test.assignedTo = Array.from(new Set([...test.assignedTo.map(String), ...validStudentIds]));
  await test.save();

  return res.status(200).json(new ApiResponse(200, { test }, "Test assigned to students successfully"));
});
