import { generateToken } from "@/core/auth/jwt.service";
import { hashPassword } from "@/core/auth/password.service";
import { emailQueue } from "@/core/queue/queue.service";
import { userService } from "@/modules/user";
import { QueueKeys } from "@/shared/constants/queue-keys.constants";
import { ApiError } from "@/shared/utils/api-error.util";
import { logger } from "@/shared/utils/logger.util";
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

export const resetPassword = async (
  otp: string,
  email: string,
  newPassword: string
): Promise<void> => {
  try {
    const user = await userService.getUserByEmail(email);

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

    if (!user.otpExpires || new Date() > user.otpExpires) {
      throw new ApiError(httpStatus.BAD_REQUEST, "OTP expired");
    }

    if (!user.otp || user.otp !== otp) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
    }

    const hashedPassword = await hashPassword(newPassword);

    await userService.updatePassword(user.user_id, hashedPassword);

    logger.info(`Password reset successful for: ${email}`);
  } catch (error) {
    logger.error("Reset password error:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal Server Error"
    );
  }
};
