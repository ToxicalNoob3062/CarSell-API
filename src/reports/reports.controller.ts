import { ReportsService } from './reports.service';
import { Controller, Post, Body, UseGuards, Patch, Param, NotFoundException, Get, Query, Delete, BadRequestException } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { AuthGuard } from '../users/guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApprovedReportDto } from './dtos/approved-report.dto';
import { httpError } from '../extras/utility.functions';
import { AdminGuard } from '../users/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { UpdateReportDto } from './dtos/update-report.dto';

@Controller('/reports')
export class ReportsController {
    constructor(
        private reportsService: ReportsService
    ) { }

    @Get()
    async getEstimate(@Query() query: GetEstimateDto) {
        const res = await this.reportsService.createEstimate(query);
        return httpError(res, BadRequestException, 'Data shortage!!!');
    }

    @UseGuards(AuthGuard)
    @Post('/create')
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(body, user);
    }

    @UseGuards(AdminGuard)
    @Patch('/:id')
    @Serialize(ReportDto)
    async approveReport(@Param('id') id: string, @Body() { approved }: ApprovedReportDto) {
        const report = await this.reportsService.changeApproval(id, approved);
        return httpError(report, NotFoundException, `Was not able to find a report with id ${id}`);
    }

    @Get('/:id')
    @Serialize(ReportDto)
    async getReport(@Param('id') id: string) {
        const report = await this.reportsService.findReport(id);
        return httpError(report, NotFoundException, `Was not able to find a report with id ${id}`);
    }


    @UseGuards(AuthGuard)
    @Get('/my/:id')
    async getUserReports(@Param('id') id: string, @CurrentUser() user: User) {
        if (id == "all") return user.reports;
        const intId = parseInt(id);
        return user.reports.filter(report => intId == report.id)[0];
    }

    @UseGuards(AuthGuard)
    @Patch('/my/:id')
    @Serialize(ReportDto)
    async updateUserReport(@Param("id") id: string, @CurrentUser() user: User, @Body() body: UpdateReportDto) {
        let report = await this.reportsService.findReport(id);
        if (!report) throw new NotFoundException(`Report not found with an id of ${id}!`);
        if (report.user.id !== user.id && !user.admin) throw new BadRequestException(`You are not the owner of this report!`);
        report = Object.assign(report, body);
        return this.reportsService.saveReport(report);
    }

    @UseGuards(AuthGuard)
    @Delete("/:id")
    @Serialize(ReportDto)
    async deleteReport(@Param("id") id: string, @CurrentUser() user: User) {
        let report = await this.reportsService.findReport(id);
        if (!report) throw new NotFoundException(`Report not found with an id of ${id}!`);
        if (report.user.id !== user.id && !user.admin) throw new BadRequestException(`You are not the owner of this report!`);
        return await this.reportsService.deleteReport(report);
    }
}
