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
    creadoEn: {
      type: 'timestamp',
      createDate: true,
    },
  },
});
