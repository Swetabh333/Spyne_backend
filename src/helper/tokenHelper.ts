import { userDocument } from "../schema/userSchema";
import jwt from "jsonwebtoken";

export const generateToken = (user: userDocument) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (user: userDocument) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};
