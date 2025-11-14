import Course from "../models/Course.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// create course depend upon the frontend 
export const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create({ ...req.body, teacher: req.user._id });
  res.status(201).json(new ApiResponse(201, { course }, "Course created successfully"));
});




//get all courses 
export const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().populate("teacher", "user name");
  res.status(200).json(new ApiResponse(200, { courses }, "All courses fetched successfully"));
});




// by id 
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate("teacher", "user name");
  if (!course) throw new ApiError(404, "Course not found");
  res.status(200).json(new ApiResponse(200, { course }, "Course fetched successfully"));
});




// update course --> depend upon the role 
export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, "Course not found");

  if (req.user.role === "teacher" && !course.teacher.equals(req.user._id)) {
    throw new ApiError(403, "Not authorized to update this course");
  }

  Object.assign(course, req.body);
  await course.save();

  res.status(200).json(new ApiResponse(200, { course }, "Course updated successfully"));
});



// delete the courses 
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, "Course not found");

  if (req.user.role === "teacher" && !course.teacher.equals(req.user._id)) {
    throw new ApiError(403, "Not authorized to delete this course");
  }

  await course.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Course deleted successfully"));
});



//enrollment depend upon the frontend after visualization of each profile 
export const enrollInCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, "Course not found");

  const studentId = req.user._id;
  if (course.studentsEnrolled.includes(studentId)) {
    throw new ApiError(400, "Student already enrolled");
  }

  course.studentsEnrolled.push(studentId);
  await course.save();

  res.status(200).json(new ApiResponse(200, { course }, "Enrolled successfully"));
});




// ----------------- GET COURSES BY TEACHER -----------------
export const getCoursesByTeacher = asyncHandler(async (req, res) => {
  const courses = await Course.find({ teacher: req.params.teacherId });
  res.status(200).json(new ApiResponse(200, { courses }, "Courses by teacher fetched successfully"));
});

// ----------------- GET COURSES ENROLLED BY STUDENT -----------------
export const getEnrolledCoursesByStudent = asyncHandler(async (req, res) => {
  const courses = await Course.find({ studentsEnrolled: req.params.studentId });
  res.status(200).json(new ApiResponse(200, { courses }, "Student enrolled courses fetched successfully"));
});
