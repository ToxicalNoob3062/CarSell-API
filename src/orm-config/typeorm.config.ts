import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { OrmOptions } from "../orm-options";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return OrmOptions(process.env.NODE_ENV);
    };
}