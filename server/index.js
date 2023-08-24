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

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/tweets", tweetRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  connect();
  console.log(`Listening to port ${PORT}`);
});
