import jwt from "jsonwebtoken";
import { handleError } from "../error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log(req.cookies)
  if (!token) return next(handleError(401, "You are not auhtenticated"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(handleError(403, "Token is Invalid"));
    req.user = user;
    next();
  });
};
