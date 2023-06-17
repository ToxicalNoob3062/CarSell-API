import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { ReportsModule } from '../reports/reports.module';
//my imports
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Report } from '../reports/report.entity';

const OrmModule = TypeOrmModule.forRoot({
  type: "sqlite",
  database: "db.sqlite",
  entities: [User, Report],
  synchronize: true,
});

@Module({
  imports: [UsersModule, ReportsModule, OrmModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { };
