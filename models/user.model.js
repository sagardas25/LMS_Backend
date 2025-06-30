import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { kMaxLength } from "buffer";
import { match } from "assert";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is requires"],
      trim: true,
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is requires"],
      trim: true,
      unique: true,
      lowerCase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is requires"],
      minLength: [8, "Password must be of atleast 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: ["student", "instructor", "admin"],
        message: "Please select a valid role",
      },
      default: "student",
    },

    avatar: {
      type: String,
      default: "default-avatar.png",
    },

    bio: {
      type: String,
      maxLength: [200, "bio cannot exceed 50 characters"],
    },

    enrolledCourses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },

        enrolledAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    createdCourse: [
      {
        type: mongoose.SchemaType.Types.ObjectId,
        ref: "Course",
      },
    ],

    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,

    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
