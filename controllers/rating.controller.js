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
import { Rating } from "../models/rating.model.js";
import mongoose from "mongoose";
import { Course } from "../models/course.model.js";

const updateRatingStats = async (courseId) => {
  const stat = await Rating.aggregate([
    {
      $match: { course: new mongoose.Types.ObjectId(courseId) },
    },
    {
      $group: {
        _id: "$course",
        averageRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  const { averageRating = 0, totalRatings = 0 } = stat[0] || {};

  await Course.findByIdAndUpdate(courseId, {
    averageRating: parseFloat(averageRating.toFixed(1)),
    totalRatings: totalRatings,
  });
};

const submitRating = asyncHandler(async (req, res) => {
  const studentId = req.user?._id;
  const { rating, review } = req.body;
  const courseId = req.params.courseId;

  if (!studentId) {
    throw new ApiError(500, "cannot find studentId");
  }
  if (!courseId) {
    throw new ApiError(500, "cannot find courseId");
  }

  // ,.log(chalk.yellow("studentId : " , studentId));
  // console.log(chalk.yellow("review : " , req.body.review));
  // console.log(chalk.yellow("courseId : " , courseId));

  
  const existingReview = await Rating.findOne({
    course: courseId,
    student: studentId,
  });

  if (existingReview) {
    throw new ApiError(400, " You cannot add more than one review");
  }

  const newRating = await Rating.create({
    student: studentId,
    course: courseId,
    rating,
    review,
  });

  //console.log(chalk.yellowBright("new Rating : " , newRating));

  if (!newRating) {
    throw new ApiError(500, "something went wrong while adding review");
  }

  await updateRatingStats(courseId);

  const course = await Course.findById(courseId).select(
    "averageRating totalRatings"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        averageRating: course.averageRating,
        totalRatings: course.totalRatings,
        newRating,
      },
      "added rating succesfully"
    )
  );
});

const updateRating = asyncHandler(async (req, res) => {
  const studentId = req.user?._id;
  const { rating, review } = req.body;
  const courseId = req.params.courseId;

  if (!studentId) {
    throw new ApiError(500, "cannot find studentId");
  }
  if (!courseId) {
    throw new ApiError(500, "cannot find courseId");
  }

  const existingReview = await Rating.findOne({
    course: courseId,
    student: studentId,
  });

  if (!existingReview) {
    throw new ApiError(500, "no existing review");
  }

  if (existingReview) {
    (existingReview.rating = rating), (existingReview.review = review);
  }

  await existingReview.save();

  const course = await Course.findById(courseId).select(
    "averageRating totalRatings"
  );

  const updatedRating = {
    averageRating: course.averageRating,
    totalRatings: course.totalRatings,
    existingReview,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, updatedRating, "review updated succesfully"));
});

const deleteRating = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  const rating = await Rating.findOneAndDelete({
    course: courseId,
    student: userId,
  });
  if (!rating) throw new ApiError(404, "Rating not found");

  await updateRatingStats(courseId);

  res.status(200).json(new ApiResponse(200, {}, "deleted review succesfully"));
});

const getAllRating = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  //console.log("courseId : " , courseId);

  const reviews = await Rating.find({ course: courseId })
    .populate({ path: "student", select: "fullName avatar" })
    .sort({ createdAt: -1 });

  //console.log("review : " , reviews);

  const course = await Course.findById(courseId).select(
    "averageRating totalRatings"
  );

  const reviewsStat = {
    averageRating: course.averageRating,
    totalRatings: course.totalRatings,
    reviews,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, reviewsStat, "reviews fetched succesfully"));
});

export { submitRating, updateRating, deleteRating, getAllRating };
