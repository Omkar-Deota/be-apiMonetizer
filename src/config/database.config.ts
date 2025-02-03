import { DataSource } from 'typeorm';
import env from './environment.config';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: env.db.host,
	username: env.db.user,
	password: env.db.password,
	database: env.db.dbName,
	synchronize: true,
	logging: ['error', 'warn'],
	entities: ['src/**/*.model.ts'],
	ssl: true,
	migrations: ['src/migrations/*.ts']
});
