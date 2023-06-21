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
import { ConfigModule, ConfigService } from '@nestjs/config';
import cookieSession = require('cookie-session'); //Because nestJS dont support es-version for this module.

const OrmModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return {
      type: "sqlite",
      database: `db/${config.get<string>('DB_NAME')}`,
      synchronize: true,
      entities: [User, Report]
    };
  }
});

const EnvModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: `env/.env.${process.env.NODE_ENV}`
});

@Module({
  imports: [UsersModule, ReportsModule, OrmModule, EnvModule],
  controllers: [AppController],
  providers: [AppService, {
    //This is how you set global pipes inside App module instead of bootstrap function!
    provide: APP_PIPE,
    useValue: new ValidationPipe({ whitelist: true })
  }],
})
export class AppModule {
  constructor(
    private configService: ConfigService,
  ) { }
  //setting up middle ware globally inside app module instead of bootstrap function
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: [this.configService.get<string>("COOKIE_KEY")]
    })).forRoutes('*');
  };
};
