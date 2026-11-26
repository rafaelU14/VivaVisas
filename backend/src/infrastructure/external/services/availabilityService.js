const WORK_CONFIG = {
  startHour: 9,
  startMinute: 0,
  endHour: 17,
  endMinute: 0,
  defaultDurationMinutes: 60,
  workingDays: [1, 2, 3, 4, 5],
};

function formatTimeString(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function isOverlapping(slotStart, slotEnd, apptStart, apptEnd) {
  return slotStart < apptEnd && slotEnd > apptStart;
}

export function validateAppointmentConflict({
  start,
  end,
  existingAppointments = [],
  excludeAppointmentId = null,
  advisorId = null,
}) {
  const candidateStart = new Date(start);
  const candidateEnd = new Date(end);

  if (isNaN(candidateStart.getTime()) || isNaN(candidateEnd.getTime())) {
    throw new Error('Invalid start or end date');
  }

  if (candidateStart >= candidateEnd) {
    return {
      hasConflict: true,
      reason: 'INVALID_INTERVAL',
    };
  }

  const conflictingAppointment = existingAppointments.find((appt) => {
    if (excludeAppointmentId && (appt.id === excludeAppointmentId || appt._id === excludeAppointmentId)) {
      return false;
    }

    if (advisorId && appt.advisorId && appt.advisorId !== advisorId) {
      return false;
    }

    const status = appt.status || appt.estado;
    if (status !== 'PROGRAMADA' && status !== 'REPROGRAMADA') {
      return false;
    }

    const apptStart = new Date(appt.start || appt.hora_inicio || appt.fecha_inicio);
    const apptEnd = new Date(appt.end || appt.hora_fin || appt.fecha_fin);

    return isOverlapping(candidateStart, candidateEnd, apptStart, apptEnd);
  });

  return {
    hasConflict: Boolean(conflictingAppointment),
    conflictingAppointment: conflictingAppointment || null,
  };
}

export function generateDailyTimeSlots({
  dateString,
  slotDuration = WORK_CONFIG.defaultDurationMinutes,
  existingAppointments = [],
  currentTime = new Date(),
  config = WORK_CONFIG,
}) {
  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);

  const dayOfWeek = targetDate.getDay();
  if (!config.workingDays.includes(dayOfWeek)) {
    return [];
  }

  const workStartTime = new Date(year, month - 1, day, config.startHour, config.startMinute, 0, 0);
  const workEndTime = new Date(year, month - 1, day, config.endHour, config.endMinute, 0, 0);

  const activeAppointments = existingAppointments
    .filter((appt) => {
      const status = appt.status || appt.estado;
      return status === 'PROGRAMADA' || status === 'REPROGRAMADA';
    })
    .map((appt) => ({
      start: new Date(appt.start || appt.hora_inicio || appt.fecha_inicio),
      end: new Date(appt.end || appt.hora_fin || appt.fecha_fin),
    }));

  const availableSlots = [];
  let currentSlotStart = new Date(workStartTime);

  while (currentSlotStart < workEndTime) {
    const currentSlotEnd = new Date(currentSlotStart.getTime() + slotDuration * 60 * 1000);

    if (currentSlotEnd > workEndTime) {
      break;
    }

    if (currentSlotStart <= currentTime) {
      currentSlotStart = currentSlotEnd;
      continue;
    }

    const hasCollision = activeAppointments.some((appt) =>
      isOverlapping(currentSlotStart, currentSlotEnd, appt.start, appt.end)
    );

    if (!hasCollision) {
      availableSlots.push({
        hora_inicio: formatTimeString(currentSlotStart),
        hora_fin: formatTimeString(currentSlotEnd),
        inicio: currentSlotStart.toISOString(),
        fin: currentSlotEnd.toISOString(),
        duracion_minutos: slotDuration,
      });
    }

    currentSlotStart = currentSlotEnd;
  }

  return availableSlots;
}