import { AppDataSource } from '../data-source.js';

export async function getAppointmentsByDate(dateString, advisorId = null) {
  try {
    if (!AppDataSource.isInitialized) {
      return [];
    }

    const query = `
      SELECT id, asesor_id as "advisorId", cliente_id as "clientId",
             fecha_inicio as "start", fecha_fin as "end", estado as "status"
      FROM citas
      WHERE DATE(fecha_inicio) = $1
      ${advisorId ? 'AND asesor_id = $2' : ''}
    `;

    const params = advisorId ? [dateString, advisorId] : [dateString];
    return await AppDataSource.query(query, params);
  } catch {
    return [];
  }
}