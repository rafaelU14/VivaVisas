import { EntitySchema } from 'typeorm';

export const AppointmentParticipant = new EntitySchema({
  name: 'AppointmentParticipant',
  tableName: 'cita_participantes',
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
    clientId: {
      name: 'cliente_id',
      type: 'int',
      nullable: false,
    },
    participantRole: {
      name: 'rol_participante',
      type: 'varchar',
      length: 50,
      default: 'ACOMPANANTE',
      nullable: false,
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
    client: {
      type: 'many-to-one',
      target: 'Cliente',
      joinColumn: { name: 'cliente_id' },
      onDelete: 'RESTRICT',
    },
  },
  indices: [
    {
      name: 'UQ_APPOINTMENT_PARTICIPANT',
      columns: ['appointmentId', 'clientId'],
      unique: true,
    },
  ],
});
