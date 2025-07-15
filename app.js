import express from "express";
import dotenv from "dotenv";
import logger from "./logger.js";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiResponse } from "./utils/ApiResponse.js";
//import mongoSanitize from "express-mongo-sanitize";

dotenv.config();
const app = express();

// rate limiter

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: "too many requests from this ip , try again later..!!",
});

//body middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// security middlewares
app.use("/api", limiter);
app.use(helmet());
app.use(hpp());
//app.use(mongoSanitize())

//cors configurations
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "X-Requested-With",
      "Origin",
      "Accept",
      "device-remember-token",
      "Access-Control-Allow-Origin",
    ],
  })
);

// logger setup
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Global error handler
app.use((err, req, res, next) => {
  console.log(err.stack);

  return res
    .status(err.status || 500)
    .json(
      new ApiResponse(
        500,
        ...(process.env.NODE_ENV == "development" && err.stack),
        err.message || "internal server error.."
      )
    );
});

// routes imports
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import adminDashboardRoute from "./routes/adminDashboard.routes.js";
import courseRoute from "./routes/course.routes.js";
import ratingRoute from "./routes/rating.routes.js";
import sectionRoute from "./routes/section.routes.js"
import healthRoute from "./routes/healthCheck.routes.js"
import razorpayRoute from "./routes/razorpay.routes.js"
import lectureRoute from "./routes/lecture.routes.js"

//routes
app.use("/health",healthRoute );
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminDashboardRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/rating", ratingRoute);
app.use("/api/v1/section", sectionRoute);
app.use("/api/v1/razorpay", razorpayRoute);
app.use("/api/v1/lecture", lectureRoute);

export default app;
