import { ReportsService } from './reports.service';
import { Controller, Post, Body, UseGuards, Patch, Param, NotFoundException, Get, Query } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApprovedReportDto } from './dtos/approved-report.dto';
import { httpError } from 'src/extras/utility.functions';
import { AdminGuard } from 'src/users/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('/reports')
export class ReportsController {
    constructor(
        private reportsService: ReportsService
    ) { }

    @Get()
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportsService.createEstimate(query);
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
}
