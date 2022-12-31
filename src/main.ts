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


export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService);
    bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
    bind<IUserController>(TYPES.UserController).to(UsersController);
    bind<IUsersService>(TYPES.UsersService).to(UsersService);
    bind<App>(TYPES.Application).to(App);
});

function bootstrap() {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    app.init();

    return { appContainer, app };
}

export const { app, appContainer } = bootstrap();