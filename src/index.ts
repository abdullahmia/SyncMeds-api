import dotenv from "dotenv";
import app from "./app";
import config from "./config";
import { PrismaClient } from "./generated/prisma";

dotenv.config({});

console.log(process.env.DATABASE_URL);

const prisma = new PrismaClient();
let server: import("http").Server;

async function bootstrap() {
  try {
    // Database connection with retry
    await prisma.$connect();
    console.info("🚀 Database connected");

    server = app.listen(config.port, () => {
      console.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await gracefulShutdown();
  }
}

async function gracefulShutdown() {
  try {
    await prisma.$disconnect();
    if (server) server.close();
    console.info("💤 Server shut down gracefully");
    process.exit(0);
  } catch (error) {
    console.error("Shutdown error:", error);
    process.exit(1);
  }
}

// Signal handlers
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  gracefulShutdown();
});

bootstrap();
