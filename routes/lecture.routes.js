import { Router } from "express";
import { authorizeRoles, verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../utils/multer.js";
import { addLectureToSection } from "../controllers/lecture.controller.js";

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

export default router;
