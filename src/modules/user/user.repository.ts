import { prisma } from "@/core/database/prisma.client";
import { PublicUser } from "./user.types";

class UserRepository {
  constructor() {}

  async getUsers(): Promise<PublicUser[]> {
    return await prisma.user.findMany({
      select: {
        user_id: true,
        name: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
}

export default new UserRepository();
