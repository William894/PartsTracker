import HttpException from '../exceptions/HttpException';
import { Request, Response, NextFunction } from 'express';
import { getLogger } from '../utils/logger';

// Remove top-level await

export async function errorMiddleware(
    err: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const logger = await getLogger();
    
    const status = err.status || 500;
    const type = err.type || `https://httpstatuses.com/${status}`;
    const title = err.title || "Internal Server Error";
    const detail = err.message || "An unexpected error occurred.";

    logger.error(detail, {
        type,
        title,
        status,
        instance: req.originalUrl,
        errors: err.errors || null
    });

    res.status(status).json({
        type,
        title,
        status,
        detail,
        instance: req.originalUrl,
        errors: err.errors || null
    });
}