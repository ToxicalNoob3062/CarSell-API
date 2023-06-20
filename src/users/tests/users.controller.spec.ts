import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { AuthService } from '../auth.service';
import { User } from "../user.entity";

import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeAuthService = {
      signIn: (user: User, pass: string) => {
        const { password } = user;
        if (pass == password) return Promise.resolve(user);
        return null;
      }
    };
    fakeUsersService = {
      findByMail: (email: string) => Promise.resolve([{ id: 7, email, password: 'id@session' } as User]),
      findOne: (id: number) => Promise.resolve({ id, email: 'robo123@gmail.com', password: '123456' } as User)
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUsersService },
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('try to get all users with given mail.', async () => {
    const mail = 'rahat3062@mail.com';
    const users = await controller.findAllUsers(mail);
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(mail);
  });

  it('find user returns a single user with given id', async () => {
    await expect(controller.findUser('1')).resolves.toBeDefined();
  });

  it('find user throws error when user is not found', async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });
  it('Authenticating in updates session and returns user', async () => {
    const session: { userId?: number; } = {};
    const user = { email: 'rahat3062@gmail.com', password: 'id@session' };
    await expect(controller.signIn(user, session)).resolves.toBeDefined();
    expect(typeof session.userId).toBe("number");
  });
});
