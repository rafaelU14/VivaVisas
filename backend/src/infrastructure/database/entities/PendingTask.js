import { EntitySchema } from 'typeorm';

export const PendingTask = new EntitySchema({
  name: 'PendingTask',
  tableName: 'tareas_pendientes',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    type: {
      name: 'tipo',
      type: 'varchar',
      length: 50,
      nullable: false,
    },
    payload: {
      name: 'payload',
      type: 'jsonb',
      nullable: false,
    },
    status: {
      name: 'estado',
      type: 'varchar',
      length: 30,
      default: 'PENDING',
      nullable: false,
    },
    attempts: {
      name: 'intentos',
      type: 'int',
      default: 0,
      nullable: false,
    },
    maxAttempts: {
      name: 'max_intentos',
      type: 'int',
      default: 3,
      nullable: false,
    },
    runAfter: {
      name: 'ejecutar_despues',
      type: 'timestamptz',
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
  indices: [
    {
      name: 'IDX_PENDING_TASK_STATUS_RUN',
      columns: ['status', 'runAfter'],
    },
  ],
});
