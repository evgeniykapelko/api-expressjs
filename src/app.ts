import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { ExeptionFilter } from './errors/exeption.filter';
import { UsersController } from './users/users.controller';
import { LoggerService } from './logger/logger.service';
import express, { Express } from "express"
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class App {
    app: Express;
    server: Server;
    port: number;
    
    constructor (
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: UsersController,
        @inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
    ) {
        this.app = express();
        this.port = 9005;
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