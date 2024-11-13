import { NextFunction, Request, Response } from "express";
import { generateToken, verifyRefreshToken } from "../helper/tokenHelper";
import User, { userDocument } from "../schema/userSchema";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: userDocument;
}

// middleware for making sure only authorised users can modify cars
const validateAccessToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log(req.cookies);
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        res.status(401).json({ message: "Unauthorized please login" });
        return;
      }
      const user = await verifyRefreshToken(refreshToken);
      const newAccessToken = generateToken(user);
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      }); //15 minutes

      req.user = user;
      next();
    } else {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!,
      ) as {
        id: string;
      };
      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(403).json({ message: "Invalid access token" });
        return;
      }
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(500).json({ error: "Invalid access or refresh token" });
  }
};

export default validateAccessToken;
