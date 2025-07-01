import mongoose from "mongoose";

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
      required: [true, "Notes url is required"],
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
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Lecture = mongoose.model("Lecture", lectureSchema);
