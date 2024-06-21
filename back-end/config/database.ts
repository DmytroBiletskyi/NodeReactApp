import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/User';
import { Position } from '../entities/Position';

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRESQL_HOST,
    port: Number(process.env.POSTGRESQL_PORT),
    username: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
    entities: [User, Position],
    synchronize: true,
    dropSchema: false,
    logging: false,
    migrations: ["migrations/*{.ts,.js}"],
    subscribers: [],
    ssl: {
        rejectUnauthorized: true
    },
});