import { UserLoginDto } from './dto/user.login.dto';
import { UserRegisterDto } from './dto/user.register.dto';
import { User } from './user.entity';
import { IUsersService } from './users.service.interface';
import { injectable, inject } from 'inversify';

@injectable()
export class UsersService implements IUsersService {
    async createUser ({email, name, password}: UserRegisterDto): Promise<User | null> {
        const newUser = new User(email, name);
        await newUser.setPassword(password);
        return null;
    }

    async validateUser (dto: UserLoginDto): Promise<boolean> {
        return true;
    }
}