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
import { Section } from "../models/section.model.js";
import { Lecture } from "../models/lecture.model.js";

// POST /sections/:sectionId/lectures
const addLectureToSection = asyncHandler(async (req, res) => {
  const sectionId = req.params.sectionId;
  const { title, description, isPreview } = req.body;

  if (Object.keys(req.body).length === 0 || !req.body) {
    throw new ApiError(400, "body is empty....");
  }

  if ([title, description].some((fields) => fields?.trim() == "")) {
    throw new ApiError(400, "All fields are required");
  }

  const section = await Section.findById(sectionId);

  if (!section) {
    throw new ApiError(400, "section not found");
  }

  const videopath = req.files?.video?.[0].path;
  const notesPath = req.files?.note?.[0].path;

  if (!videopath) throw new ApiError(400, "Video file is required");

  // const videoUpload = await uploadOnCloudinary(videopath, "video");
  // const notesUpload = await uploadOnCloudinary(notesPath, "raw");

  console.log(
    chalk.redBright("notesUpload : ") +
      chalk.yellowBright(JSON.stringify(notesUpload, null, 2))
  );
  console.log(
    chalk.redBright("videoUpload : ") +
      chalk.yellowBright(JSON.stringify(videoUpload, null, 2))
  );

  if (!videoUpload?.secure_url) {
    throw new ApiError(500, "File upload to Cloudinary failed");
  }

  const DurationInSeconds = Math.round(videoUpload.duration || 0);

  const lastLecture = await Lecture.findOne({ section: sectionId })
    .sort({ order: -1 })
    .select("order");

  const newOrder = lastLecture ? lastLecture.order + 1 : 1;

  try {
    const lecture = await Lecture.create({
      title,
      description,
      isPreview,
      order: newOrder,
      duration: DurationInSeconds,
      videoUrl: videoUpload?.secure_url,
      notesUrl: notesUpload?.secure_url || null,
      publicId: videoUpload?.public_id,
      section: sectionId,
    });

    section.lectures.push(lecture._id);
    await section.save();

    return res
      .status(201)
      .json(new ApiResponse(201, lecture, "lecture added sccesfully"));
  } catch (error) {
    console.log("lecture creation failed , error : ", error);

    // deleting the files from cloudinary in case of failed lecture creation
    // the files will be uploaded in case other failure in updation
    if (notesUpload) {
      console.log(chalk.red("deleted  notes from cloudinary"));
      await deleteMediaFromCloudinary(notesUpload?.public_id);
    }

    if (videoUpload) {
      console.log(chalk.red("deleted  notes from cloudinary"));
      await deleteVideoFromCloudinary(videoUpload?.public_id);
    }
    throw new ApiError(
      500,
      "something went wrong during creating lecture so deleted files from cloudinary"
    );
  }
});

// DELETE /sections/:sectionId/lectures/:lectureId
const removeLectureFromSection = asyncHandler(async (req, res) => {});

// bulk delete video -- > needs redis bull setup

export { addLectureToSection, removeLectureFromSection };
