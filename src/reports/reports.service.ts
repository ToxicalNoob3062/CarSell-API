import { Report } from './report.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
        private repo: Repository<Report>
    ) { }
    create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto);
        report.user = user;
        return this.repo.save(report);
    }
    async changeApproval(id: string, approved: boolean) {
        const report = await this.findReport(id);
        if (!report) return null;
        report.approved = approved;
        return this.repo.save(report);
    }

    async findReport(id: string) {
        const report = await this.repo.findOne({ where: { id: parseInt(id) }, relations: ['user'] });
        if (!report) return null;
        return report;
    }

}
