import { IUsersRepository } from './users/users.repository.interface';
import { PrismaService } from './database/prisma.service';
import { PrismaClient } from '@prisma/client';
import { IConfigService } from './config/config.service.interface';
import { IUsersService } from './users/users.service.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { Container, interfaces, ContainerModule } from 'inversify';
import { App } from './app';
import { ExeptionFilter } from './errors/exeption.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { IUserController } from './users/users.controller.interface';
import { UsersService } from './users/users.service';
import { ConfigService } from './config/config.service';
import { UsersRepository } from './users/users.repository';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
    bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
    bind<IUserController>(TYPES.UserController).to(UsersController);
    bind<IUsersService>(TYPES.UsersService).to(UsersService);
    bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
    bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
    bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
    bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrapReturn> {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    await app.init();

    return { appContainer, app };
}

export const boot = bootstrap();