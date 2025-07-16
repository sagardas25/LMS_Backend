import { Router } from "express";
import { authorizeRoles, verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../utils/multer.js";
import {
  createSection,
  deleteSection,
  getAllSectionsForCourse,
  updateSectionTitle,
  getLectureInSection,
} from "../controllers/section.controller.js";

const router = Router();

router
  .route("/:courseId/create-section")
  .post(verifyJwt, authorizeRoles("instructor", "admin"), createSection);
router
  .route("/:courseId/get-all-section")
  .get(
    verifyJwt,
    authorizeRoles("instructor", "admin"),
    getAllSectionsForCourse
  );
router
  .route("/:sectionId/update-section-title")
  .patch(verifyJwt, authorizeRoles("instructor", "admin"), updateSectionTitle);
router
  .route("/:sectionId/delete-section")
  .post(verifyJwt, authorizeRoles("instructor", "admin"), deleteSection);

router
  .route("/:sectionId/get-all-lectures")
  .post(verifyJwt, getLectureInSection);

export default router;
