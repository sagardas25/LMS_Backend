import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      max: [5, "rating cannot exceed 5"],
      min: [1, "rating cannot below 1"],
      required: true,
    },

    review: {
      type: String,
      maxLength: [500, "review cannot exceed 500 letters"],
      minLength: [0, "review cannot exceed 500 letters"],
    },
  },
  {
    timestamps: true,
  }
);

export const Rating = mongoose.model("Rating", ratingSchema);
