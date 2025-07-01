import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
      maxLength: [100, "Course title cannot exceed 100 characters"],
    },
    subtitle: {
      type: String,
      trim: true,
      maxLength: [100, "Course subtitle title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Course category is required"],
      trim: true,
    },
    level: {
      type: String,
      required: [true, "Course description is required"],
      enum: {
        vlues: ["beginner", "intermediate", "advanced"],
        message: "Please seelct a valid level",
      },
      default: "beginner",
    },

    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: [0, "course price must be non -ve "],
    },

    thumbnail: {
      type: String,
      required: [true, "Course thumbnail is required"],
    },

    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture ",
      },
    ],

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User ",
      required: [true, "Course instructor is required"],
    },

    isPublished: {
      type: Boolean,
      default: false,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.virtual("averageRating").get(function () {
  return 0;
  // implement later
});

courseSchema.pre("save", function (next) {
  if (this.lectures) {
    this.totalLectures = this.lectures.length;
  }

  next();
});

export const Course = mongoose.model("Course", courseSchema)
