import chalk from "chalk";
import { Course } from "../models/course.model.js";
import { Section } from "../models/section.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSection = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const { title } = req.body;

  // console.log("courseID : " , courseId);
  // console.log("title : " , title);

  if (!title || !courseId) {
    throw new ApiError(500, "course id and section title required");
  }

  const section = await Section.create({
    title,
    course: courseId,
  });

  if (!section) {
    throw new ApiError(500, "error occured during creating section");
  }

  // ,.log("section : " , chalk.green(section));
  // console.log("section id : " , chalk.yellow(section?._id));

  const course = await Course.findById(courseId);

  // console.log("course : " , course);

  if (!course) {
    throw new ApiError(500, "error occured during fetching course");
  }

  course.sections.push(section?._id);

  course.save();

  return res
    .status(201)
    .json(new ApiResponse(201, section, "section created succesfully"));
});

const getAllSectionsForCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;

  const course = await Course.findById(courseId).populate("sections");

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const allSections = course.sections;

  if (!allSections) {
    throw new ApiError(
      500,
      "error while fetching all sections for this course"
    );
  }

  // console.log("all-sections : " , chalk.yellow(allSections));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allSections,
        "fetched all sections for this course succesfully"
      )
    );
});

const updateSectionTitle = asyncHandler(async (req, res) => {
  const sectionId = req.params.sectionId;
  const { title } = req.body;

  if (!title || !sectionId) {
    throw new ApiError(500, "course id and section title required");
  }

  const updatedSection = await Section.findByIdAndUpdate(
    sectionId,
    { title },
    {
      runValidators: true,
      new: true,
    }
  );

  // const section = await Section.findById(sectionId);

  // section.title = title;

  // section.save();

  if (!updatedSection) {
    throw new ApiError(500, "error occured while upadating section");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedSection, "section title updated succesfully")
    );
});

// DELETE /sections/:sectionId
const deleteSection = asyncHandler(async (req, res) => {

  const sectionId = req.params.sectionId;

  await Section.findByIdAndDelete(sectionId)

  return res.status(200).json(new ApiResponse(200,{} , "section deleted succesfully"))

});

const getLectureInSection = asyncHandler(async (req, res) => {
  const sectionId = req.params.sectionId;

  const section = await Section.findById(sectionId).populate("lectures");

  const lecture = section.lectures

  if (!section) {
    throw new ApiError(500, "Lectures not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, lecture, "fetched all the lectures succesfully")
    );
});

export {
  createSection,
  getAllSectionsForCourse,
  updateSectionTitle,
  deleteSection,
  getLectureInSection
};
