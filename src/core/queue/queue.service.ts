import { Queue } from "bullmq";
import redisClient from "../cache/redis.client";

export const emailQueue = new Queue("emailQueue", {
  connection: redisClient,
});
