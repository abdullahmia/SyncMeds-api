import { emailQueue } from "@/core/queue/queue.service";
import { QueueKeys } from "@/shared/constants/queue-keys.constants";
import { response } from "@/shared/utils/api-response.util";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserPayload } from "../user/user.types";
import * as authService from "./auth.service";

export const login = async (req: Request, res: Response) => {
  const result = await authService.userLogin(req.user as UserPayload);
  await emailQueue.add(QueueKeys.FORGOT_PASSWORD_EMAIL, {
    name: req.user?.name,
    email: req.user?.email,
    id: req.user?.id,
  });
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Login successful", result));
};
