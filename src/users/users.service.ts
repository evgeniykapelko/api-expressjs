import { IUsersRepository } from './users.repository.interface';
import { IConfigService } from './../config/config.service.interface';
import { ConfigService } from './../config/config.service';
import { TYPES } from './../types';
import { UserLoginDto } from './dto/user.login.dto';
import { UserRegisterDto } from './dto/user.register.dto';
import { User } from './user.entity';
import { IUsersService } from './users.service.interface';
import { injectable, inject } from 'inversify';
import "reflect-metadata";
import express from 'express';
import { UserModel } from '@prisma/client';
import { hash } from 'bcryptjs';

@injectable()
export class UsersService implements IUsersService {
    constructor(
        @inject(TYPES.ConfigService) private сonfigService: IConfigService,
        @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
    ) {}

    async createUser ({email, name, password}: UserRegisterDto): Promise<UserModel | null> {
        const newUser = new User(email, name);
        const salt = this.сonfigService.get('SALT');
        await newUser.setPassword(password, Number(salt));
        const existedUser = await this.usersRepository.find(email);

        if (existedUser) {
            return null;
        }

        return this.usersRepository.create(newUser);
    }

    async validateUser ({email, password}: UserLoginDto): Promise<boolean> {
        const existedUser = await this.usersRepository.find(dto.email);

        if (!existedUser) {
            return false;
        }

        const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
        
        return newUser.comparePassword(password);
    }
}