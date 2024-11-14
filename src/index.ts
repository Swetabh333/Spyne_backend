import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import connectToDatabase from "./database/mongo";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter";
import carRouter from "./routes/carRouter";
import validateAccessToken from "./middlewares/authMiddleware";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Application = express();

// cors config to allow who is able to communicate with the backend and who isn't
const corsConfig: CorsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
  credentials: true,
};

const port = process.env.PORT || 3000;

app.use(cors(corsConfig));
app.use(express.json()); // for parsing json files
app.use(express.urlencoded({ extended: true }));
app.options("*", cors(corsConfig));
app.use(cookieParser()); // for parsing cookies
//End point to check if the server is alive
app.use("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

app.get("/verify", validateAccessToken, (req: Request, res: Response) => {
  res.status(200).send("authenticated");
});

//Endpoints for login and signup
app.use("/auth", authRouter);
app.use("/api/cars", carRouter);
//top level async function to make sure everything works orderly
const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`Connected successfully to port ${port}`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

startServer();
