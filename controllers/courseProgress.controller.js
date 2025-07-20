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



