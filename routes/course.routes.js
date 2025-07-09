import { Router } from "express";
import { authorizeRoles, verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../utils/multer.js";
import {
  createNewCourse,
  getAllPublishedCourse,
  getAllUnpublishedCourse,
  getMyCreatedCourses,
  publishCourse,
  updateCourseDetails,
} from "../controllers/course.controller.js";

const router = Router();

router
  .route("/create-new-course")
  .post(
    verifyJwt,
    authorizeRoles("instructor"),
    upload.single("thumbnail"),
    createNewCourse
  );

router
  .route("/get-my-created-courses")
  .get(verifyJwt, authorizeRoles("instructor"), getMyCreatedCourses);
router
  .route("/get-my-published-courses")
  .get(verifyJwt, authorizeRoles("instructor"), getAllPublishedCourse);
router
  .route("/get-my-unpublished-courses")
  .get(verifyJwt, authorizeRoles("instructor"), getAllUnpublishedCourse);

router
  .route("/publish-course/:courseId")
  .post(verifyJwt, authorizeRoles("instructor"), publishCourse);
router
  .route("/c/:courseId")
  .patch(
    verifyJwt,
    authorizeRoles("instructor"),
    upload.single("thumbnail"),
    updateCourseDetails
  );

export default router;
