import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let userRepositoryMock: Partial<Repository<User>>;

  beforeEach(async () => {
    userRepositoryMock = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
