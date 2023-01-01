import { IConfigService } from './../config/config.service.interface';
import { ConfigService } from './../config/config.service';
import { TYPES } from './../types';
import { UserLoginDto } from './dto/user.login.dto';
import { UserRegisterDto } from './dto/user.register.dto';
import { User } from './user.entity';
import { IUsersService } from './users.service.interface';
import { injectable, inject } from 'inversify';
import "reflect-metadata";

@injectable()
export class UsersService implements IUsersService {
    constructor(@inject(TYPES.ConfigService) private ConfigService: IConfigService) {}
    async createUser ({email, name, password}: UserRegisterDto): Promise<User | null> {
        const newUser = new User(email, name);
        await newUser.setPassword(password);
        return null;
    }

    async validateUser (dto: UserLoginDto): Promise<boolean> {
        return true;
    }
}