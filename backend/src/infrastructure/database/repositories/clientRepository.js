import { AppDataSource } from '../data-source.js';

export async function findDuplicateClient(email, identification, excludeId = null) {
  let query = `
    SELECT id, email, identificacion 
    FROM clientes 
    WHERE (LOWER(email) = LOWER($1) OR (identificacion IS NOT NULL AND identificacion = $2))
  `;
  const params = [email, identification || null];

  if (excludeId) {
    query += ` AND id != $3`;
    params.push(excludeId);
  }

  const results = await AppDataSource.query(query, params);
  return results[0] || null;
}

export async function createClient(data) {
  const query = `
    INSERT INTO clientes (nombres, apellidos, identificacion, telefono, email, activo)
    VALUES ($1, $2, $3, $4, $5, true)
    RETURNING id, nombres, apellidos, identificacion, telefono, email, activo, created_at, updated_at
  `;
  const params = [
    data.nombres.trim(),
    data.apellidos.trim(),
    data.identificacion ? data.identificacion.trim() : null,
    data.telefono.trim(),
    data.email.trim().toLowerCase(),
  ];

  const result = await AppDataSource.query(query, params);
  return result[0];
}

export async function getClients({ page = 1, limit = 10, search = '' }) {
  const numericLimit = Math.max(1, parseInt(limit, 10) || 10);
  const numericPage = Math.max(1, parseInt(page, 10) || 1);
  const offset = (numericPage - 1) * numericLimit;

  let whereClause = `WHERE activo = true`;
  const params = [];

  if (search && search.trim() !== '') {
    params.push(`%${search.trim()}%`);
    whereClause += ` AND (
      nombres ILIKE $${params.length} OR 
      apellidos ILIKE $${params.length} OR 
      email ILIKE $${params.length} OR 
      (identificacion IS NOT NULL AND identificacion ILIKE $${params.length})
    )`;
  }

  const countQuery = `SELECT COUNT(*)::int as total FROM clientes ${whereClause}`;
  const countResult = await AppDataSource.query(countQuery, params);
  const total = countResult[0]?.total || 0;

  const dataQuery = `
    SELECT id, nombres, apellidos, identificacion, telefono, email, activo, created_at, updated_at
    FROM clientes
    ${whereClause}
    ORDER BY id DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;
  const dataParams = [...params, numericLimit, offset];
  const clients = await AppDataSource.query(dataQuery, dataParams);

  return {
    data: clients,
    pagination: {
      total,
      page: numericPage,
      limit: numericLimit,
      totalPages: Math.ceil(total / numericLimit) || 1,
    },
  };
}

export async function getClientById(id) {
  const query = `
    SELECT id, nombres, apellidos, identificacion, telefono, email, activo, created_at, updated_at
    FROM clientes
    WHERE id = $1 AND activo = true
  `;
  const results = await AppDataSource.query(query, [id]);
  return results[0] || null;
}

export async function updateClient(id, data) {
  const query = `
    UPDATE clientes
    SET nombres = $1,
        apellidos = $2,
        identificacion = $3,
        telefono = $4,
        email = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $6 AND activo = true
    RETURNING id, nombres, apellidos, identificacion, telefono, email, activo, created_at, updated_at
  `;
  const params = [
    data.nombres.trim(),
    data.apellidos.trim(),
    data.identificacion ? data.identificacion.trim() : null,
    data.telefono.trim(),
    data.email.trim().toLowerCase(),
    id,
  ];

  const results = await AppDataSource.query(query, params);
  return results[0] || null;
}

export async function softDeleteClient(id) {
  const query = `
    UPDATE clientes
    SET activo = false,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND activo = true
    RETURNING id, activo
  `;
  const results = await AppDataSource.query(query, [id]);
  return results[0] || null;
}