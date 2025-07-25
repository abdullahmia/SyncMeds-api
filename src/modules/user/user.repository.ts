import { db } from "@/core/database/prisma.client";
import { Prisma, User } from "@/generated/prisma";
import { ApiError } from "@/shared/utils/api-error.util";
import { CreateUserPayload, PublicUser, UpdateUserPayload } from "./user.types";

const selectUserProperty = {
  user_id: true,
  name: true,
  email: true,
  created_at: true,
  updated_at: true,
};

export const getUsers = async (): Promise<PublicUser[]> => {
  try {
    return await db.user.findMany({
      select: selectUserProperty,
    });
  } catch (error) {
    throw new ApiError(500, "Failed to fetch users");
  }
};

export const getUserById = async (id: string): Promise<PublicUser | null> => {
  try {
    const user = await db.user.findFirst({
      where: {
        user_id: id,
      },
      select: selectUserProperty,
    });
    return user;
  } catch (error) {
    throw new ApiError(500, "Failed to fetch user");
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user = await db.user.findFirst({
      where: {
        email,
      },
      select: {
        ...selectUserProperty,
        password: true,
        otp: true,
        otpExpires: true,
      },
    });
    return user;
  } catch (error) {
    throw new ApiError(500, "Failed to fetch user by email");
  }
};

export const createUser = async (
  payload: CreateUserPayload
): Promise<PublicUser> => {
  try {
    const user = await db.user.create({
      data: payload,
      select: selectUserProperty,
    });
    return user;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new ApiError(409, "User already exists");
      }
    }
    throw new ApiError(500, "Failed to create user");
  }
};

export const updateUser = async (
  userId: string,
  payload: UpdateUserPayload
): Promise<PublicUser> => {
  try {
    const user = await db.user.update({
      where: {
        user_id: userId,
      },
      data: { ...payload },
      select: selectUserProperty,
    });
    return user;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new ApiError(404, "User not found");
      }
      if (error.code === "P2002") {
        throw new ApiError(409, "Email already exists");
      }
    }
    throw new ApiError(500, "Failed to update user");
  }
};

export const deleteUser = async (id: string): Promise<PublicUser> => {
  try {
    const user = await db.user.delete({
      where: { user_id: id },
      select: selectUserProperty,
    });
    return user;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new ApiError(404, "User not found");
      }
    }
    throw new ApiError(500, "Failed to delete user");
  }
};

export const addOtp = async (
  userId: string,
  payload: { otp: string }
): Promise<Omit<User, "password">> => {
  try {
    const otpExpiryTime = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes in milliseconds

    const user = await db.user.update({
      where: {
        user_id: userId,
      },
      data: {
        otp: payload.otp,
        otpExpires: otpExpiryTime.toISOString(),
      },
      select: {
        ...selectUserProperty,
        otp: true,
        otpExpires: true,
      },
    });
    return user;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new ApiError(404, "User not found");
      }
    }
    throw new ApiError(500, "Failed to update user");
  }
};

export const updatePassword = async (
  userId: string,
  password: string
): Promise<Partial<User>> => {
  try {
    const user = await db.user.update({
      where: {
        user_id: userId,
      },
      data: {
        password: password,
        otp: null,
        otpExpires: null,
      },
      select: {
        user_id: true,
        name: true,
        email: true,
      },
    });
    return user;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new ApiError(404, "User not found");
      }
    }
    throw new ApiError(500, "Failed to update user");
  }
};
