import redisClient from "@/core/cache/redis.client";
import { authEmailSender } from "@/modules/shared/services/email/senders/auth.sender";
import { QueueKeys } from "@/shared/constants/queue-keys.constants";
import { logger } from "@/shared/utils/logger.util";
import { Job, Worker } from "bullmq";

const emailProcessor = async (job: Job) => {
  if (job.name === QueueKeys.FORGOT_PASSWORD_EMAIL) {
    const { data } = job;
    await authEmailSender.sendPasswordReset(data.email, data.otp);
  } else if (job.name === QueueKeys.INVENTORY_UPDATE) {
    logger.info(`Inventory update stuff`);
  }
};

export const emailWorker = new Worker("emailQueue", emailProcessor, {
  connection: redisClient,
  concurrency: 5,
});

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});

emailWorker.on("active", (job) => {
  console.log(`Job ${job.id} is now active.`);
});

console.log("Email Worker initialized and listening for jobs...");

// It's good practice to handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down worker...");
  await emailWorker.close();
  console.log("Worker shut down.");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down worker...");
  await emailWorker.close();
  console.log("Worker shut down.");
  process.exit(0);
});
