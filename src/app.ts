import { AuthMiddleware } from './common/auth.middleware';
import { PrismaService } from './database/prisma.service';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { IConfigService } from './config/config.service.interface';
import { IUserController } from './users/users.controller.interface';
import { ConfigService } from './config/config.service';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { ExeptionFilter } from './errors/exeption.filter';
import { UsersController } from './users/users.controller';
import { LoggerService } from './logger/logger.service';
import express, { Express } from "express"
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { json } from 'body-parser';
import 'reflect-metadata';

@injectable()
export class App {
    app: Express;
    server: Server;
    port: number;
    
    constructor (
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: UsersController,
        @inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
        @inject(TYPES.ConfigService) private сonfigService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) {
        this.app = express();
        this.port = 9011;
    }

    useMiddleware(): void {
        this.app.use(json());
        const authMiddleware = new AuthMiddleware(this.сonfigService.get('SECRET'));
        this.app.use(authMiddleware.execute.bind(authMiddleware));
    }

    useRoutes(): void {
        this.app.use('/users', this.userController.router);
    }

    useExeptionFilters(): void {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
    }

    public async init (): Promise<void> {
        this.useMiddleware();
        this.useRoutes();
        this.useExeptionFilters();
        await this.prismaService.connect();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server work on http://localhost:${this.port}`);
    }

    public close(): void {
        this.server.close();
    }
}