import { EntitySchema } from 'typeorm';

export const SyncLog = new EntitySchema({
  name: 'SyncLog',
  tableName: 'sync_logs',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    appointmentId: {
      name: 'cita_id',
      type: 'int',
      nullable: false,
    },
    provider: {
      name: 'entidad',
      type: 'varchar',
      length: 50,
      default: 'GOOGLE_CALENDAR',
      nullable: false,
    },
    operation: {
      name: 'operacion',
      type: 'varchar',
      length: 30,
      nullable: false,
    },
    externalId: {
      name: 'external_id',
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    status: {
      name: 'estado',
      type: 'varchar',
      length: 30,
      nullable: false,
    },
    attempts: {
      name: 'intentos',
      type: 'int',
      default: 1,
      nullable: false,
    },
    errorDetail: {
      name: 'detalle_error',
      type: 'text',
      nullable: true,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true,
    },
  },
  relations: {
    appointment: {
      type: 'many-to-one',
      target: 'Appointment',
      joinColumn: { name: 'cita_id' },
      onDelete: 'CASCADE',
    },
  },
});
