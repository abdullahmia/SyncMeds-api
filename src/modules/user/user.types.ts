import { User } from "@/generated/prisma";

export type PublicUser = Omit<User, "password">;
