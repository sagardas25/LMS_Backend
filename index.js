import dotenv from "dotenv";
import { ApiResponse } from "./utils/ApiResponse.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT;

// 404 handler - always stays at bottom
app.use((req, res) => {
  return res
    .status(404)
    .json(new ApiResponse(404, "error", "Route not found..!!"));
});

app.listen(PORT, () => {
  console.log(
    `app is running at port : ${PORT} in ${process.env.NODE_ENV} mode`
  );
});
