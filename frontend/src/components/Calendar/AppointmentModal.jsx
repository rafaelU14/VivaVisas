import React, { useState, useEffect } from 'react';

const SERVICE_FEES = {
  'Visa B1/B2 Turismo': '$185 USD',
  'Renovación Visa F-1 Estudiante': '$160 USD',
  'Asesoría Residencia Permanente': '$250 USD',
  'Trámite Visa de Trabajo H-1B': '$460 USD',
};

export default function AppointmentModal({
  isOpen,
  onClose,
  appointment,
  newDate,
  onStatusChange,
  onCreateAppointment,
  onReschedule,
}) {
  const isCreateMode = !appointment && !!newDate;
  const [isRescheduling, setIsRescheduling] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    service: 'Visa B1/B2 Turismo',
    applicants: 1,
    modality: 'Presencial',
    location: 'Oficina Central — Viva Visas Reforma',
    estimatedFee: '$185 USD',
    date: '',
    time: '10:00',
    notes: '',
  });

  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleModalClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (newDate) {
      const datePart = newDate.includes('T') ? newDate.split('T')[0] : newDate;
      const timePart = newDate.includes('T') ? newDate.split('T')[1].substring(0, 5) : '10:00';
      setFormData({
        clientName: '',
        service: 'Visa B1/B2 Turismo',
        applicants: 1,
        modality: 'Presencial',
        location: 'Oficina Central — Viva Visas Reforma',
        estimatedFee: '$185 USD',
        date: datePart,
        time: timePart,
        notes: '',
      });
    }
    setIsRescheduling(false);
  }, [newDate, isOpen]);

  useEffect(() => {
    if (appointment) {
      const d = new Date(appointment.start);
      const datePart = d.toISOString().split('T')[0];
      const timePart = d.toTimeString().substring(0, 5);
      setRescheduleData({ date: datePart, time: timePart });
      setIsRescheduling(false);
    }
  }, [appointment]);

  if (!isOpen) return null;

  const handleModalClose = () => {
    setIsRescheduling(false);
    onClose();
  };

  const handleServiceChange = (serviceName) => {
    setFormData((prev) => ({
      ...prev,
      service: serviceName,
      estimatedFee: SERVICE_FEES[serviceName] || '$100 USD',
    }));
  };

  const handleModalityChange = (modality) => {
    const defaultLocation =
      modality === 'En línea'
        ? 'https://meet.google.com/viv-visas-asesoria'
        : 'Oficina Central — Viva Visas Reforma';
    setFormData((prev) => ({
      ...prev,
      modality,
      location: defaultLocation,
    }));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName.trim()) {
      alert('Por favor, ingresa el nombre del cliente.');
      return;
    }
    const startDateTime = `${formData.date}T${formData.time}:00`;
    const [hours, minutes] = formData.time.split(':').map(Number);
    const endHour = String(hours + 1).padStart(2, '0');
    const endDateTime = `${formData.date}T${endHour}:${String(minutes).padStart(2, '0')}:00`;
    onCreateAppointment({
      id: String(Date.now()),
      clientName: formData.clientName.trim(),
      service: formData.service,
      applicants: Number(formData.applicants) || 1,
      modality: formData.modality,
      location: formData.location,
      estimatedFee: formData.estimatedFee,
      start: startDateTime,
      end: endDateTime,
      status: 'PROGRAMADA',
      notes: formData.notes.trim() || 'Sin notas adicionales.',
    });
    handleModalClose();
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    const newStart = `${rescheduleData.date}T${rescheduleData.time}:00`;
    const [hours, minutes] = rescheduleData.time.split(':').map(Number);
    const endHour = String(hours + 1).padStart(2, '0');
    const newEnd = `${rescheduleData.date}T${endHour}:${String(minutes).padStart(2, '0')}:00`;
    onReschedule(appointment.id, newStart, newEnd);
    handleModalClose();
  };

  const handleCancelWithConfirmation = () => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas cancelar la cita de ${appointment.clientName}?`
    );
    if (confirmed) {
      onStatusChange(appointment.id, 'CANCELADA');
      handleModalClose();
    }
  };

  const statusStyles = {
    PROGRAMADA: { bg: '#dbeafe', color: '#1e40af', label: 'Programada' },
    COMPLETADA: { bg: '#dcfce7', color: '#166534', label: 'Completada' },
    CANCELADA: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelada' },
  };


 return (
    /* Cierre al hacer clic en el exterior (backdrop) */
    <div style={overlayStyle} onClick={handleModalClose}>
      {/* stopPropagation evita que hacer clic dentro del modal lo cierre */}
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>
            {isCreateMode
              ? 'Agendar Nueva Cita'
              : isRescheduling
              ? 'Reprogramar Cita'
              : 'Detalle del Trámite'}
          </h3>
          <button onClick={handleModalClose} style={closeBtnStyle}>✕</button>
        </div>
        {/* MODO 1: FORMULARIO DE CREACIÓN */}
        {isCreateMode ? (
          <form onSubmit={handleCreateSubmit} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Cliente *</label>
              <input
                type="text"
                placeholder="Nombre completo del cliente"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
                style={inputStyle}
                autoFocus
              />
            </div>
            <div>
              <label style={labelStyle}>Servicio Consular *</label>
              <select
                value={formData.service}
                onChange={(e) => handleServiceChange(e.target.value)}
                style={inputStyle}
              >
                {Object.keys(SERVICE_FEES).map((serviceName) => (
                  <option key={serviceName} value={serviceName}>{serviceName}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={labelStyle}>Nº de Solicitantes</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.applicants}
                  onChange={(e) => setFormData({ ...formData, applicants: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Modalidad *</label>
                <select
                  value={formData.modality}
                  onChange={(e) => handleModalityChange(e.target.value)}
                  style={inputStyle}
                >
                  <option value="Presencial">Presencial</option>
                  <option value="En línea">En línea (Virtual)</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={labelStyle}>Monto Estimado</label>
                <input
                  type="text"
                  value={formData.estimatedFee}
                  onChange={(e) => setFormData({ ...formData, estimatedFee: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Hora de Inicio</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>
                {formData.modality === 'En línea' ? 'Enlace de Videollamada' : 'Ubicación / Sucursal'}
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Notas adicionales</label>
              <textarea
                placeholder="Documentos requeridos, requisitos especiales..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            <div style={actionsStyle}>
              <button
                type="button"
                onClick={handleModalClose}
                style={{ ...btnStyle, backgroundColor: '#f1f5f9', color: '#475569' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{ ...btnStyle, backgroundColor: '#d91e36', color: '#ffffff' }}
              >
                Agendar Cita
              </button>
            </div>
          </form>
        ) : isRescheduling ? (
          /* MODO 2: REPROGRAMAR FECHA/HORA */
          <form onSubmit={handleRescheduleSubmit} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
              Modifica la fecha y hora para la cita de <strong>{appointment.clientName}</strong>:
            </p>
            <div>
              <label style={labelStyle}>Nueva Fecha</label>
              <input
                type="date"
                value={rescheduleData.date}
                onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Nueva Hora</label>
              <input
                type="time"
                value={rescheduleData.time}
                onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            <div style={actionsStyle}>
              <button
                type="button"
                onClick={() => setIsRescheduling(false)}
                style={{ ...btnStyle, backgroundColor: '#f1f5f9', color: '#475569' }}
              >
                Volver
              </button>
              <button
                type="submit"
                style={{ ...btnStyle, backgroundColor: '#2563eb', color: '#ffffff' }}
              >
                Confirmar Reprogramación
              </button>
            </div>
          </form>
        ) : (
          /* MODO 3: RESUMEN COMPLETO DE CITA EXISTENTE */
          appointment && (
            <div>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={labelStyle}>Cliente</span>
                    <p style={{ ...valueStyle, fontSize: '1.1rem', fontWeight: '600' }}>
                      {appointment.clientName}
                    </p>
                  </div>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      backgroundColor: (statusStyles[appointment.status] || statusStyles.PROGRAMADA).bg,
                      color: (statusStyles[appointment.status] || statusStyles.PROGRAMADA).color,
                    }}
                  >
                    {(statusStyles[appointment.status] || statusStyles.PROGRAMADA).label}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <span style={labelStyle}>Servicio Consular</span>
                    <p style={valueStyle}>{appointment.service}</p>
                  </div>
                  <div>
                    <span style={labelStyle}>Aplicantes</span>
                    <p style={valueStyle}>{appointment.applicants || 1} persona(s)</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <span style={labelStyle}>Modalidad</span>
                    <p style={valueStyle}>{appointment.modality || 'Presencial'}</p>
                  </div>
                  <div>
                    <span style={labelStyle}>Monto Estimado</span>
                    <p style={{ ...valueStyle, color: '#16a34a', fontWeight: '600' }}>
                      {appointment.estimatedFee || '$185 USD'}
                    </p>
                  </div>
                </div>
                <div>
                  <span style={labelStyle}>
                    {appointment.modality === 'En línea' ? 'Enlace de la sesión' : 'Ubicación'}
                  </span>
                  {appointment.location?.startsWith('http') ? (
                    <a
                      href={appointment.location}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.9rem', color: '#2563eb', wordBreak: 'break-all' }}
                    >
                      {appointment.location}
                    </a>
                  ) : (
                    <p style={valueStyle}>{appointment.location || 'Oficina Principal'}</p>
                  )}
                </div>
                <div>
                  <span style={labelStyle}>Fecha y Hora</span>
                  <p style={valueStyle}>
                    {new Date(appointment.start).toLocaleString('es-MX', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                {appointment.notes && (
                  <div>
                    <span style={labelStyle}>Notas</span>
                    <p style={{ ...valueStyle, fontSize: '0.85rem', color: '#64748b' }}>
                      {appointment.notes}
                    </p>
                  </div>
                )}
              </div>
              {/* Botones de acción directa */}
              <div style={actionsStyle}>
                {appointment.status !== 'CANCELADA' && (
                  <button
                    onClick={handleCancelWithConfirmation}
                    style={{ ...btnStyle, backgroundColor: '#dc2626', color: '#ffffff' }}
                  >
                    Cancelar Cita
                  </button>
                )}
                {appointment.status === 'PROGRAMADA' && (
                  <>
                    <button
                      onClick={() => setIsRescheduling(true)}
                      style={{ ...btnStyle, backgroundColor: '#2563eb', color: '#ffffff' }}
                    >
                      Reprogramar
                    </button>
                    <button
                      onClick={() => {
                        onStatusChange(appointment.id, 'COMPLETADA');
                        handleModalClose();
                      }}
                      style={{ ...btnStyle, backgroundColor: '#16a34a', color: '#ffffff' }}
                    >
                      Completar
                    </button>
                  </>
                )}
                <button
                  onClick={handleModalClose}
                  style={{ ...btnStyle, backgroundColor: '#f1f5f9', color: '#475569' }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(15, 23, 42, 0.55)',
  backdropFilter: 'blur(3px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: '16px',
  boxSizing: 'border-box',
};
const modalStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '500px',
  maxHeight: '90vh',
  overflowY: 'auto',
  padding: '24px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #e2e8f0',
  paddingBottom: '12px',
};
const closeBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1.2rem',
  cursor: 'pointer',
  color: '#64748b',
};
const labelStyle = {
  display: 'block',
  fontSize: '0.72rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  color: '#64748b',
  letterSpacing: '0.04em',
  marginBottom: '3px',
};
const valueStyle = {
  margin: '2px 0 0 0',
  fontSize: '0.92rem',
  fontWeight: '500',
  color: '#1e293b',
};
const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};
const actionsStyle = {
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  borderTop: '1px solid #e2e8f0',
  paddingTop: '16px',
  flexWrap: 'wrap',
};
const btnStyle = {
  padding: '8px 14px',
  borderRadius: '6px',
  border: 'none',
  fontSize: '0.85rem',
  fontWeight: '600',
  cursor: 'pointer',
};