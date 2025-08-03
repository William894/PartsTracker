import * as ioredis from 'ioredis';
import { getLogger } from './logger';

const loggerPromise = getLogger();

const redisClient = new ioredis.Redis({
  host: process.env.REDIS_HOST,
  port: parseInt((process.env.REDIS_PORT || '').replace(/[^\d]/g, '') || '6379'),
  password: process.env.REDIS_PASSWORD || null,
});

const redisGet = async (key: string): Promise<string | null> => {
    const logger = await loggerPromise;
    try {
        const value = await redisClient.get(key);
        return value ? value : null;
    } catch (error) {
        logger.error(`Error getting key ${key} from Redis:`, error);
        return null;
    }
}

const redisSet = async (key: string, value: string): Promise<boolean> => {
    const logger = await loggerPromise;
    try {
        await redisClient.set(key, value, 'EX', 3600);
        logger.debug(`Set key ${key} in Redis with value: ${value}`);
        return true;
    } catch (error) {
        logger.error(`Error setting key ${key} in Redis:`, error);
        return false;
    }
}
const redisDelete = async (key: string): Promise<boolean> => {
    const logger = await loggerPromise;
    try {
        const result = await redisClient.del(key);
        return result > 0;
    } catch (error) {
        logger.error(`Error deleting key ${key} from Redis:`, error);
        return false;
    }
}

export { redisGet, redisSet, redisDelete };