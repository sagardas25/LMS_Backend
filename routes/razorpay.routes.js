import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/razorpay.controller.js";

const router = express.Router();

router.post("/order", createRazorpayOrder);
router.post("/verify", verifyRazorpayPayment);

export default router;
