import config from "@/config";
import Redis from "ioredis";

const redisConfig = {
  port: config.redis.port,
  host: config.redis.host,
  maxRetriesPerRequest: null,
};

const redisClient = new Redis(config.redis.url, {
  maxRetriesPerRequest: null,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

export default redisClient;
