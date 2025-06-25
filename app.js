import express from "express";
import dotenv from "dotenv";
import logger from "./logger.js";
import morgan from "morgan";
import { ApiResponse } from "./utils/ApiResponse.js";

dotenv.config();
const app = express();

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

//middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// routes

export default app;
