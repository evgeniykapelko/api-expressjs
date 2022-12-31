import { UserLoginDto } from './dto/user.login.dto';
import { NextFunction, Request, Response } from 'express';
import { UserRegisterDto } from './dto/user.register.dto';
import { User } from './user.entity';

export interface IUsersService {
    createUser: (dto: UserRegisterDto) => Promise<User | null>;
    validateUser: (dto: UserLoginDto) => Promise<boolean>;
}