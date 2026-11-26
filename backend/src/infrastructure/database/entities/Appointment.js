import { EntitySchema } from 'typeorm';

export const Appointment = new EntitySchema({
  name: 'Appointment',
  tableName: 'citas',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    advisorId: {
      name: 'asesor_id',
      type: 'int',
      nullable: false,
    },
    clientId: {
      name: 'cliente_id',
      type: 'int',
      nullable: false,
    },
    service: {
      name: 'servicio',
      type: 'varchar',
      length: 150,
      nullable: false,
    },
    modality: {
      name: 'modalidad',
      type: 'varchar',
      length: 30,
      default: 'PRESENCIAL',
      nullable: false,
    },
    locationOrLink: {
      name: 'ubicacion_enlace',
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    isGroup: {
      name: 'es_grupal',
      type: 'boolean',
      default: false,
      nullable: false,
    },
    applicantsCount: {
      name: 'cantidad_solicitantes',
      type: 'int',
      default: 1,
      nullable: false,
    },
    startTime: {
      name: 'fecha_inicio',
      type: 'timestamptz',
      nullable: false,
    },
    endTime: {
      name: 'fecha_fin',
      type: 'timestamptz',
      nullable: false,
    },
    status: {
      name: 'estado',
      type: 'varchar',
      length: 30,
      default: 'PROGRAMADA',
      nullable: false,
    },
    estimatedFee: {
      name: 'tarifa_estimada',
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: true,
    },
    notes: {
      name: 'notas',
      type: 'text',
      nullable: true,
    },
    googleEventId: {
      name: 'google_event_id',
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    syncStatus: {
      name: 'sync_status',
      type: 'varchar',
      length: 30,
      default: 'PENDING',
      nullable: false,
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
    advisor: {
      type: 'many-to-one',
      target: 'Usuario',
      joinColumn: { name: 'asesor_id' },
      onDelete: 'RESTRICT',
    },
    client: {
      type: 'many-to-one',
      target: 'Cliente',
      joinColumn: { name: 'cliente_id' },
      onDelete: 'RESTRICT',
    },
    participants: {
      type: 'one-to-many',
      target: 'AppointmentParticipant',
      inverseSide: 'appointment',
    },
    reminders: {
      type: 'one-to-many',
      target: 'Reminder',
      inverseSide: 'appointment',
    },
    syncLogs: {
      type: 'one-to-many',
      target: 'SyncLog',
      inverseSide: 'appointment',
    },
  },
  indices: [
    {
      name: 'IDX_APPOINTMENT_ADVISOR_TIME',
      columns: ['advisorId', 'startTime', 'endTime'],
    },
    {
      name: 'IDX_APPOINTMENT_STATUS',
      columns: ['status'],
    },
  ],
});
