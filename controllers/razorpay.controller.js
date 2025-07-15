import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import chalk from "chalk";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { razorpayInstance } from "../utils/razorpay.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { courseId } = req.body;

  const course = await Course.findById(courseId);

  if (!course || course.isPublished == false) {
    return new ApiError(500, "Course is not available for purchase");
  }

  const alreasyPurchase = await CoursePurchase.findOne({
    user: userId,
    course: courseId,
    status: "completed",
  });

  if (alreasyPurchase) {
    return new ApiError(500, "Course is already purchased");
  }

  const options = {
    amount: course.price * 100, //in Paisa
    currency: "INR",
    receipt: `recipt_${userId}_${Date.now()}`,
    notes: {
      courseId,
      userId,
    },
  };
  try {
    const order = razorpayInstance.orders.create(
      options,
      function (error, order) {
        if (error) {
          console.log("razorpay error : ", error);
        }
        console.log("razorpay order : ", order);
      }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          userId,
          courseId,
          orderId: order.id,
          currency: order.currency,
          amount: order.amount,
        },

        "order created succesfully"
      )
    );
  } catch (error) {
    console.log("razor error : ", error);

    return res
      .status(500)
      .json(ApiError(500, "error while creating razorpay order "));
  }
});

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courseId,
    userId,
    paymentMethod = "razorpay",
  } = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (expectedSignature != razorpay_signature) {
    return res.status(400).json(new ApiError(400, "Invalid signature"));
  }

  const course = await Course.findById(courseId);

  const purchase = await CoursePurchase.create({
    course: courseId,
    user: userId,
    amount: course.price,
    currency: "INR",
    status: "completed",
    paymentMethod,
    paymentId: razorpay_payment_id,
    metadata: {
      razorpay_order_id,
      razorpay_signature,
    },
  });

  course.enrolledStudents.push(userId);
  course.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, purchase, "Payment verified and access granted")
    );
});


export {createRazorpayOrder,verifyRazorpayPayment}