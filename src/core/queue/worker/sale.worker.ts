import redisClient from "@/core/cache/redis.client";
import { inventoryService } from "@/modules/inventory";
import { QueueKeys } from "@/shared/constants/queue-keys.constants";
import { logger } from "@/shared/utils/logger.util";
import { Job, Worker } from "bullmq";

const saleProcessor = async (job: Job) => {
  switch (job.name) {
    case QueueKeys.INVENTORY_UPDATE:
      await inventoryService.updateInventoryOnSale(job.data as string);
      break;

    default:
      logger.warn(`Unknown job name received: ${job.name}`);
      break;
  }
};

export const saleWorker = new Worker("saleQueue", saleProcessor, {
  connection: redisClient,
  concurrency: 5,
});

saleWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});

saleWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});

saleWorker.on("active", (job) => {
  console.log(`Job ${job.id} is now active.`);
});

console.log("Email Worker initialized and listening for jobs...");

process.on("SIGINT", async () => {
  console.log("Shutting down worker...");
  await saleWorker.close();
  console.log("Worker shut down.");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down worker...");
  await saleWorker.close();
  console.log("Worker shut down.");
  process.exit(0);
});
