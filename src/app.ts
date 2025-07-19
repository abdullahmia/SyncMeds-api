import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import helmet from "helmet";
import httpStatus from "http-status";
import v1Router from "./api/v1/routes";
import {
  errorConverter,
  errorHandler,
} from "./core/middleware/error.middleware";
import { ApiError } from "./shared/utils/api-error";

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

// api routes
app.use("/api/v1", v1Router);

app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);

export default app;
