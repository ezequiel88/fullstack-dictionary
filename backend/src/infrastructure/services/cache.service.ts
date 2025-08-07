import { ICacheService } from '../../domain/services/cache.service.interface.js';
import redisClient from '../cache/redis.js';

export class CacheService implements ICacheService {
  async get(key: string): Promise<string | null> {
    if (!redisClient) return null;
    
    try {
      return await redisClient.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!redisClient) return;
    
    try {
      if (ttl) {
        await redisClient.setEx(key, ttl, value);
      } else {
        await redisClient.set(key, value);
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    if (!redisClient) return;
    
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!redisClient) return false;
    
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async clear(): Promise<void> {
    if (!redisClient) return;
    
    try {
      await redisClient.flushDb();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}