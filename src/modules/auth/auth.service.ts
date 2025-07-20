import { generateToken } from "@/core/auth/jwt.service";
import { ApiError } from "@/shared/utils/api-error.util";
import httpStatus from "http-status";
import { UserPayload } from "../user/user.types";
import { LoginResponse } from "./auth.types";

export const userLogin = async (user: UserPayload): Promise<LoginResponse> => {
  if (!user)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Your are unauthorized");

  const token = generateToken(user);

  return {
    access_token: token,
    user: user,
  };
};
