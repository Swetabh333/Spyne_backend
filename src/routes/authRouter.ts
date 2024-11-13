import express, { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import User from "../schema/userSchema";
import { generateToken, generateRefreshToken } from "../helper/tokenHelper";
import { validationResult, body } from "express-validator";

const router: Router = express.Router();
//Endpoint for registering a new user.
router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid email address"), // email and password verification
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ Email: email });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }
      //hash the password to make sure it is safe even in case of a database leak.
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        Name: name,
        Email: email,
        Password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
);

//Endpoint for loggin in
router.post(
  "/login",
  body("email").isEmail().withMessage("Invalid email address"), // email and password verification
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ Email: email });
      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        console.log("email issue");
        return;
      }
      const isValidPassword = await bcrypt.compare(password, user.Password);
      if (!isValidPassword) {
        res.status(401).json({ message: "Invalid email or password" });
        console.log("password issue");
        return;
      }
      const accessToken = generateToken(user);
      const refreshToken = generateRefreshToken(user);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      }); // 15 minutes
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }); //7days
      res.json({ message: "Successfully logged in" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
);

export default router;
