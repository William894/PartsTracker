import express from 'express';
import { redisGet, redisSet } from '../utils/redis.Utils';
import { getLogger } from '../utils/logger';

const loggerPromise = getLogger();

export const cacheMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const cacheKey = `${req.method}:${req.originalUrl}`;
    const cachedResponse = await redisGet(cacheKey);
    const logger = await loggerPromise;

    if (cachedResponse) {
        logger.debug(`Cache hit for ${cacheKey}`);
        return res.status(200).json(JSON.parse(cachedResponse));
    }

    logger.debug(`Cache miss for ${cacheKey}`);

    next();
};