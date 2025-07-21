import { Queue } from "bullmq";
import redisClient from "../../cache/redis.client";
import { EmailJobData } from "../queue.types";

export const emailQueue = new Queue<EmailJobData>("email", {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
  },
});
