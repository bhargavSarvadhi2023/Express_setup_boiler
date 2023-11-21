import { Express, Request, Response } from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { logger } from '../logger/logger';

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Rest Api Docs',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://127.0.0.1:5000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/swagger/*.ts'],
};

const swaggerSpec = swaggerJsDoc(options);

function serveSwaggerDocs(app: Express, port: any) {
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

    app.get('/docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    logger.info(`Docs available at: http://localhost:${port}/docs`);
}

export default serveSwaggerDocs;
