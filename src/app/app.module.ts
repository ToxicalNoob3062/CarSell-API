import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { ReportsModule } from '../reports/reports.module';
//my imports
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from '../orm-config/typeorm.config';
import cookieSession = require('cookie-session'); //Because nestJS dont support es-version for this module.

const OrmModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService
});

const EnvModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: `.env`
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
  convertEnvForProd(key: string) {
    const env = process.env.NODE_ENV;
    if (env === "production") {
      return process.env[key];
    }
    return this.configService.get<string>(key);
  }
  //setting up middle ware globally inside app module instead of bootstrap function
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: [this.convertEnvForProd('COOKIE_KEY')]
    })).forRoutes('*');
  };
};
