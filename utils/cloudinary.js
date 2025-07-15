import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(chalk.yellowBright("uploaded file url : " , response.url));

    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.log(
          "error in deleting local server file after uploading on cloudinary : " ,
            err
        );
      }
    }); // removing it from local server after uploading on cloudinary

    return response;
  } catch (error) {
    console.log("error in cloudinary(uploadOnCloudinary) : " , error);

    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.log("error in deleting from local server on  error" , err);
      }
    }); // removing the file from local storage as well if failed to upload on cloudinary
    return null;
  }
};
const deleteMediaFromCloudinary = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    console.log("deletd from cloudinary at deleteMediaFromCloudinary.public id : " , public_id);
    return result;
  } catch (error) {
    console.log("error while deleting file from cloudinary : " , error);
    return null;
  }
};
const deleteVideoFromCloudinary = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "video",
    });
    console.log("deletd from cloudinary deleteMediaFromCloudinary .public id : " , public_id);
    return result;
  } catch (error) {
    console.log("error while deleting file from cloudinary : " , error);
    return null;
  }
};

export {
  uploadOnCloudinary,
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
};
