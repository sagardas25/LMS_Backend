import chalk from "chalk";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
} from "../utils/cloudinary.js";

const getCurrernUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(400, "user not found ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user fetched succesfuly"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, bio } = req.body;

  if (Object.keys(req.body).length === 0 || !req.body) {
    throw new ApiError(400, "body is empty....");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  console.log("avatarLocalPath : " , avatarLocalPath);


  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    // console.log("uploaded avatar on cloudinary", avatar);
  } catch (error) {
    console.log("error in uploading avatar : " , error);
    throw new ApiError(500, "something went wrong during uploading avatar");
  }

  try {
    const updatedData = {};

    if (fullName != "undefined") updatedData.fullName = fullName;
    if (bio != "undefined" || bio.trim() != "") updatedData.bio = bio;
    if (avatar?.url) updatedData.avatar = avatar?.url;

   // console.log("bio : " , updatedData.bio);
    
    if (Object.keys(updatedData).length === 0) {
      throw new ApiError(
        400,
        "At least one field must be provided for update."
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updatedData,
      {
        new: true,
      }
    );

    if (!updatedUser) {
      throw new ApiError(409, " error while updating user profile");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "user profile updated succesfully")
      );
  } catch (error) {
    console.log("user updation failed ," , error);

    // console.log(avatar);

    // deleting the files from cloudinary in case of failed user profile updatation
    // the files will be uploaded in case other failure in updation
    if (avatar) {
      console.log(chalk.red("deleted avatar from cloudinary"));
      await deleteMediaFromCloudinary(avatar.public_id);
    }
    throw new ApiError(
      500,
      "something went wrong during updating user profile so deleted files from cloudinary"
    );
  }
});

// const updateAvatar = asyncHandler(async(req,res) => {

//   const avatarLocalPath = req.files?.avatar?.[0]?.path;
//   console.log("avatarLocalPath : " , avatarLocalPath);

//   let avatar;
//   try {
//     avatar = await uploadOnCloudinary(avatarLocalPath);
//     // console.log("uploaded avatar on cloudinary", avatar);
//   } catch (error) {
//     console.log("error in uploading avatar : " , error);
//     throw new ApiError(500, "something went wrong during uploading avatar");
//   }











// })

export { getCurrernUserProfile, updateUserProfile  };
