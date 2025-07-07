import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";
import fs from "fs";
import {
  uploadOnCloudinary,
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong during token generation");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  // checks if the body is empty
  if (Object.keys(req.body).length === 0 || !req.body) {
    throw new ApiError(400, "body is empty....");
  }

  if ([fullName, email, password].some((fields) => fields?.trim() == "")) {
    throw new ApiError(400, "All fields are required");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  //console.log('req.file : ' + req.file);
  // console.log("avatarLocalPath : " + avatarLocalPath);

  const existedUser = await User.findOne({ email });

  //delete the uploaded files in local server in case of existed user
  //even if user exists file will be uploaded in local server
  //beacause it uploads the files way before checking the exixted user
  if (existedUser) {
    fs.unlink(avatarLocalPath, (err) => {
      if (err) {
        console.log(
          "error in deleting avatar in case of existing avatar" + err
        );
      }
    });

    throw new ApiError(409, "user with same  email already exists");
  }

  // if (!avatarLocalPath) {
  //   throw new ApiError(409, "avatar file does not exist");
  // }

  // uploading avatar and cover image from local server
  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    // console.log("uploaded avatar on cloudinary", avatar);
  } catch (error) {
    console.log("error in uploading avatar : " + error);
    throw new ApiError(500, "something went wrong during uploading avatar");
  }

  try {
    const user = await User.create({
      fullName,
      avatar: avatar?.url || undefined,
      email,
      password,
    });

    // extra fail safe
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "something went wrong during registering");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "user registered succesfully"));
  } catch (error) {
    console.log("user creation failed , error : " + error);

    console.log(avatar);

    // deleting the files from cloudinary in case of failed user creation
    // the files will be uploaded in case other failure in registraion
    if (avatar) {
      console.log("deleted avatar from cloudinary");
      await deleteMediaFromCloudinary(avatar.public_id);
    }

    throw new ApiError(
      500,
      "something went wrong during registering so deleted files from cloudinary"
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  //get data from body
  const { email, password } = req.body;

  //validation
  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(400, "user not found");
  }

  //validate password

  const isPasswordValid = await user.isPasswordCorrect(password);

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  if (!isPasswordValid) {
    throw new ApiError(400, "incorrect password");
  }
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(400, "user not found");
  }

  await user.updateLastActive();

  //The options are used when setting cookies
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,

        { user: loggedInUser, accessToken, refreshToken },

        "user logged in succesfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(209)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(209, {}, "user logged out succesfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // existing refresh token comes from the body or the cookie
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  //console.log("incomingRefreshToken : " + incomingRefreshToken);

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required...");
  }

  try {
    // decoding the refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // fetching user by the token
    const user = await User.findById(decodedToken?._id).select("+refreshToken");

    //console.log("user : " + user);
    //console.log("user token in db : " + user.refreshToken);

    // user validation
    if (!user) {
      throw new ApiError(401, "Invalid refresh token...");
    }

    // validating if the decoded token matches with the refresh token of user
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid refresh token...");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    // generating  acces token and new refresh token
    // renamaining refresh token as newRefreshToken in local scope
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refressToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "access token refreshed succesfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, "something went wrong during refreshing token...");
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "old and new password are required ");
  }

  const user = await User.findById(req.user._id).select("+password +email");

  const isPasswordCorrect = user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Enter correct password");
  }

  user.password = newPassword;
  user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required ");
  }

  const user = await User.findOne({ email });

  //console.log("user in forgot password : " + user);

  const forgotpasswordToken = user.getResetPasswordToken();

  // console.log("forgotpasswordToken : " + forgotpasswordToken);

  if (!forgotpasswordToken) {
    throw new ApiError(500, "error while generating password reset token ");
  }

  user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        forgotpasswordToken,
        "password reset link created successfully"
      )
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new ApiError(400, "Both token and newPassword are required");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpire: { $gt: Date.now() },
  }).select("+password +email");

  if (!user) {
    throw new ApiError(400, "token is not valid");
  }

 //console.log("User in resetPassword : " + user);

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password reset successfully"));
});

const resetPasswordd = asyncHandler(async (req, res) => {});
const resetPasswords = asyncHandler(async (req, res) => {});

export {
  generateAccessAndRefreshToken,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updatePassword,
  forgotPassword,
  resetPassword,
};
