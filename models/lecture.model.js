import mongoose from "mongoose";
import { Section } from "./section.model.js";
const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lecture name is required"],
      trim: true,
      maxLength: [100, "Lecture title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Lecture description is required"],
      trim: true,
    },

    videoUrl: {
      type: String,
      required: [true, "Video url is required"],
    },
    notesUrl: {
      type: String,
    },
    duration: {
      type: Number,
      default: 0,
    },

    publicId: {
      type: String,
      required: [true, "Public ID is required"],
    },

    isPreview: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      required: [true, "Lecture order is required"],
    },

    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Lecture = mongoose.model("Lecture", lectureSchema);
