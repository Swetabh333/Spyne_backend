import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";

const app: Application = express();

// cors config to allow who is able to communicate with the backend and who isn't
const corsConfig: CorsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
};

const port = process.env.PORT || 3000;

app.use(cors(corsConfig));
app.use(express.json()); // for parsing json files
app.options("*", cors(corsConfig));

//End point to check if the server is alive
app.use("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

//error starts listening if there are no errors.
try {
  app.listen(port, () => {
    console.log(`Connected successfully to port ${port}`);
  });
} catch (err) {
  console.log(err);
}
