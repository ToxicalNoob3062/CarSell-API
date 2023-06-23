//this file is just only to use typeorm cli only
import { DataSource, DataSourceOptions } from "typeorm";
import { OrmOptions } from "../orm-options";

export const appDataSource = new DataSource(OrmOptions(process.env.NODE_ENV, true) as DataSourceOptions);