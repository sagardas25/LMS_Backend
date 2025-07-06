import { Router } from "express";
import {
  forgotPassword,
  generateAccessAndRefreshToken,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetPassword,
  updatePassword,
} from "../controllers/auth.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../utils/multer.js";

const router = Router();

//not protected
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),

  registerUser
);

router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password").post(resetPassword)

// protected routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/update-password").post(verifyJwt,updatePassword)


export default router;
