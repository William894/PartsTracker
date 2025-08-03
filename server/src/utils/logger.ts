import { createLogger, format, transports } from 'winston';

export async function getLogger() {
    const { SeqTransport } = await import('@datalust/winston-seq');
    return createLogger({
        level: process.env.LOG_LEVEL,
        format: format.combine(
            format.errors({ stack: true }),
            format.json(),
        ),
        defaultMeta: { application: 'parts-tracker' },
        transports: [
            new transports.Console(),
            new SeqTransport({
                serverUrl: `http://${process.env.SEQ_HOST}:${process.env.SEQ_PORT}`,
                apiKey: process.env.SEQ_API_KEY || '',
                onError: (error) => {
                    console.error('Error with Seq transport:', error);
                },
                level: process.env.LOG_LEVEL,
                handleExceptions: true,
                handleRejections: true,
                format: format.combine(
                    format.timestamp(),
                    format.json()
                )
            })
        ]
    });
}