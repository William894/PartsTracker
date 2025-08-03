import {plainToInstance} from 'class-transformer';
import {validate, ValidationError} from 'class-validator';
import * as express from 'express';
import HttpException, { ExceptionError } from '../exceptions/HttpException';
import { getLogger } from '../utils/logger';

const loggerPromise = getLogger();

function validationMiddleware<T>(type: any, skipMissingProperties: boolean = false): express.RequestHandler {
    return (req, res, next) => {
        validate(plainToInstance(type, req.body), { skipMissingProperties })
            .then(async (errors: ValidationError[]) => {
                const logger = await loggerPromise;
                if(errors.length > 0) {
                    logger.error('Validation failed:', errors);
                    const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
                    const excepErrors: ExceptionError[] = [];
                    errors.forEach(error => {
                        if (error.constraints) {
                            Object.values(error.constraints).forEach(constraint => {
                                excepErrors.push(new ExceptionError(error.property, constraint));
                            });
                        }
                    });
                    next(new HttpException(null, "Validation failed", 400, message, message, excepErrors));
                } else {
                    next();
                }
            });
    };
}

export default validationMiddleware;