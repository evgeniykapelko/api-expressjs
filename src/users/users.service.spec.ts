import 'reflect-metadata';
import { UsersService } from './users.service';
import { Container } from "inversify";
import { IConfigService } from "../config/config.service.interface";
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { IUsersService } from './users.service.interface';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
    get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
    find: jest.fn(),
    create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUsersService;

beforeAll(() => {
    container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
    container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
    container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock)

    configService = container.get<IConfigService>(TYPES.ConfigService);
    usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
    usersService = container.get<IUsersService>(TYPES.UsersService);
})

let createdUser: UserModel | null;

describe('User Service', () => {
    it('createUser', async () => {

        configService.get = jest.fn().mockReturnValueOnce('1');

        usersRepository.create = jest.fn().mockImplementationOnce(
            (user: User): UserModel => ({
                name: user.name,
                email: user.email,
                password: user.password,
                id: 1
            })
        );
        const createdUser = await usersService.createUser({
            email: 'admin@admin.com',
            name: 'Joe',
            password: 'root'
        });

        expect(createdUser?.id).toEqual(1);
        expect(createdUser?.password).not.toEqual('1');
    })
})