import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";


dotenv.config();

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is requires"],
      trim: true,
      maxLength: [50, "Name cannot exceed 50 characters"],
      minLength: [2, "Name must be at least 2 characters"],
      match: [/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"],
    },
    email: {
      type: String,
      required: [true, "Email is requires"],
      trim: true,
      unique: true,
      lowercase: true,
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
      default: process.env.DEFAULT_AVATAR_URL,
    },

    bio: {
      type: String,
      maxLength: [200, "bio cannot exceed 200 characters"],
      minLength: [10, "Bio must be at least 10 characters"],
      match: [
        /^[a-zA-Z0-9\s.,'";:!?()-]{10,200}$/,
        "Bio must be 10 to 200 characters and contain only letters, numbers, and punctuation",
      ],
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordTokenExpire: {
      type: Date,
      select: false,
    },

    refreshToken: {
      type: String,
      select: false,
    },

    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//hashing the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

//comapring the passwond while login
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//get resetPassword Token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(9).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

//getting last active
userSchema.methods.updateLastActive = function () {
  this.lastActive = Date.now();
  return this.save({ validateBeforeSave: false });
};

//virtual field for total enrolled courses
userSchema.virtual("totalEnrolledCouses").get(function () {
  return this.enrolledCourses.length;
});

//custom method for generating access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

//custom method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
