export class InitialSchema1732640000000 {
  name = 'InitialSchema1732640000000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "usuarios" (
        "id" SERIAL PRIMARY KEY,
        "nombre" character varying(100) NOT NULL,
        "email" character varying(150) NOT NULL UNIQUE,
        "password" character varying(255),
        "role" character varying(20) NOT NULL DEFAULT 'ADVISOR',
        "status" boolean NOT NULL DEFAULT true,
        "lastLogin" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "clientes" (
        "id" SERIAL PRIMARY KEY,
        "nombres" character varying(100) NOT NULL,
        "apellidos" character varying(100) NOT NULL,
        "identificacion" character varying(50) UNIQUE,
        "telefono" character varying(30) NOT NULL,
        "email" character varying(150) NOT NULL UNIQUE,
        "activo" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "citas" (
        "id" SERIAL PRIMARY KEY,
        "asesor_id" integer NOT NULL REFERENCES "usuarios"("id") ON DELETE RESTRICT,
        "cliente_id" integer NOT NULL REFERENCES "clientes"("id") ON DELETE RESTRICT,
        "servicio" character varying(150) NOT NULL,
        "modalidad" character varying(30) NOT NULL DEFAULT 'PRESENCIAL',
        "ubicacion_enlace" character varying(255),
        "es_grupal" boolean NOT NULL DEFAULT false,
        "cantidad_solicitantes" integer NOT NULL DEFAULT 1,
        "fecha_inicio" TIMESTAMPTZ NOT NULL,
        "fecha_fin" TIMESTAMPTZ NOT NULL,
        "estado" character varying(30) NOT NULL DEFAULT 'PROGRAMADA',
        "tarifa_estimada" numeric(10,2),
        "notas" text,
        "google_event_id" character varying(255),
        "sync_status" character varying(30) NOT NULL DEFAULT 'PENDING',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_CITA_INTERVALO" CHECK ("fecha_fin" > "fecha_inicio")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_APPOINTMENT_ADVISOR_TIME"
      ON "citas" ("asesor_id", "fecha_inicio", "fecha_fin")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_APPOINTMENT_STATUS"
      ON "citas" ("estado")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cita_participantes" (
        "id" SERIAL PRIMARY KEY,
        "cita_id" integer NOT NULL REFERENCES "citas"("id") ON DELETE CASCADE,
        "cliente_id" integer NOT NULL REFERENCES "clientes"("id") ON DELETE RESTRICT,
        "rol_participante" character varying(50) NOT NULL DEFAULT 'ACOMPANANTE',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_APPOINTMENT_PARTICIPANT" UNIQUE ("cita_id", "cliente_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "recordatorios" (
        "id" SERIAL PRIMARY KEY,
        "cita_id" integer NOT NULL REFERENCES "citas"("id") ON DELETE CASCADE,
        "tipo" character varying(30) NOT NULL,
        "destinatario_email" character varying(150) NOT NULL,
        "programado_para" TIMESTAMPTZ NOT NULL,
        "enviado_en" TIMESTAMPTZ,
        "estado" character varying(30) NOT NULL DEFAULT 'PENDIENTE',
        "intentos" integer NOT NULL DEFAULT 0,
        "ultimo_error" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_REMINDER_STATUS_SCHEDULE"
      ON "recordatorios" ("estado", "programado_para")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sync_logs" (
        "id" SERIAL PRIMARY KEY,
        "cita_id" integer NOT NULL REFERENCES "citas"("id") ON DELETE CASCADE,
        "entidad" character varying(50) NOT NULL DEFAULT 'GOOGLE_CALENDAR',
        "operacion" character varying(30) NOT NULL,
        "external_id" character varying(255),
        "estado" character varying(30) NOT NULL,
        "intentos" integer NOT NULL DEFAULT 1,
        "detalle_error" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id" SERIAL PRIMARY KEY,
        "usuario_id" integer REFERENCES "usuarios"("id") ON DELETE SET NULL,
        "accion" character varying(50) NOT NULL,
        "entidad" character varying(50) NOT NULL,
        "entidad_id" integer,
        "datos_anteriores" jsonb,
        "datos_nuevos" jsonb,
        "ip_origen" character varying(45),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_AUDIT_ENTITY"
      ON "audit_logs" ("entidad", "entidad_id")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tareas_pendientes" (
        "id" SERIAL PRIMARY KEY,
        "tipo" character varying(50) NOT NULL,
        "payload" jsonb NOT NULL,
        "estado" character varying(30) NOT NULL DEFAULT 'PENDING',
        "intentos" integer NOT NULL DEFAULT 0,
        "max_intentos" integer NOT NULL DEFAULT 3,
        "ejecutar_despues" TIMESTAMPTZ NOT NULL,
        "ultimo_error" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_PENDING_TASK_STATUS_RUN"
      ON "tareas_pendientes" ("estado", "ejecutar_despues")
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE IF EXISTS "tareas_pendientes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sync_logs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "recordatorios"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cita_participantes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "citas"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "clientes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "usuarios"`);
  }
}
