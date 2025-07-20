import { User } from "@/generated/prisma";

export type PublicUser = Omit<User, "password">;

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUserPayload = Partial<CreateUserPayload>;
export type UserPayload = {
  id: string;
  email: string;
  name: string;
};
