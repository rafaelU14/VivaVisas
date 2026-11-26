import { EntitySchema } from 'typeorm';

export const Usuario = new EntitySchema({
  name: 'Usuario',
  tableName: 'usuarios',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    nombre: {
      type: 'varchar',
      length: 100,
    },
    email: {
      type: 'varchar',
      length: 150,
      unique: true,
    },
    password: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    role: {
      type: 'varchar',
      length: 20,
      default: 'ADVISOR',
    },
    status: {
      type: 'boolean',
      default: true,
    },
    lastLogin: {
      type: 'timestamp',
      nullable: true,
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
    }
  },
});
