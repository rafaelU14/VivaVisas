import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Usuario } from './entities/Usuario.js';
import { Cliente } from './entities/Cliente.js';
import { Appointment } from './entities/Appointment.js';
import { AppointmentParticipant } from './entities/AppointmentParticipant.js';
import { Reminder } from './entities/Reminder.js';
import { SyncLog } from './entities/SyncLog.js';
import { AuditLog } from './entities/AuditLog.js';
import { PendingTask } from './entities/PendingTask.js';
import { InitialSchema1732640000000 } from './migrations/1732640000000-InitialSchema.js';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  synchronize: false,
  logging: false,
  entities: [
    Usuario,
    Cliente,
    Appointment,
    AppointmentParticipant,
    Reminder,
    SyncLog,
    AuditLog,
    PendingTask,
  ],
  migrations: [InitialSchema1732640000000],
});
