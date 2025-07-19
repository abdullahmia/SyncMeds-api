import config from "@/config";
import { Prisma } from "@/generated/prisma";
import { ApiError } from "@/shared/utils/api-error.util";
import { logger } from "@/shared/utils/logger.util";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export const errorConverter = (
  err: any,
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  let error = err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaKnownErrors(err);
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    error = new ApiError(httpStatus.BAD_REQUEST, "Invalid database request");
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    error = new ApiError(httpStatus.BAD_REQUEST, "Validation failed");
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    error = new ApiError(
      httpStatus.SERVICE_UNAVAILABLE,
      "Database connection failed"
    );
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    error = new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Database unrecoverable error"
    );
  } else if (!(error instanceof ApiError)) {
    const status_code = error.status_code || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || "Internal Server Error";
    error = new ApiError(status_code, message);
  }

  next(error);
};

function handlePrismaKnownErrors(
  err: Prisma.PrismaClientKnownRequestError
): ApiError {
  switch (err.code) {
    case "P2002":
      return new ApiError(httpStatus.CONFLICT, "Duplicate entry detected");
    case "P2003":
      return new ApiError(
        httpStatus.BAD_REQUEST,
        "Foreign key constraint failed"
      );
    case "P2025":
      return new ApiError(httpStatus.NOT_FOUND, "Record not found");
    case "P2000":
      return new ApiError(httpStatus.BAD_REQUEST, "Invalid input value");
    case "P2001":
      return new ApiError(httpStatus.NOT_FOUND, "Record does not exist");
    default:
      return new ApiError(httpStatus.BAD_REQUEST, "Database operation failed");
  }
}

export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  const response = {
    status: false,
    status_code: err.status_code,
    message: err.message,
    timestamp: err.timestamp,
  };

  if (config.env === "development") {
    logger.error(err);
    Object.assign(response, { stack: err.stack });
  }

  return res.status(err.status_code).json(response);
};
