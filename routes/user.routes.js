import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../utils/multer.js";
import {
  getCurrernUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";

const router = Router();

//secured routes
router.route("/current-user-profile").get(verifyJwt, getCurrernUserProfile);
router
  .route("/update-profile")
  .patch(
    verifyJwt,
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    updateUserProfile
  );

export default router;
