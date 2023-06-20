import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from '../reports.service';
import { Repository } from 'typeorm';
import { Report } from '../report.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ReportsService', () => {
  let service: ReportsService;
  let userRepositoryMock: Partial<Repository<Report>>;

  beforeEach(async () => {
    userRepositoryMock = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});