import mongoose from "mongoose";

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
  },

  {
    timestamps: true,
  }
);

export const Section = mongoose.model("Section", sectionSchema);
