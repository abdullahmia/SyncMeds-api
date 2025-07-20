import config from "@/config";
import { UserPayload } from "@/modules/user/user.types";
import jwt from "jsonwebtoken";

export const generateToken = (user: UserPayload): string => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpirationMinutes }
  );
};

export const verifyToken = async (token: string) => {};
