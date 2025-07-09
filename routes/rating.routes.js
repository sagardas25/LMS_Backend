import { Router } from "express";
import { authorizeRoles, verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../utils/multer.js";
import {
  deleteRating,
  getAllRating,
  submitRating,
  updateRating,
} from "../controllers/rating.controller.js";

const router = Router();

router.route("/:courseId/submit-rating").post(verifyJwt, submitRating);
router.route("/:courseId/update-rating").post(verifyJwt, updateRating);
router.route("/:courseId/delete-rating").post(verifyJwt, deleteRating);
router.route("/:courseId/get-all-ratings").get(verifyJwt , authorizeRoles("instructor", "Admin") , getAllRating)

export default router;
