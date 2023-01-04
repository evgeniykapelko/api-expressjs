import { ValidateMiddleware } from './../common/validate.middleware';
import { UsersService } from './users.service';
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
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.UsersService) private userService: UsersService
     ) {
        super(loggerService);

        this.bindRoutes([
            {
                path: '/register',
                method: 'post',
                func: this.register,
                middlewares: [new ValidateMiddleware(UserRegisterDto)]
            },
            {
                path: '/login',
                method: 'post',
                func: this.login,
                middlewares: [new ValidateMiddleware(UserLoginDto)]

            }
        ])
    }

    async login (req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.validateUser(req.body);

        if (!result) {
            return next(new HTTPError(401, 'Error Authentication', 'login'));
        }
        
        this.ok(res, {});

    }

    async register ({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.createUser(body);

        if (!result) {
            return next(new HTTPError(422, 'User is exists'));
        }

        this.ok(res, {email: result.email, id: result.id});
    }
}