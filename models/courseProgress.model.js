import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: [true, "Lecture reference is required"],
  },

  isCompleted: {
    type: Boolean,
    default: false,
  },

  watchTime: {
    type: Number,
    default: 0,
  },

  lastWatched: {
    type: Date,
    default: Date.now,
  },
});

const courseProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"],
    },

    isCompleted: {
      type: Boolean,
      default: 0,
    },

    completePercentage: {
      type: Number,
      default: 0,
      min: 0,
      max : 100
    },

    lectureProgress: [lectureProgressSchema],

    lastAccesses: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//update last accessed
courseProgressSchema.methods.updateLastAccessed = function () {
  this.lastAccesses = Date.now();
  return this.save({ validateBeforeSave: false });
};

//calculate course cpmpletion
courseProgressSchema.pre("save", function (next) {
  if (this.lectureProgress.length > 0) {
    const completedLectures = this.lectureProgress.filter(
      (lp) => lp.isCompleted
    ).length;

    this.completePercentage = Math.round(
      (completedLectures / this.lectureProgress.length) * 100
    );
    this.isCompleted = this.completePercentage === 100;
  }

  next();
});

export const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);
