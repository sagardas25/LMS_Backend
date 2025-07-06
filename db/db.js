import mongoose from "mongoose";

const MAX_RETIES = 3;
const RETRY_INTERVAL = 5000;

class DatabaseConnection {
  constructor() {
    this.retryCount = 0;
    this.isConnected = false;

    // mongoose configuire
    // only fields defined in the Mongoose schema are used in queries
    mongoose.set("strictQuery", "throw");

    // event listners
    mongoose.connection.on("connected", () => {
      console.log("MONGODB CONNECTED SUCCESFULLY");
      this.isConnected = true;
    });

    mongoose.connection.on("error", () => {
      console.log("MONGODB CONNECTION ERROR");
      this.isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MONGODB DISCONNECTED");
      this.isConnected = false;
      this.handleDisconnection();
    });

    process.on("SIGTERM", this.handleAppTermination.bind("this"));
  }

  async connect() {
    try {
      if (!process.env.MONGO_URL) {
        throw new Error("mongo db url is not defined in env");
      }

      const connectionOptions = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 500,
        socketTimeoutMS: 45000,
        family: 4, // use IPv4
      };

      if (process.env.NODE_ENV === "development") {
        mongoose.set("debug", true);
      }

      await mongoose.connect(process.env.MONGO_URL, connectionOptions);
      this.retryCount = 0; //reset retry count on success
    } catch (error) {
      console.log(error.message);
      await this.handleConnError();
    }
  }

  async handleConnError() {
    if (this.retryCount < MAX_RETIES) {
      this.retryCount++;
      console.log(
        `Retrying connection .. attempt number ${this.retryCount} of ${MAX_RETIES}`
      );
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, RETRY_INTERVAL)
      );

      return this.connect();
    } else {
      console.log(`failed to connect after ${MAX_RETIES} attempts`);
    }
  }

  async handleDisconnection() {
    if (!this.isConnected) {
      console.log("Attempting to connect again...");
      this.connect();
    }
  }

  async handleAppTermination() {
    try {
      // closing the connection properly
      await mongoose.connection.close();
      console.log("mongoDB connection closed through app termination ");
      process.exit(0);
    } catch (error) {
      console.log("error in connection termination : ", error);
      process.exit(1);
    }
  }

  getConnectionStatus() {
    const status = {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };

    return status;
  }
}

// create a singleton instance
// Create a single instance of this class for the whole app
const dbConnection = new DatabaseConnection();

export default dbConnection.connect.bind(dbConnection);
export const getDbStatus = dbConnection.getConnectionStatus.bind(dbConnection);
