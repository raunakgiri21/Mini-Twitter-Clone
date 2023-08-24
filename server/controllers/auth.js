import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { handleError } from "../error.js";

export const signup = async (req, res, next) => {
  try {
    const body = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(body.password, salt);
    const newUser = await User.create({ ...body, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    const { password, ...otherData } = newUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(otherData);
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const body = req.body;
    const user = await User.findOne({ username: body.username });

    if (!user) return next(handleError(404, "User Not Found"));

    const isCorrect = await bcrypt.compare(body.password, user.password);

    if (!isCorrect) return next(handleError(400, "Wrong Password"));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password, ...otherData } = user._doc;

    res
      .cookie("access_token", token)
      .status(200)
      .json(otherData);
  } catch (error) {
    next(error);
  }
};
