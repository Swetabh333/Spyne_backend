import express, { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import User from "../schema/userSchema";

const router: Router = express.Router();
//Endpoint for registering a new user.
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
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
});

//Endpoint for loggin in
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const isValidPassword = await bcrypt.compare(password, user.Password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
