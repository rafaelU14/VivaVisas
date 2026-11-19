import { generateDailyTimeSlots } from '../services/availabilityService.js';
import * as appointmentRepository from '../repositories/appointmentRepository.js';

export async function getAvailability(req, res) {
  try {
    const { fecha, duracion, asesorId } = req.query;

    if (!fecha) {
      return res.status(400).json({
        error: 'El parámetro de consulta "fecha" es obligatorio.',
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fecha.trim())) {
      return res.status(400).json({
        error: 'El formato de fecha es inválido. Debe ser YYYY-MM-DD.',
      });
    }

    const [year, month, day] = fecha.split('-').map(Number);
    const parsedDate = new Date(year, month - 1, day);
    if (
      parsedDate.getFullYear() !== year ||
      parsedDate.getMonth() !== month - 1 ||
      parsedDate.getDate() !== day
    ) {
      return res.status(400).json({
        error: 'La fecha proporcionada no es una fecha válida en el calendario.',
      });
    }

    const parsedDuration = duracion ? Number(duracion) : 60;
    const existingAppointments = await appointmentRepository.getAppointmentsByDate(fecha, asesorId);

    const availableSlots = generateDailyTimeSlots({
      dateString: fecha,
      slotDuration: isNaN(parsedDuration) ? 60 : parsedDuration,
      existingAppointments,
      currentTime: new Date(),
    });

    return res.status(200).json({
      fecha,
      total_disponibles: availableSlots.length,
      slots: availableSlots,
    });
  } catch (error) {
    console.error('Error in getAvailability:', error);
    return res.status(500).json({
      error: 'Error interno del servidor al consultar disponibilidad.',
    });
  }
}