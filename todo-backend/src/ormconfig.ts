import { join } from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const defaultOption = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'postgres',
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? 'postgres',
  database: process.env.DB_NAME ?? 'postgres',
  poolSize: 5,
  synchronize: false,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations/*.{ts,js}')],
});

const testOption = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'postgres',
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? 'postgres',
  database: 'todo_app_test',
  dropSchema: true,
  poolSize: 5,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  synchronize: true,
});

const optionToUse = {
  development: defaultOption,
  test: testOption,
};

module.exports = [
  optionToUse[process.env.NODE_ENV ?? 'development'],
  {
    cli: { migrationsDir: 'src/migrations' },
    factories: [join(__dirname, '**', '*.factory.{ts,js}')],
  },
];
