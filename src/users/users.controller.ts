import { User } from './user.entity';
import { UserRegisterDto } from './dto/user.register.dto';
import { UserLoginDto } from './dto/user.login.dto';
import { IUserController } from './users.controller.interface';
import { TYPES } from './../types';
import { ILogger } from './../logger/logger.interface';
import { HTTPError } from './../errors/http-error.class.error';
import { BaseController } from "../common/base.controller";
import { LoggerService } from "../logger/logger.service";
import { NextFunction, Response, Request  } from "express";
import { injectable, inject } from 'inversify';
import 'reflect-metadata';

@injectable()
export class UsersController extends BaseController implements IUserController {
    constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
        super(loggerService);

        this.bindRoutes([
            {
                path: '/register',
                method: 'post',
                func: this.register
            },
            {
                path: '/login',
                method: 'post',
                func: this.login
            }
        ])
    }

    login (req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction) {
        next(new HTTPError(401, 'Error Authentication', 'login'));
    }

    async register ({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const newUser = new User(body.email, body.name);
        await newUser.setPassword(body.password);
        this.ok(res, newUser);
    }
}