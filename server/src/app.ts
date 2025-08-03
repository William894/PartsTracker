import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { errorMiddleware } from './middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import router from './routes/router';
import HttpException from './exceptions/HttpException';
import { getLogger } from './utils/logger';
import cors from 'cors';
import partModel from './models/parts/part.schema';

class App {
    public app: express.Application;
    private logger: any;

    constructor() {
        this.app = express();

        // Initialize logger asynchronously
        getLogger().then(loggerInstance => {
            this.logger = loggerInstance;
        });

        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeSwaggerDocs();
        this.initializeHealthCheck();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeHealthCheck() {
        const processStartDate = new Date(Date.now() - process.uptime() * 1000).toISOString();
        this.app.use('/health', (req, res) => {
            const healthcheck = {
                uptime: process.uptime(),
                message: 'OK',
                timestamp: Date.now(),
                startDate: processStartDate
            };
            try {
                res.status(200).json(healthcheck);
            } catch (error) {
                healthcheck.message = error.message;
                if (this.logger) {
                    this.logger.error('Healthcheck error:', error);
                }
                res.status(503).json(healthcheck);
            }
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeMiddlewares() {
        this.app.use(cors({
            origin: '*', // Allow all origins by default
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            allowedHeaders: '*'
        }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
    }

    private initializeSwaggerDocs() {
        const swaggerOptions = {
            swaggerDefinition: {
                openapi: '3.0.0',
                info: {
                    title: 'API Documentation',
                    version: '1.0.0',
                },
                components: {
                    schemas: {
                        CreatePartDto: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                description: { type: 'string' },
                                quantityOnHand: { type: 'number' },
                                locationCode: { type: 'string' },
                                lastStockCheckDate: { type: 'string', format: 'date-time', nullable: true, default: null },
                                isDeleted: { type: 'boolean', nullable: true, default: false }
                            },
                            required: ['name', 'description', 'quantityOnHand', 'locationCode']
                        },
                        Part: {
                            type: 'object',
                            properties: {
                                partNumber: { type: 'string', required: true },
                                description: { type: 'string' },
                                quantityOnHand: { type: 'number' },
                                locationCode: { type: 'string' },
                                lastStockCheckDate: { type: 'string', format: 'date-time', default: null },
                                isDeleted: { type: 'boolean', default: false }
                            }
                        }
                    }
                },
            },
            apis: [__dirname + '/routes/*.ts'],
        };
        const swaggerDocs = swaggerJsdoc(swaggerOptions);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    }

    private initializeRoutes() {
        this.app.use('/api', router);

        // Catch 404 and forward to error handler
        this.app.use((req, res, next) => {
            const err = {
                status: 404,
                type: "https://httpstatuses.com/404",
                title: "Not Found",
                message: `Route ${req.originalUrl} not found`
            };
            next(new HttpException(err.type, err.title, err.status, err.message, err.message));
        });
    }

    public listen() {
        this.app.listen(process.env.PORT, () => {
            if (this.logger) {
                this.logger.debug(`App listening on the port ${process.env.PORT}`);
            }
        });
    }
    
    private connectToTheDatabase() {
        const {
        MONGO_USER,
        MONGO_PASSWORD,
        MONGO_PATH,
        MONGO_DB = 'assessment_project'
        } = process.env;

        const encodedPassword = encodeURIComponent(MONGO_PASSWORD || "");
        
        mongoose.connect(`mongodb://${MONGO_USER}:${encodedPassword}${MONGO_PATH}`, {
            dbName: MONGO_DB
        }).then(() => {
            if (this.logger) {
                this.logger.debug('Connected to MongoDB');
            }

            const seedParts = [
                {
                    partNumber: 'PRT-000001',
                    description: 'Brake Pad - High performance ceramic brake pad',
                    quantityOnHand: 50,
                    locationCode: 'LOC-001'
                },
                {
                    partNumber: 'PRT-000002',
                    description: 'Oil Filter - Synthetic oil filter for extended engine life',
                    quantityOnHand: 45,
                    locationCode: 'LOC-001'
                },
                {
                    partNumber: 'PRT-000003',
                    description: 'Spark Plug - Iridium spark plug for improved ignition',
                    quantityOnHand: 40,
                    locationCode: 'LOC-001'
                },
                {
                    partNumber: 'PRT-000004',
                    description: 'Brake Rotor - High performance brake rotor',
                    quantityOnHand: 35,
                    locationCode: 'LOC-001'
                },
            ];

            seedParts.forEach(async (part) => {
                let existingPart = await partModel.findById(part.partNumber)
                    .then(part => {
                        if (part) {
                            return part;
                        } else {
                            return null;
                        }
                    });

                if (!existingPart) {
                    existingPart = new partModel({
                        _id: part.partNumber,
                        description: part.description,
                        quantityOnHand: part.quantityOnHand,
                        locationCode: part.locationCode,
                        lastStockCheckDate: null,
                        isDeleted: false
                    });
                    await existingPart.save();
                }
            });

        }).catch(error => {
            if (this.logger) {
                this.logger.error('MongoDB connection error:', error);
            }
        });
    }
}

export default App;