import dotenv from "dotenv";
import { ApiResponse } from "./utils/ApiResponse.js";
import app from "./app.js";
import connectDB, { getDbStatus } from "./db/db.js";

dotenv.config();

const PORT = process.env.PORT;

import authRouter from "./routes/auth.routes.js";

// 404 handler - always stays at bottom
app.use((req, res) => {
  return res
    .status(404)
    .json(new ApiResponse(404, "error", "Route not found..!!"));
});

async function startServer() {
  try {
    await connectDB();
    await getDbStatus();

    app.listen(PORT, () => {
      console.log(
        `app is running at port : ${PORT} in ${process.env.NODE_ENV} mode`
      );
    });
  } catch (error) {
    console.log("db connection error : " + error);

    process.exit(1);
  }
}

startServer()
