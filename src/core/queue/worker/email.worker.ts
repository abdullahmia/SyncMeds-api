import redisClient from "@/core/cache/redis.client";
import { authEmailSender } from "@/modules/shared/services/email/senders/auth.sender";
import { QueueKeys } from "@/shared/constants/queue-keys.constants";
import { logger } from "@/shared/utils/logger.util";
import { Job, Worker } from "bullmq";

const emailProcessor = async (job: Job) => {
  switch (job.name) {
    case QueueKeys.FORGOT_PASSWORD_EMAIL:
      const { data: forgotPasswordData } = job;
      await authEmailSender.sendPasswordReset(
        forgotPasswordData.email,
        forgotPasswordData.otp
      );
      break;

    case QueueKeys.INVENTORY_UPDATE:
      logger.info(`Inventory update stuff`);
      break;

    case QueueKeys.RESET_PASSWORD_SUCCESS:
      const { data: userInfo } = job;
      logger.info(`Password Reset success for user id: ${userInfo.user_id}`);
      await authEmailSender.sendResetPasswordSuccessful(
        userInfo.email,
        userInfo.name
      );
      break;

    default:
      logger.warn(`Unknown job name received: ${job.name}`);
      break;
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
