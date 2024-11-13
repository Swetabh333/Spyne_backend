import { userDocument } from "../schema/userSchema";
import jwt from "jsonwebtoken";

const generateToken = (user: userDocument) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};
