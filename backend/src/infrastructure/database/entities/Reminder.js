import { EntitySchema } from 'typeorm';

export const Reminder = new EntitySchema({
  name: 'Reminder',
  tableName: 'recordatorios',
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
    type: {
      name: 'tipo',
      type: 'varchar',
      length: 30,
      nullable: false,
    },
    recipientEmail: {
      name: 'destinatario_email',
      type: 'varchar',
      length: 150,
      nullable: false,
    },
    scheduledFor: {
      name: 'programado_para',
      type: 'timestamptz',
      nullable: false,
    },
    sentAt: {
      name: 'enviado_en',
      type: 'timestamptz',
      nullable: true,
    },
    status: {
      name: 'estado',
      type: 'varchar',
      length: 30,
      default: 'PENDIENTE',
      nullable: false,
    },
    attempts: {
      name: 'intentos',
      type: 'int',
      default: 0,
      nullable: false,
    },
    lastError: {
      name: 'ultimo_error',
      type: 'text',
      nullable: true,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamptz',
      updateDate: true,
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
  indices: [
    {
      name: 'IDX_REMINDER_STATUS_SCHEDULE',
      columns: ['status', 'scheduledFor'],
    },
  ],
});
