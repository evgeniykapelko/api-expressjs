import { ExeptionFilter } from './errors/exeption.filter';
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
    exeptionFilter: ExeptionFilter;
    
    constructor (
        logger: LoggerService,
        userController: UsersController,
        exeptionFilter: ExeptionFilter
    ) {
        this.app = express();
        this.port = 9005;
        this.logger = logger;
        this.userController = userController;
        this.exeptionFilter = exeptionFilter;
    }

    useRoutes() {
        this.app.use('/users', this.userController.router);
    }

    useExeptionFilters() {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
    }

    public async init () {
        this.useRoutes();
        this.useExeptionFilters();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server work on http://localhost:${this.port}`);
    }
}