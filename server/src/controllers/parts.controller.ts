import * as express from 'express';
import Part from '../interfaces/part.interface';
import partModel from '../models/parts/part.schema';
import HttpException, { ExceptionError } from '../exceptions/HttpException';
import { redisDelete, redisSet } from '../utils/redis.Utils';
import { getLogger } from '../utils/logger';

const loggerPromise = getLogger();

class PartsController {

    static deletePart = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        const logger = await loggerPromise;
        partModel.findByIdAndDelete(id)
            .then(async deletedPart => {
                if (deletedPart) {
                    response.status(204).send();
                    await redisDelete(`GET:${request.originalUrl}`);
                    await redisDelete(`GET:${request.originalUrl.replace(/\/[^\/]+$/, '')}`);
                    logger.debug(`Cache cleared for GET:${request.originalUrl} and GET:${request.originalUrl.replace(/\/[^\/]+$/, '')}`);
                } else {
                    next(new HttpException(null, 'Part not found', 404, `Part with id ${id} not found`, `No part found with id ${id}`));
                }
            })
            .catch(async error => {
                logger.error(`Error Details: ${JSON.stringify(error)}`, error);
                next(new HttpException(null, 'Error deleting part', 500, `Error deleting part with id ${id}`, error.message || `Error deleting part with id ${id}`));
            });
    }

    static updatePart = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        const partData: Part = request.body;
        const logger = await loggerPromise;

        partModel.findByIdAndUpdate(id, partData, { new: true })
            .then(async updatedPart => {
                if (updatedPart) {
                    response.send(updatedPart);
                    await redisDelete(`GET:${request.originalUrl}`);
                    await redisDelete(`GET:${request.originalUrl.replace(/\/[^\/]+$/, '')}`);
                    logger.debug(`Cache cleared for GET:${request.originalUrl} and GET:${request.originalUrl.replace(/\/[^\/]+$/, '')}`);
                } else {
                    next(new HttpException(null, 'Part not found', 404, `Part with id ${id} not found`, `No part found with id ${id}`));
                }
            })
            .catch(async error => {
                logger.error(`Error Details: ${JSON.stringify(error)}`, error);
                next(new HttpException(null, 'Error updating post', 500, `Error updating post with id ${id}`, error.message || `Error updating post with id ${id}`));
            });
    }

    static getPartById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        const cacheKey = `${request.method}:${request.originalUrl}`;
        const logger = await loggerPromise;

        partModel.findById(id)
            .then(async part => {
                if (part) {
                    await redisSet(cacheKey, JSON.stringify(part));
                    response.send(part);
                } else {
                    next(new HttpException(null, 'Part not found', 404, `Part with id ${id} not found`, `No part found with id ${id}`));
                }
            })
            .catch(async error => {
                logger.error(`Error Details: ${JSON.stringify(error)}`, error);
                next(new HttpException(null, 'Error fetching part', 500, `Error fetching part with id ${id}`, error.message || `Error fetching part with id ${id}`));
            });
    }

    static getAllParts = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const cacheKey = `${request.method}:${request.originalUrl}`;
        const logger = await loggerPromise;

        partModel.find()
            .then(async parts => {
                if (parts.length > 0) {
                    await redisSet(cacheKey, JSON.stringify(parts));
                }
                response.send(parts);
            })
            .catch(async error => {
                logger.error(`Error Details: ${JSON.stringify(error)}`, error);
                next(new HttpException(null, 'Error fetching parts', 500, `Error fetching parts`, error.message || `Error fetching parts`));
            });
    }

    static createPart = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const logger = await loggerPromise;
        
        logger.debug(`Creating part with data: ${JSON.stringify(request.body)}`, request.body);

        const existingPart = await partModel.findById(request.body.partNumber)
            .then(part => {
                if (part) {
                    return part;
                } else {
                    return null;
                }
            });

        logger.debug(`Existing Part: ${existingPart}`, existingPart);
        
        if (existingPart != null && existingPart !== undefined) {
            logger.debug(`Part with partNumber ${request.body.partNumber} already exists`, request.body);
            logger.debug(`Part Detail: ${existingPart}`, existingPart);
            return next(new HttpException(null, 'Part already exists', 400, `Part with partNumber ${request.body.partNumber} already exists`, `Part with Part Number ${request.body.partNumber} already exists`, [new ExceptionError('partNumber', `Part with partNumber ${request.body.partNumber} already exists`)]));
        };

        const partData: Part = request.body;
        const createdPart = new partModel(partData);
        createdPart.save()
            .then(async savedPart => {
                await redisDelete(`GET:${request.originalUrl}`);
                response.status(201).send(savedPart);
            })
            .catch(async error => {
                logger.error(`Error saving part: ${error.message}`, error);
                logger.error(`Error Details: ${JSON.stringify(error)}`, error);
                next(new HttpException(null, 'Error saving part', 500, `Error saving part`, error.message || `Error saving part`));
            });
    }
}

export default PartsController;