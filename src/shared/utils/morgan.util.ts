import config from "@/config";
import { Request, RequestHandler, Response } from "express";
import morgan from "morgan";
import { logger } from "./logger.util";

const getIpFormat = () =>
  config.env === "production" ? ":remote-addr - " : "";

const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - :message`;

export const successHandler: RequestHandler = morgan(successResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode >= 400,
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
});

export const errorHandler: RequestHandler = morgan(errorResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode < 400,
  stream: {
    write: (message: string) => logger.error(message.trim()),
  },
});
