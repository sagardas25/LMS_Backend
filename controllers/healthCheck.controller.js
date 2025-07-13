import { getDbStatus } from "../db/db.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const healthCheck = asyncHandler((req, res) => {
  try {
    const dbStatus = getDbStatus();
    console.log("db status : ", dbStatus);

    const healthStatus = {
      status: "OK",
      timeStamp: new Date().toLocaleString(),
      services: {
        database: {
          status: dbStatus.isConnected ? "healthy db" : "unhealthy db",
          details: {
            ...dbStatus,
            readyState: getReadyState(dbStatus.readyState),
          },
        },

        server: {
          status: "healthy",
          uptime: process.uptime() + " seconds",
          memoryUsage: process.memoryUsage(),
        },
      },
    };

    const httpStatus =
      healthStatus.services.database.status === "healthy db" ? 200 : 503;

    console.log("http status : ", httpStatus);

    return res
      .status(httpStatus)
      .json(new ApiResponse(httpStatus, healthStatus, "healthy backend"));
  } catch (error) {
    console.log("health check failed  : ", error);
    res.status(500).json({
      timeStamp: new Date().toLocaleString(),
      status: "ERROR",

      error: error.message,
    });
  }
});

function getReadyState(state) {
  switch (state) {
    case 0:
      return "disconnected";
    case 1:
      return "connected";
    case 2:
      return "connecting";
    case 3:
      return "disconnecting";

    default:
      return "unknown";
  }
}
