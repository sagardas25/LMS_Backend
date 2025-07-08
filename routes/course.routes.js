import { Router } from "express";
import { authorizeRoles, verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../utils/multer.js";
import { createNewCourse } from "../controllers/course.controller.js";

const router = Router();

router
  .route("/create-new-course")
  .post(
    verifyJwt,
    authorizeRoles("instructor"),
    upload.single("thumbnail"),
    createNewCourse
  );

export default router;
