/* eslint-disable prettier/prettier */
import { DataSource, DataSourceOptions } from 'typeorm';

export const datasourceOptions:DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Postgres1998',
    database: 'task_management_app',
    entities:['dist/**/*.entity.js'],
    migrations:['dist/migrations/*.js']
};

const dataSource = new DataSource(datasourceOptions);

export default dataSource;

