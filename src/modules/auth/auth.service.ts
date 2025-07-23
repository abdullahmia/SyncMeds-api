import { generateToken } from "@/core/auth/jwt.service";
import { emailQueue } from "@/core/queue/queue.service";
import { userService } from "@/modules/user";
import { QueueKeys } from "@/shared/constants/queue-keys.constants";
import { ApiError } from "@/shared/utils/api-error.util";
import { otpGenerator } from "@/shared/utils/otp.util";
import httpStatus from "http-status";
import { getUserByEmail } from "../user/user.repository";
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

export const forgotPassword = async (email: string): Promise<void> => {
  const user = await getUserByEmail(email);

  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, "User not found with this email!");

  const updatedUser = await userService.addOtpToUser(user.user_id, {
    otp: (
      await otpGenerator.generateOtp({
        length: 6,
        onlyNumbers: true,
      })
    ).toString(),
  });

  if (updatedUser) {
    let userInfo = {
      id: user.user_id,
      name: user.name,
      email: user.email,
      otp: updatedUser.otp,
    };

    await emailQueue.add(QueueKeys.FORGOT_PASSWORD_EMAIL, userInfo);
  }
};
