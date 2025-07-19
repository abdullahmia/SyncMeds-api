import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import helmet from "helmet";

dotenv.config();

const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// home routes
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Welcome to the API",
    status: "success",
    status_code: 200,
  });
});

export default app;
