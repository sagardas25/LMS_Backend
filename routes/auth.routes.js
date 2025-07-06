import { Router } from "express";
import {
  generateAccessAndRefreshToken,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
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

// protected routes
router.route("/logout").post(verifyJwt, logoutUser);

export default router;
