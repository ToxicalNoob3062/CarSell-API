import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from '../reports.controller';
import { Report } from '../report.entity';
import { ReportsService } from '../reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  let fakeReportsService: Partial<Report>;

  beforeEach(async () => {
    fakeReportsService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        { provide: ReportsService, useValue: fakeReportsService },
      ]
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});