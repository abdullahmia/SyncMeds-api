import { ApiError } from "@/shared/utils/api-error.util";
import { pick } from "@/shared/utils/pick.util";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";

export const validate =
  (schema: Record<string, any>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const validSchema = pick(schema, ["params", "query", "body"]);
      const object = pick(req, Object.keys(validSchema));
      const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: "key" } })
        .validate(object);

      if (error) {
        const errorMessage = error.details
          .map((details) => details.message.replace(/"/g, ""))
          .join(", ");
        throw new ApiError(httpStatus.BAD_REQUEST, errorMessage);
      }

      Object.assign(req, value);
      return next();
    } catch (error) {
      return next(error);
    }
  };
