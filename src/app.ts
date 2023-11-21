import express, { Express } from 'express';
import './config/database';
import dotenv from 'dotenv';
dotenv.config();
import { logger } from './logger/logger';
import { ErrorHandler } from './middleware';
import './config/passport.jwt';
import routes from './routes/index';
import passport from 'passport';
import serveSwaggerDocs from './utils/swagger';

const port = process.env.PORT_SERVER || 4000;

class AppServer {
    constructor() {
        const app: Express = express();
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(passport.initialize());
        app.use('/api/v1', routes);
        app.use(ErrorHandler);
        serveSwaggerDocs(app, port);
        app.listen(port, () => {
            logger.info(`🚀 Server is listening on Port:- ${port}`);
        });
    }
}
new AppServer();
