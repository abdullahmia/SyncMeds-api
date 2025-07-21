import redisClient from "./redis.client";

export class CacheService {
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await redisClient.set(key, JSON.stringify(value), "EX", ttl);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async del(key: string): Promise<void> {
    await redisClient.del(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return redisClient.keys(pattern);
  }

  async flush(): Promise<void> {
    await redisClient.flushdb();
  }
}

export const cacheService = new CacheService();
