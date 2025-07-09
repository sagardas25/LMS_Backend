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
      enum: {
        values: [
          "Web Development",
          "Mobile Development",
          "Data Science",
          "Programming Languages",
          "Machine Learning",
          "AI",
          "UI/UX Design",
          "Cybersecurity",
          "Business",
          "Other",
        ],
        message: "Please select a valid category",
      },
      required: [true, "Course category is required"],
      trim: true,
    },
    level: {
      type: String,
      required: [true, "Course description is required"],
      enum: {
        values: ["beginner", "intermediate", "advanced"],
        message: "Please select a valid level",
      },
      default: "beginner",
    },

    price: {
      type: Number,
      required: [true, "Course price is required"],
      default: 0,
      min: [0, "course price must be non -ve "],
    },

    thumbnail: {
      type: String,
      required: [true, "Course thumbnail is required"],
      default: "thumbnail/new.jpg",
    },

    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
    ],

    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalRatings: {
      type: Number,
      min: 0,
      default: 0,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

// courseSchema.virtual("averageRating").get(function () {
//   return 0;
//   // implement later
// });

courseSchema.pre("save", function (next) {
  if (this.lectures) {
    this.totalLectures = this.lectures.length;
  }

  next();
});

export const Course = mongoose.model("Course", courseSchema);
