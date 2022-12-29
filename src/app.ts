import { UsersController } from './users/users.controller';
import { LoggerService } from './logger/logger.service';
import express, { Express } from "express"
import { Server } from 'http';

export class App {
    app: Express;
    server: Server;
    port: number;
    logger: LoggerService;
    userController: UsersController;
    
    constructor (
        logger: LoggerService,
        userController: UsersController
    ) {
        this.app = express();
        this.port = 9003;
        this.logger = logger;
        this.userController = userController;
    }

    useRoutes() {
        this.app.use('/users', this.userController.router);
    }

    public async init () {
        this.useRoutes();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server work on http://localhost:${this.port}`);
    }
}