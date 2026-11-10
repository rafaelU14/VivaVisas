import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/react/daygrid';
import timeGridPlugin from '@fullcalendar/react/timegrid';
import interactionPlugin from '@fullcalendar/react/interaction';
import esLocale from '@fullcalendar/react/locales/es';
import classicThemePlugin from '@fullcalendar/react/themes/classic';

import '@fullcalendar/react/skeleton.css';
import '@fullcalendar/react/themes/classic/theme.css';
import '@fullcalendar/react/themes/classic/palette.css';
import AppointmentModal from './AppointmentModal';
import './CalendarView.css';

const STATUS_COLORS = {
  PROGRAMADA: '#2563eb', // Azul
  COMPLETADA: '#16a34a', // Verde
  CANCELADA: '#dc2626',  // Rojo
};

const INITIAL_APPOINTMENTS = [
  {
    id: '1',
    clientName: 'Carlos Mendoza',
    service: 'Visa B1/B2 Turismo',
    applicants: 1,
    modality: 'Presencial',
    estimatedFee: '$185 USD',
    location: 'Oficina Central — Viva Visas Reforma',
    start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    status: 'PROGRAMADA',
    notes: 'Revisión preliminar de formulario DS-160.',
  },
  {
    id: '2',
    clientName: 'María Fernanda Gómez',
    service: 'Renovación Visa F-1 Estudiante',
    applicants: 2,
    modality: 'En línea',
    estimatedFee: '$320 USD',
    location: 'https://meet.google.com/viv-visas-asesoria',
    start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().replace(/T.*$/, 'T12:00:00'),
    end: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().replace(/T.*$/, 'T13:00:00'),
    status: 'PROGRAMADA',
    notes: 'Trae I-20 actualizado.',
  },
  {
    id: '3',
    clientName: 'Alejandro Ruiz',
    service: 'Asesoría Residencia Permanente',
    applicants: 1,
    modality: 'Presencial',
    estimatedFee: '$250 USD',
    location: 'Oficina Central — Viva Visas Reforma',
    start: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().replace(/T.*$/, 'T15:00:00'),
    end: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().replace(/T.*$/, 'T16:00:00'),
    status: 'COMPLETADA',
    notes: 'Documentación entregada completa.',
  },
  {
    id: '4',
    clientName: 'Sofía Valenzuela',
    service: 'Trámite Visa de Trabajo H-1B',
    applicants: 1,
    modality: 'En línea',
    estimatedFee: '$460 USD',
    location: 'https://meet.google.com/viv-visas-asesoria',
    start: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().replace(/T.*$/, 'T09:00:00'),
    end: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().replace(/T.*$/, 'T10:00:00'),
    status: 'CANCELADA',
    notes: 'Cancelada por el cliente por motivos de viaje.',
  },
];

export default function CalendarView() {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const events = appointments.map((apt) => ({
    id: apt.id,
    title: `${apt.clientName} - ${apt.service}`,
    start: apt.start,
    end: apt.end,
    backgroundColor: STATUS_COLORS[apt.status] || STATUS_COLORS.PROGRAMADA,
    borderColor: STATUS_COLORS[apt.status] || STATUS_COLORS.PROGRAMADA,
    extendedProps: apt,
  }));

  // Clic en una cita existente -> Abre modal en modo "Detalle"
  const handleEventClick = (info) => {
    setSelectedAppointment(info.event.extendedProps);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  // Clic en franja o día vacío -> Abre modal en modo "Agendar Nueva Cita"
  const handleDateClick = (info) => {
    setSelectedAppointment(null);
    setSelectedDate(info.dateStr);
    setIsModalOpen(true);
  };

  const handleCreateAppointment = (newApt) => {
    setAppointments((prev) => [...prev, newApt]);
  };

  const handleStatusChange = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
    setSelectedAppointment((prev) => (prev ? { ...prev, status: newStatus } : null));
    setIsModalOpen(false);
  };

  const handleReschedule = (id, newStart, newEnd) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, start: newStart, end: newEnd } : apt
      )
    );
  };

  return (
    <div className="calendar-container">

      <div className="calendar-legend">
        <span className="legend-item">
          <span className="legend-dot dot-programada"></span> Programada
        </span>
        <span className="legend-item">
          <span className="legend-dot dot-completada"></span> Completada
        </span>
        <span className="legend-item">
          <span className="legend-dot dot-cancelada"></span> Cancelada
        </span>
      </div>

      <div className="calendar-card">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, classicThemePlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
          }}
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
          }}
          locales={[esLocale]}
          locale="es"
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          editable={false}
          selectable={true}
          height="auto"
          dayMaxEvents={3}
        />
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedAppointment}
        newDate={selectedDate}
        onStatusChange={handleStatusChange}
        onCreateAppointment={handleCreateAppointment}
        onReschedule={handleReschedule}
      />
    </div>
  );
}