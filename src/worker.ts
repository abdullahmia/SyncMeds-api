import { emailWorker, queueService } from "./core/queue";

queueService.startWorkers();

// Graceful shutdown
process.on("SIGTERM", async () => {
  await emailWorker.close();
  process.exit(0);
});
