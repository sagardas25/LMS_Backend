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
import { Course } from "../models/course.model.js";

const createNewCourse = asyncHandler(async (req, res) => {
  const { title, subtitle, description, category, level, price } = req.body;

  if (Object.keys(req.body).length === 0 || !req.body) {
    throw new ApiError(400, "body is empty....");
  }

  if (
    [title, subtitle, description, category, level, price].some(
      (fields) => fields?.trim() == ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const thumbnailLocalPath = req.file.path;
  console.log("thumbnailLocalPath : " + thumbnailLocalPath);

  let thumbnail;

  try {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    console.log(chalk.greenBright("uploaded thumbnail on cloudinary"));
  } catch (error) {
    console.log("error in uploading thumbnail : " + chalk.bgRedBright(error));
    throw new ApiError(500, "something went wrong during uploading avatar");
  }

  const instructorId = req.user._id;

  const instructor = await User.findById(instructorId);

  if (!instructor || instructor.role !== "instructor") {
    throw new ApiError(400, "intructor not found");
  }

  try {
    const newCourse = await Course.create({
      title,
      subtitle,
      description,
      category,
      level,
      price,
      instructor: instructor?._id,
      thumbnail: thumbnail?.url || undefined,
    });

    console.log(
      chalk.redBright("thumbnail of newCourse : " + newCourse.thumbnail)
    );

    if (!newCourse) {
      throw new ApiError(500, "course was not created");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, newCourse, "course created succesfully"));
  } catch (error) {
    console.log("course creation failed , error : " + chalk.bgRedBright(error));

    // console.log(thumbnail);

    // deleting the files from cloudinary in case of failed course creation
    if (thumbnail) {
      console.log("deleted avatar from cloudinary");
      await deleteMediaFromCloudinary(thumbnail.public_id);
    }

    throw new ApiError(
      500,
      "something went wrong during creating course so deleted files from cloudinary"
    );
  }
});

export { createNewCourse };
