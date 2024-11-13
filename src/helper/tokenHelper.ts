import User, { userDocument } from "../schema/userSchema";
import jwt from "jsonwebtoken";

//Function for generating an access token
export const generateToken = (user: userDocument) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

//function for generating a refresh token
export const generateRefreshToken = (user: userDocument) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};

//function for verifying a refresh token
export const verifyRefreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as {
      id: string;
    };
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error("Invalid refresh token");
    }
    return user;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
