import { ReportsService } from './reports.service';
import { Controller, Post, Body, UseGuards, Patch, Param, NotFoundException, Get } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApprovedReportDto } from './dtos/approved-report.dto';
import { httpError } from 'src/extras/utility.functions';

@Controller('/reports')
@Serialize(ReportDto)
export class ReportsController {
    constructor(
        private reportsService: ReportsService
    ) { }

    @UseGuards(AuthGuard)
    @Post('/create')
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(body, user);
    }

    @Patch('/:id')
    async approveReport(@Param('id') id: string, @Body() { approved }: ApprovedReportDto) {
        const report = await this.reportsService.changeApproval(id, approved);
        return httpError(report, NotFoundException, `Was not able to find a report with id ${id}`);
    }

    @Get('/:id')
    async getReport(@Param('id') id: string) {
        const report = await this.reportsService.findReport(id);
        return httpError(report, NotFoundException, `Was not able to find a report with id ${id}`);
    }
}
