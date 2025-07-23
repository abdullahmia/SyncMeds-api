import { response } from "@/shared/utils/api-response.util";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserPayload } from "../user/user.types";
import * as authService from "./auth.service";

export const login = async (req: Request, res: Response) => {
  const result = await authService.userLogin(req.user as UserPayload);

  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Login successful", result));
};

export const forgotPassword = async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "OTP has been send to your mail", null));
};
