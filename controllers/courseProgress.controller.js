import chalk from "chalk";
import { Course } from "../models/course.model.js";
import { Section } from "../models/section.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
} from "../utils/cloudinary.js";
import { Lecture } from "../models/lecture.model.js";
import { updateCourseStats } from "./course.controller.js";
import CourseProgress from '../models/courseProgress.model.js'

export const initCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  const existing = await CourseProgress.findOne({ user: userId, course: courseId });
  if (existing) {
    return res.status(200).json({ message: "Already initialized", data: existing });
  }

  const course = await Course.findById(courseId).populate("sections.lectures");
  if (!course) throw new ApiError(404, "Course not found");

  const lectures = course.sections.flatMap((s) => s.lectures || []);

  const lectureProgress = lectures.map((lec) => ({
    lecture: lec._id,
    isCompleted: false,
    watchTime: 0,
  }));

  const progress = await CourseProgress.create({
    user: userId,
    course: courseId,
    lectureProgress,
  });

  res.status(201).json({ success: true, data: progress });
});



export {initCourseProgress}