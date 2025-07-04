import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js"



export const verifyJwt = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(402, "unauthorized token");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // extra safety by .select
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(402,"unauthorized user");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
