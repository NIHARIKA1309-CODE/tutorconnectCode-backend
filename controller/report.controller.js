import Report from "../models/Report.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


//total percentage and all the information you midded to calculate so 
// focus 
//  Create a new report (Teacher)
export const createReport = asyncHandler(async (req, res) => {
  const report = await Report.create(req.body);
  return res.status(201).json(new ApiResponse(201, { report }, "Report created successfully"));
});



//  Get all reports (Admin)
export const getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find()
    .populate("student", "user grade")
    .populate("teacher", "user subjects")
    .populate("test", "title subject");
  return res.status(200).json(new ApiResponse(200, { reports }, "All reports fetched successfully"));
});

//  Get report by ID (Authorized users)
export const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate("student", "user grade")
    .populate("teacher", "user subjects")
    .populate("test", "title subject");
  if (!report) return res.status(404).json(new ApiResponse(404, null, "Report not found"));
  return res.status(200).json(new ApiResponse(200, { report }, "Report fetched successfully"));
});

//  Update a report (Teacher/Admin)
export const updateReport = asyncHandler(async (req, res) => {
  const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!report) return res.status(404).json(new ApiResponse(404, null, "Report not found"));
  return res.status(200).json(new ApiResponse(200, { report }, "Report updated successfully"));
});

//  Delete a report (Admin only)
export const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findByIdAndDelete(req.params.id);
  if (!report) return res.status(404).json(new ApiResponse(404, null, "Report not found"));
  return res.status(200).json(new ApiResponse(200, null, "Report deleted successfully"));
});

//  Get reports by student
export const getReportsByStudent = asyncHandler(async (req, res) => {
  const studentId = req.params.studentId;
  const reports = await Report.find({ student: studentId })
    .populate("teacher", "user subjects")
    .populate("test", "title subject");
  return res.status(200).json(new ApiResponse(200, { reports }, "Reports fetched successfully"));
});

//  Get reports by teacher
export const getReportsByTeacher = asyncHandler(async (req, res) => {
  const teacherId = req.params.teacherId;
  const reports = await Report.find({ teacher: teacherId })
    .populate("student", "user grade")
    .populate("test", "title subject");
  return res.status(200).json(new ApiResponse(200, { reports }, "Reports fetched successfully"));
});



