import { Router } from "express";
import { authorizeRoles, verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../utils/multer.js";
import { healthCheck } from "../controllers/healthCheck.controller.js";


const router = Router();

router.route("/").get(healthCheck)

export default router ;