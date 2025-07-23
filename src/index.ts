import dotenv from "dotenv";
import app from "./app";
import config from "./config";
import { PrismaClient } from "./generated/prisma";
import { logger } from "./shared/utils/logger.util";

dotenv.config({});

const prisma = new PrismaClient();
let server: import("http").Server;

async function bootstrap() {
  try {
    // Database connection with retry
    await prisma.$connect();
    logger.info("🚀 Database connected");

    server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    await gracefulShutdown();
  }
}

async function gracefulShutdown() {
  try {
    await prisma.$disconnect();
    if (server) server.close();
    logger.info("💤 Server shut down gracefully");
    process.exit(0);
  } catch (error) {
    logger.error("Shutdown error:", error);
    process.exit(1);
  }
}

// Signal handlers
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  // gracefulShutdown();
});

bootstrap();
