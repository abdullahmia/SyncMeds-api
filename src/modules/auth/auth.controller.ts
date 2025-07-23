import { response } from "@/shared/utils/api-response.util";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { UserPayload } from "../user/user.types";
import * as authService from "./auth.service";

export const login = async (req: Request, res: Response) => {
  const result = await authService.userLogin(req.user as UserPayload);

  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Login successful", result));
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const forgotPassword = async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "OTP has been send to your mail", null));
};

export const resetPassword = async (req: Request, res: Response) => {
  const { otp, email, new_password } = req.body;
  await authService.resetPassword(otp, email, new_password);
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Your password has been reset", null));
};
