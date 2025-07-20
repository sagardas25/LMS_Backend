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
import { populate } from "dotenv";
import { updateSectionStats } from "./section.controller.js";

export const updateCourseStats = async (courseId) => {
  const course = await Course.findById(courseId).populate({
    path: "sections",
    populate: {
      path: "lectures",
    },
  });

  let totalLectures = 0;
  let totalDuration = 0;

  //loop through each section
  for (const section of course.sections) {
    // adding number of lectures in each section
    totalLectures += section.lectures.length;

    //sum durations of lectures in section

    totalDuration += section.lectures.reduce(
      (sum, lecture) => sum + (lecture.duration || 0),
      0
    );
  }

  (course.totalDuration = totalDuration),
    (course.totalLectures = totalLectures);

  await course.save();
};

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

const getStudentCourseDetails = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.user?._id;

  const course = await Course.findById(courseId)
    .populate({
      path: "instructor",
      select: "name email avatar",
    })

    .populate({
      path: "sections",
      populate: {
        path: "lectures",
        select:
          "title description duration order isPreview videoUrl notesUrl totalLectures totalLectures",
        options: { sort: { order: 1 } },
      },
      options: { sort: { order: 1 } },
    });

  if (!course) {
    throw new ApiError(400, "course not found ");
  }

  const isEnrolled = course.enrolledStudents.some(
    (studentId) => studentId.toString() === userId.toString()
  );

  const processedSection = course.sections.map((section) => {
    const processedLecture = section.lectures.map((lecture) => {
      return {
        _id: lecture._id,
        title: lecture.title,
        description: lecture.description,
        duration: lecture.duration,
        order: lecture.order,
        isPreview: lecture.isPreview,
        notesUrl: isEnrolled || lecture.isPreview ? lecture.notesUrl : null,
        videoUrl: isEnrolled || lecture.isPreview ? lecture.videoUrl : null,
      };
    });

    updateSectionStats(section._id);

    return {
      _id: section._id,
      title: section.title,
      order: section.order,
      lectures: processedLecture,
      totalLectures: section.lectures?.length,
      totalDuration: section.totalDuration,
    };
  });

  await updateCourseStats(courseId);

  const finalData = {
    _id: course._id,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    thumbnail: course.thumbnail,
    category: course.category,
    level: course.level,
    price: course.price,
    averageRating: course.averageRating,
    totalRatings: course.totalRatings,
    instructor: course.instructor,
    totalLectures: course.totalLectures,
    totalDuration: course.totalDuration,
    isEnrolled,
    sections: processedSection,
  };

  res
    .status(200)
    .json(new ApiResponse(200, finalData, "lecture fetched succesfully"));
});

const searchCourses = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return new ApiError(400, "Search query is required");
  }

  const suggestions = await Course.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { subtitle: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
    ],

    isPublished: true,
  })
    .select(
      "title description category level price averageRating totalRating _id thumbnail"
    )
    .limit(10)
    .populate({ path: "instructor", select: "fullName email avatar" });

  res
    .status(200)
    .json(new ApiResponse(200, suggestions, "Course suggestions fetched"));
});

const getCoursesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.query;

  const filter = { isPublished: true };

  if (category && category.toLowerCase() !== "all") {
    filter.category = category;
  }

  const courses = await Course.find(filter)
    .select(
      "title description category price level averageRating totalRating thumbnail _id"
    )
    .populate({
      path: "instructor",
      select: "fullName avatar",
    })
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses fetched by category"));
});

// this is a temporary controller to enroll student
// enrolling student will be handled by razorpay controllers (after payment)
const enrollStudent = asyncHandler(async (req, res) => {
  const { studentId, courseId } = req.params;
  const userId = req.user._id;

  const student = await User.findById(studentId);

  if (!student) {
    throw new ApiError(400, "cannot find student ");
  }

  const course = await Course.findById(courseId)
    .select("title description thumbnail enrolledStudents")
    .populate({
      path: "instructor",
      select: "fullName avatar email",
    });

  if (!course) {
    throw new ApiError(400, "cannot find course ");
  }

  const user = await User.findById(userId);

  //console.log(chalk.redBright("user  : "), chalk.greenBright(user));

  if (!user) {
    throw new ApiError(400, "cannot find user ");
  }

 
  // console.log(
  //   chalk.redBright("instructor match  : "),
  //   chalk.greenBright((userId).toString() == (course.instructor?._id).toString())
  // );
  // console.log(
  //   chalk.redBright("admin match  : "),
  //   chalk.greenBright(user.role != "admin")
  // );

  if ((userId.toString()) != (course.instructor?._id.toString()) && user.role != "admin") {
    throw new ApiError(400, "you are not authorize to enroll student");
  }

  course.enrolledStudents.push(studentId);
  course.save();

  const data = { course: courseId };
  student.enrolledCourses.push(data);
  student.save();

  console.log("student name : ", student.fullName);

  return res
    .status(200)
    .json(new ApiResponse(200, course, "student enrolled succesfully"));
});

export {
  createNewCourse,
  getMyCreatedCourses,
  publishCourse,
  getAllPublishedCourse,
  getAllUnpublishedCourse,
  updateCourseDetails,
  getStudentCourseDetails,
  searchCourses,
  getCoursesByCategory,
  enrollStudent,
};

// IMPLEMENT LATER
// 1. delete course by instructor --> requires bull redis setup for different delete queue
