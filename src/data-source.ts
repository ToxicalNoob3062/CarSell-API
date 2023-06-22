//this file is just only to use typeorm cli only
import { DataSource, DataSourceOptions } from "typeorm";

let dbConfig = {
    synchronize: false
};

switch (process.env.NODE_ENV) {
    case 'development':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'db/dev.sqlite',
            entities: ['**/*.entity.ts'],
            migrations: [__dirname + '/migrations/dev/*.ts']
        });
        break;
    case 'testing':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'db/test.sqlite',
            entities: ['**/*.entity.ts'],
            migrations: [__dirname + '/migrations/test/*.ts']
        });
        break;
    case 'production':
        break;
    default:
        throw new Error("OOPS! Environment Not valid!");
}

export const appDataSource = new DataSource(dbConfig as DataSourceOptions);