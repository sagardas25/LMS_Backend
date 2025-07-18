import mongoose from "mongoose";
import { updateCourseStats } from "../controllers/course.controller.js";

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minLength: [3, "Section title must be at least 3 characters"],
      maxLength: [100, "Section title cannot exceed 100 characters"],
      trim: true,
      required: [true, "title is required"],
    },

    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    totalDuration: {
      type: Number,
      default: 0,
    },

    totalLectures: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

// Run after adding a section
sectionSchema.post("save", async function () {
  if (this.course) {
    await updateCourseStats(this.course);
  }
});

// Run after deleting a section
sectionSchema.post("remove", async function () {
  if (this.course) {
    await updateCourseStats(this.course);
  }
});

export const Section = mongoose.model("Section", sectionSchema);
