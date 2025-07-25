import dotenv from "dotenv";
import { ApiResponse } from "./utils/ApiResponse.js";
import app from "./app.js";
import connectDB, { getDbStatus } from "./db/db.js";
import chalk from "chalk";

dotenv.config();

const PORT = process.env.PORT;

// 404 handler - always stays at bottom
app.use((req, res) => {
  return res
    .status(404)
    .json(new ApiResponse(404, "error", "Route not found..!!"));
});

async function startServer() {
  try {
    await connectDB();
    const status = await getDbStatus();

    //console.log(status);
    console.log(chalk.redBright("isConnected : " ) , chalk.blueBright(status.isConnected) );
    console.log(chalk.redBright("host : " ) , chalk.blueBright(status.host) );
    console.log(chalk.redBright("health-check : " ) , chalk.blueBright(`http://localhost:${process.env.PORT}/health`) );

    app.listen(PORT, () => {
      console.log(
        chalk.yellowBright(
          `app is running at port ${PORT} in ${process.env.NODE_ENV} mode`
        )
      );
    });
  } catch (error) {
    console.log("db connection error : " , error);

    process.exit(1);
  }
}

startServer();
