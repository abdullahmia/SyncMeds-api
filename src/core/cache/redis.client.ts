import config from "@/config";
import Redis from "ioredis";

const redisConfig = {
  host: config.redis.host,
  port: config.redis.port,
  username: config.redis.username || undefined,
  password: config.redis.password || undefined,
  maxRetriesPerRequest: null,
  tls: {},
};

const redisClient = new Redis(redisConfig);

redisClient.on("error", (err) => console.error("Redis Client Error", err));

export default redisClient;
