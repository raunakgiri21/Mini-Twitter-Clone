import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoute from "./routes/users.js";
import authRoute from "./routes/auths.js";
import tweetRoute from "./routes/tweets.js";

const app = express();
dotenv.config();

app.get("/", (req, res) => {
  res.send("hi");
});

const connect = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("DB connected!");
    })
    .catch((err) => {
      throw err;
    });
};

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/tweets", tweetRoute);

app.listen(8000, () => {
  connect();
  console.log("Listening to port 8000");
});
