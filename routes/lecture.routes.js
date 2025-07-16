import { Router } from "express";
import { authorizeRoles, verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../utils/multer.js";
import {
  addLectureToSection,
  getSingleLecture,
  removeLectureFromSection,
  toggleLecturePreview,
  updateLectureMetadata,
} from "../controllers/lecture.controller.js";

const router = Router();

router.route("/:sectionId/add-lecture").post(
  verifyJwt,
  authorizeRoles("instructor"),
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "note", maxCount: 1 },
  ]),
  addLectureToSection
);

router
  .route("/:lectureId/section/:sectionId")
  .delete(verifyJwt, authorizeRoles("instructor"), removeLectureFromSection);

router
  .route("/:lectureId")
  .patch(verifyJwt, authorizeRoles("instructor"), updateLectureMetadata)
  .get(verifyJwt, authorizeRoles("instructor"), getSingleLecture)
  .post(verifyJwt, authorizeRoles("instructor"),toggleLecturePreview)

export default router;
