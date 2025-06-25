import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT;


app.listen(PORT , () => {

  console.log(`app is running at port : ${PORT} in ${process.env.NODE_ENV} mode`);
  



})
