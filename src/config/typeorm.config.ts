import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import * as path from "path";

const env = process.env.NODE_ENV;
const isTest = env === 'testing' ? true : false;

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) { };
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'sqlite',
            synchronize: false,
            database: `db/${this.configService.get<string>('DB_NAME')}`,
            autoLoadEntities: true,
            migrations: isTest ? [path.join(__dirname, "../migrations/test/*.ts")] : [],
            migrationsRun: isTest,
        };
    };
}