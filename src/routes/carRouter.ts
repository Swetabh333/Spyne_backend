import express, { Router, Request, Response } from "express";
import validateAccessToken from "../middlewares/authMiddleware";
import multer from "multer";
import { userDocument } from "../schema/userSchema";
import { uploadImage } from "../helper/imageHelper";
import { Types } from "mongoose";
import Car from "../schema/carSchema";

const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

interface AuthRequest extends Request {
  user?: userDocument;
}

//endpoint for uploading car data
router.post(
  "/",
  validateAccessToken,
  upload.array("images", 10),
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, tags } = req.body;
      const files = req.files as Express.Multer.File[];
      const userId: Types.ObjectId = req.user!._id as Types.ObjectId;

      if (!files || files.length === 0) {
        res.status(400).json({ error: "Upload at least one image" });
        return;
      }
      if (files.length > 10) {
        res.status(400).json({ error: "Maximum 10 images allowed" });
        return;
      }

      const imageUrls = await Promise.all(
        files.map((file) => uploadImage(file, userId.toString())),
      );

      const newCar = new Car({
        title,
        description,
        tags,
        imageUrls,
        imageCount: imageUrls.length,
        user: userId,
      });

      await newCar.save();
      res.status(201).json(newCar);
    } catch (err) {
      res.status(500).json({ error: "Error creating car" });
      console.log(err);
    }
  },
);

export default router;
