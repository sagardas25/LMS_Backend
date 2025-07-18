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

sectionSchema.pre("save", function (next) {
  if (this.lectures) {
    this.totalLectures = this.lectures.length;
  }

  let totalDuration = 0;

  for (const lecture of this.lectures) {
    totalDuration += lecture.duration;
  }
  this.totalDuration = totalDuration;

  next();
});

export const Section = mongoose.model("Section", sectionSchema);
