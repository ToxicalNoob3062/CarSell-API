import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { ReportsModule } from '../reports/reports.module';
//my imports
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Report } from '../reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
import cookieSession = require('cookie-session'); //Because nestJS dont support es-version for this module.

const OrmModule = TypeOrmModule.forRoot({
  type: "sqlite",
  database: `db.sqlite`,
  entities: [User, Report],
  synchronize: true,
});

@Module({
  imports: [UsersModule, ReportsModule, OrmModule],
  controllers: [AppController],
  providers: [AppService, {
    //This is how you set global pipes inside App module instead of bootstrap function!
    provide: APP_PIPE,
    useValue: new ValidationPipe({ whitelist: true })
  }],
})
export class AppModule {
  //setting up middle ware globally inside app module instead of bootstrap function
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: ["ola123"]
    })).forRoutes('*');
  };
};
