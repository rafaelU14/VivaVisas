import { EntitySchema } from 'typeorm';

export const Cliente = new EntitySchema({
  name: 'Cliente',
  tableName: 'clientes',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    nombres: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    apellidos: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    identificacion: {
      type: 'varchar',
      length: 50,
      nullable: true,
      unique: true,
    },
    telefono: {
      type: 'varchar',
      length: 30,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 150,
      nullable: false,
      unique: true,
    },
    activo: {
      type: 'boolean',
      default: true,
      nullable: false,
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
    },
    updated_at: {
      type: 'timestamp',
      updateDate: true,
    },
  },
  relations: {
    appointments: {
      type: 'one-to-many',
      target: 'Appointment',
      inverseSide: 'client',
    },
    participations: {
      type: 'one-to-many',
      target: 'AppointmentParticipant',
      inverseSide: 'client',
    },
  },
});