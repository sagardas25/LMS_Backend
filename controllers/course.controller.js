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
  console.log("thumbnailLocalPath : ", thumbnailLocalPath);

  let thumbnail;

  try {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    console.log(chalk.greenBright("uploaded thumbnail on cloudinary"));
  } catch (error) {
    console.log("error in uploading thumbnail : ", chalk.bgRedBright(error));
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
      chalk.redBright("thumbnail of newCourse : ", newCourse.thumbnail)
    );

    if (!newCourse) {
      throw new ApiError(500, "course was not created");
    }

    instructor.createdCourse.push(newCourse._id);

    await instructor.save({ validateBeforeSave: false });

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
const getMyCreatedCourses = asyncHandler(async (req, res) => {
  const instructorId = req.user?._id;

  const instructor = await User.findById(instructorId).populate(
    "createdCourse"
  );

  // console.log("instructor : " , chalk.magentaBright(instructor));

  if (!instructor) {
    throw new ApiError(200, "instructor not found");
  }

  const instructorCourses = instructor.createdCourse;

  if (!instructorCourses) {
    throw new ApiError(400, "cannot find any course");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, instructorCourses, "All courses fetched succesfully")
    );
});
const getAllPublishedCourse = asyncHandler(async (req, res) => {
  const instructorId = req.user?._id;

  const instructor = await User.findById(instructorId).populate({
    path: "createdCourse",
    match: { isPublished: true },
  });

  // console.log("instructor : " , chalk.magentaBright(instructor));

  if (!instructor) {
    throw new ApiError(200, "instructor not found");
  }

  const instructorCourses = instructor.createdCourse;

  if (!instructorCourses) {
    throw new ApiError(400, "cannot find any course");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        instructorCourses,
        "All published courses fetched succesfully"
      )
    );
});
const getAllUnpublishedCourse = asyncHandler(async (req, res) => {
  const instructorId = req.user?._id;

  const instructor = await User.findById(instructorId).populate({
    path: "createdCourse",
    match: { isPublished: false },
  });

  // console.log("instructor : " , chalk.magentaBright(instructor));

  if (!instructor) {
    throw new ApiError(200, "instructor not found");
  }

  const instructorCourses = instructor.createdCourse;

  if (!instructorCourses) {
    throw new ApiError(400, "cannot find any course");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        instructorCourses,
        "All published courses fetched succesfully"
      )
    );
});
const publishCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(400, "course not found");
  }

  course.isPublished = true;

  course.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new ApiResponse(201, course, "course published succesfully"));
});
const updateCourseDetails = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const { title, subtitle, description, price } = req.body;

  if (!courseId || typeof courseId != "string") {
    throw new ApiError(400, "course id is required and must be type of string");
  }

  if (Object.keys(req.body).length === 0 || !req.body) {
    throw new ApiError(400, "body is empty....");
  }

  if (
    [title, subtitle, description, price].some((fields) => fields?.trim() == "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const thumbnailLocalPath = req.file?.path;
  //console.log("thumbnailLocalPath : " , thumbnailLocalPath);

  let thumbnail;

  try {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    console.log(chalk.greenBright("uploaded thumbnail on cloudinary"));
  } catch (error) {
    console.log("error in uploading thumbnail : ", chalk.bgRedBright(error));
    throw new ApiError(500, "something went wrong during uploading avatar");
  }

  try {
    const updatedData = {};
    if (title != "undefined") updatedData.title = title;
    if (subtitle != "undefined") updatedData.subtitle = subtitle;
    if (description != "undefined") updatedData.description = description;
    if (price != "undefined") updatedData.price = price;
    if (thumbnail?.url) updatedData.thumbnail = thumbnail?.url;

    if (Object.keys(updatedData).length === 0) {
      throw new ApiError(
        400,
        "At least one field must be provided for update."
      );
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCourse) {
      throw new ApiError(409, " error while updating course details");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedCourse,
          "course details updated succesfully"
        )
      );
  } catch (error) {
    console.log("course updation failed , error : ", chalk.bgRedBright(error));

    // console.log(thumbnail);

    // deleting the files from cloudinary in case of failed course creation
    if (thumbnail) {
      console.log("deleted thumbnail from cloudinary");
      await deleteMediaFromCloudinary(thumbnail.public_id);
    }

    throw new ApiError(
      500,
      "something went wrong during updating course so deleted files from cloudinary"
    );
  }
});


export {
  createNewCourse,
  getMyCreatedCourses,
  publishCourse,
  getAllPublishedCourse,
  getAllUnpublishedCourse,
  updateCourseDetails,
};



// IMPLEMENT LATER
// 1. controller to fetch course details for public view --> locking lecture for public
// 2. controller to search courses with auto suggetions
// 4. all courses list --> locking lecture for public
// 3. delete course by instructor --> requires bull redis setup for different delete queue