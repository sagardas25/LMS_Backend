import { Router } from "express";
import { authorizeRoles, verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../utils/multer.js";
import {
  getAllInstructor,
  getAllStudents,
  promoteToInstructor,
} from "../controllers/adminDashboard.controller.js";

const router = Router();

router
  .route("/all-students")
  .get(verifyJwt, authorizeRoles("admin"), getAllStudents);
router
  .route("/all-instructor")
  .get(verifyJwt, authorizeRoles("admin"), getAllInstructor);
router
  .route("/promote-to-instructor/:userId")
  .post(verifyJwt, authorizeRoles("admin"), promoteToInstructor);

export default router;
