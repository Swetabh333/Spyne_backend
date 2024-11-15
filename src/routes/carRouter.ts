import express, { Router, Request, Response } from "express";
import validateAccessToken from "../middlewares/authMiddleware";
import multer from "multer";
import { userDocument } from "../schema/userSchema";
import { uploadImage, deleteImage } from "../helper/imageHelper";
import { Types } from "mongoose";
import Car from "../schema/carSchema";

const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

interface AuthRequest extends Request {
  user?: userDocument;
}

//endpoint for uploading car data

/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Create a new car listing
 *     security:
 *       - cookieAuth: []
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - images
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Car created successfully
 *       400:
 *         description: Invalid input or missing images
 *       401:
 *         description: Unauthorized
 *
 *   get:
 *     summary: Get all cars for authenticated user
 *     security:
 *       - cookieAuth: []
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering cars
 *     responses:
 *       200:
 *         description: List of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       401:
 *         description: Unauthorized
 */
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

router.get(
  "/",
  validateAccessToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { search } = req.query;
      let query: any = { user: req.user!._id };

      if (search) {
        query = {
          ...query,
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $in: [new RegExp(search as string, "i")] } },
          ],
        };
      }

      const cars = await Car.find(query).sort({ createdAt: -1 });
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: "Error fetching cars" });
    }
  },
);

/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: Get a specific car
 *     security:
 *       - cookieAuth: []
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Car not found
 *
 *   put:
 *     summary: Update a car
 *     security:
 *       - cookieAuth: []
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               deletedImages:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Car updated successfully
 *       404:
 *         description: Car not found
 *
 *   delete:
 *     summary: Delete a car
 *     security:
 *       - cookieAuth: []
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       404:
 *         description: Car not found
 */
router.get(
  "/:id",
  validateAccessToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const car = await Car.findOne({
        _id: req.params.id,
        user: req.user!._id,
      });

      if (!car) {
        res.status(404).json({ message: "Car not found" });
        return;
      }

      res.json(car);
    } catch (error) {
      res.status(500).json({ error: "Error fetching car" });
    }
  },
);

router.put(
  "/:id",
  validateAccessToken,
  upload.array("images", 10),
  async (req: AuthRequest, res: Response) => {
    try {
      const car = await Car.findOne({
        _id: req.params.id,
        user: req.user!._id,
      });
      if (!car) {
        res.status(400).json({ error: "Car not found" });
        return;
      }
      const userId: Types.ObjectId = req.user!._id as Types.ObjectId;
      const { title, description, tags, deletedImages } = req.body;
      const files = req.files as Express.Multer.File[];

      if (deletedImages) {
        const imagesToDelete = JSON.parse(deletedImages);
        await Promise.all(
          imagesToDelete.map((url: string) =>
            deleteImage(url, userId.toString()),
          ),
        );
        car.imageUrls = car.imageUrls.filter(
          (url) => !imagesToDelete.includes(url),
        );
      }
      if (files && files.length > 0) {
        const newImageUrls = await Promise.all(
          files.map((file) => uploadImage(file, userId.toString())),
        );

        if (car.imageUrls.length + newImageUrls.length > 10) {
          res.status(400).json({ message: "Maximum 10 images allowed" });
          return;
        }

        car.imageUrls = [...car.imageUrls, ...newImageUrls];
      }

      car.title = title || car.title;
      car.description = description || car.description;
      car.tags = tags ? JSON.parse(tags) : car.tags;
      car.imageCount = car.imageUrls.length;

      await car.save();
      res.json(car);
    } catch (err) {
      res.status(500).json({ error: err });
      console.log(err);
    }
  },
);

router.delete(
  "/:id",
  validateAccessToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const car = await Car.findOne({
        _id: req.params.id,
        user: req.user!._id,
      });

      if (!car) {
        res.status(404).json({ message: "Car not found" });
        return;
      }

      const userId: Types.ObjectId = req.user!._id as Types.ObjectId;

      // Delete all images from user's directory
      await Promise.all(
        car.imageUrls.map((url) => deleteImage(url, userId.toString())),
      );

      await car.deleteOne();
      res.json({ message: "Car deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting car" });
    }
  },
);

export default router;
