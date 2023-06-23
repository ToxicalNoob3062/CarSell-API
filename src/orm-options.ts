import { TypeOrmModuleOptions } from "@nestjs/typeorm";

let dbConfig: Partial<TypeOrmModuleOptions> = {
    synchronize: false,
    autoLoadEntities: true,
};

export function OrmOptions(env: string, isCli: boolean = false) {
    switch (env) {
        case 'development':
            Object.assign(dbConfig, {
                type: 'sqlite',
                database: 'db/dev.sqlite',
                migrations: [__dirname + '/migrations/dev/*.ts'],
            });
            break;
        case 'testing':
            Object.assign(dbConfig, {
                type: 'sqlite',
                database: 'db/test.sqlite',
                migrations: [__dirname + '/migrations/test/*.ts'],
                migrationsRun: true
            });
            break;
        case 'production':
            Object.assign(dbConfig, {
                type: 'postgres',
                url: process.env.DB_URL,
                extra: {
                    connectionLimit: 5,
                    ssl: {
                        "rejectUnauthorized": true
                    }
                },
                ssl: true,
                migrations: [__dirname + '/migrations/prod/*.ts'],
            });
            break;
        default:
            throw new Error("OOPS! Environment Not valid!");
    }

    if (isCli) {
        Object.assign(dbConfig, {
            entities: ['**/*.entity.ts'],
            autoLoadEntities: false,
        });
    }
    return dbConfig;
};

