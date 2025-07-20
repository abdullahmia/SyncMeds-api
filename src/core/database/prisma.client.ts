import { PrismaClient } from "@/generated/prisma";

declare global {
  var db: PrismaClient | undefined;
}

export const db = globalThis.db || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.db = db;
}
