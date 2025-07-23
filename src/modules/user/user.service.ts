import { hashPassword } from "@/core/auth/password.service";
import { User } from "@/generated/prisma";
import { ApiError } from "@/shared/utils/api-error.util";
import httpStatus from "http-status";
import * as userRepository from "./user.repository";
import { CreateUserPayload, PublicUser, UpdateUserPayload } from "./user.types";

export const getUsers = async (): Promise<PublicUser[]> => {
  return await userRepository.getUsers();
};

export const getUserById = async (id: string): Promise<PublicUser> => {
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `User not found with this '${id}'`
    );
  }

  return user;
};

export const createUser = async (
  payload: CreateUserPayload
): Promise<PublicUser> => {
  const isExistUser = await userRepository.getUserByEmail(payload.email);

  if (isExistUser) {
    throw new ApiError(httpStatus.CONFLICT, "Already have an user!");
  }

  const hashedPassword = await hashPassword(payload.password);

  return await userRepository.createUser({
    ...payload,
    password: hashedPassword,
  });
};

export const updateUser = async (
  userId: string,
  payload: UpdateUserPayload
): Promise<PublicUser> => {
  const user = await userRepository.updateUser(userId, payload);
  return user;
};

export const deleteUser = async (id: string): Promise<PublicUser> => {
  const user = await userRepository.deleteUser(id);
  return user;
};

export const addOtpToUser = async (
  userId: string,
  payload: { otp: string }
): Promise<Omit<User, "password">> => {
  return await userRepository.addOtp(userId, payload);
};
