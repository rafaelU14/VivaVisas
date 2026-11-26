import { EntitySchema } from 'typeorm';

export const AuditLog = new EntitySchema({
  name: 'AuditLog',
  tableName: 'audit_logs',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    userId: {
      name: 'usuario_id',
      type: 'int',
      nullable: true,
    },
    action: {
      name: 'accion',
      type: 'varchar',
      length: 50,
      nullable: false,
    },
    entityName: {
      name: 'entidad',
      type: 'varchar',
      length: 50,
      nullable: false,
    },
    entityId: {
      name: 'entidad_id',
      type: 'int',
      nullable: true,
    },
    previousData: {
      name: 'datos_anteriores',
      type: 'jsonb',
      nullable: true,
    },
    newData: {
      name: 'datos_nuevos',
      type: 'jsonb',
      nullable: true,
    },
    ipAddress: {
      name: 'ip_origen',
      type: 'varchar',
      length: 45,
      nullable: true,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'Usuario',
      joinColumn: { name: 'usuario_id' },
      onDelete: 'SET NULL',
    },
  },
  indices: [
    {
      name: 'IDX_AUDIT_ENTITY',
      columns: ['entityName', 'entityId'],
    },
  ],
});
