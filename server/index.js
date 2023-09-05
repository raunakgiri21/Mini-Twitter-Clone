import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import userRoute from "./routes/users.js";
import authRoute from "./routes/auths.js";
import tweetRoute from "./routes/tweets.js";

const __dirname = path.resolve();

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
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "./client/build")));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/tweets", tweetRoute);

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"), (err) => {
    res.status(500).send(err);
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  connect();
  console.log(`Listening to port ${PORT}`);
});
