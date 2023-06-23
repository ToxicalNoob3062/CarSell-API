import { Report } from './report.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
        private repo: Repository<Report>
    ) { }
    async create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto);
        report.user = user;
        return await this.saveReport(report);
    }
    async changeApproval(id: string, approved: boolean) {
        const report = await this.findReport(id);
        if (!report) return null;
        report.approved = approved;
        return await this.saveReport(report);
    }

    async findReport(id: string) {
        const report = await this.repo.findOne({ where: { id: parseInt(id) }, relations: ['user'] });
        if (!report) return null;
        return report;
    }

    async deleteReport(report: Report) {
        return await this.repo.remove(report);
    }

    async saveReport(report: Report) {
        return await this.repo.save(report);
    }

    async createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
        return await this.repo.createQueryBuilder('report')
            .select('AVG(report.price)', 'price')
            .addSelect('report.mileage', 'mileage')
            .where('report.make = :make', { make })
            .andWhere('report.model = :model', { model })
            .andWhere('report.lng BETWEEN :lngMin AND :lngMax', { lngMin: lng - 5, lngMax: lng + 5 })
            .andWhere('report.lat BETWEEN :latMin AND :latMax', { latMin: lat - 5, latMax: lat + 5 })
            .andWhere('report.year BETWEEN :yearMin AND :yearMax', { yearMin: year - 3, yearMax: year + 3 })
            .andWhere('report.approved IS TRUE')
            .addGroupBy('report.mileage')
            .orderBy('CASE WHEN report.mileage >= :mileage THEN report.mileage - :mileage ELSE :mileage - report.mileage END', 'DESC')
            .setParameters({ mileage })
            .limit(3)
            .getRawOne()
            .then(result => (result && { price: parseInt(result.price) }) || 0);

    }
}
