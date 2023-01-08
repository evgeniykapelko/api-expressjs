import { AuthGuard } from './../common/auth.guard';
import { IUsersService } from './users.service.interface';
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
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class UsersController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.UsersService) private userService: IUsersService,
        @inject(TYPES.ConfigService) private configService: IConfigService
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

            },
            {
                path: '/info',
                method: 'get',
                func: this.info,
                middlewares: [new AuthGuard()]

            }
        ])
    }

    async login (req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.validateUser(req.body);

        if (!result) {
            return next(new HTTPError(401, 'Error Authentication', 'login'));
        }
        
        const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));

        this.ok(res, { jwt });

    }

    async register ({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.createUser(body);

        if (!result) {
            return next(new HTTPError(422, 'User is exists'));
        }

        this.ok(res, {email: result.email, id: result.id});
    }

    async info ({ user }: Request, res: Response, next: NextFunction): Promise<void> {
        const userInfo = await this.userService.getUserInfo(user);
        this.ok(res, { email: userInfo?.email, id: userInfo?.id });
    }

    private signJWT(email: string, secret: string): Promise<string> {
        return new Promise((resolve, reject) => {
            sign({
                email,
                iat: Math.floor(Date.now() / 1000),
            }, secret,
            {
                algorithm: 'HS256',
            },
            (err, token) => {
                if (err) {
                   reject(); 
                }
                resolve(token as string)
            });
        });
    }
}