import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Usuario } from './entities/Usuario.js';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true, // Sincroniza esquemas automáticamente en desarrollo
  logging: false,
  entities: [Usuario],
});
