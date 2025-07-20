import chalk from "chalk";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
} from "../utils/cloudinary.js";

const getAllStudents = asyncHandler(async (req, res) => {
  const allStudents = await User.find({ role: "student" })
    .select(
      "-password -refreshToken -resetPasswordToken -resetPasswordTokenExpire"
    )
    .sort({ createdAt: -1 });

  if (!allStudents) {
    throw new ApiError(500, "error while fetching all students");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allStudents, "fetched all students"));
});

const getAllInstructor = asyncHandler(async (req, res) => {
  const allStudents = await User.find({ role: "instructor" })
    .select(
      "-password -refreshToken -resetPasswordToken -resetPasswordTokenExpire"
    )
    .sort({ createdAt: -1 });

  if (!allStudents) {
    throw new ApiError(500, "error while fetching all instructors");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allStudents, "fetched all instructors"));
});

const promoteToInstructor = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) throw new ApiError(400, "user not found");

  if (user.role == "instructor") {
    throw new ApiError(400, "User is already an instructor");
  }

  user.role = "instructor";
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, `${user.fullName} promoted to instructor`)
    );
});

export { getAllStudents, getAllInstructor, promoteToInstructor };
