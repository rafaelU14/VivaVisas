import React, { useState, useEffect } from 'react';

export default function AppointmentModal({
  isOpen,
  onClose,
  appointment,
  newDate,
  onStatusChange,
  onCreateAppointment,
}) {
  const isCreateMode = !appointment && !!newDate;

  // Estado del formulario para agendar nueva cita
  const [formData, setFormData] = useState({
    clientName: '',
    service: 'Visa B1/B2 Turismo',
    date: '',
    time: '10:00',
    notes: '',
  });

  useEffect(() => {
    if (newDate) {
      const datePart = newDate.includes('T') ? newDate.split('T')[0] : newDate;
      const timePart = newDate.includes('T') ? newDate.split('T')[1].substring(0, 5) : '10:00';
      setFormData({
        clientName: '',
        service: 'Visa B1/B2 Turismo',
        date: datePart,
        time: timePart,
        notes: '',
      });
    }
  }, [newDate]);

  if (!isOpen) return null;

  const statusStyles = {
    PROGRAMADA: { bg: '#dbeafe', color: '#1e40af', label: 'Programada' },
    COMPLETADA: { bg: '#dcfce7', color: '#166534', label: 'Completada' },
    CANCELADA: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelada' },
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName.trim()) {
      alert('Por favor, ingresa el nombre del cliente.');
      return;
    }

    const startDateTime = `${formData.date}T${formData.time}:00`;
    // Calcular hora de fin (1 hora después por defecto)
    const [hours, minutes] = formData.time.split(':').map(Number);
    const endHour = String(hours + 1).padStart(2, '0');
    const endDateTime = `${formData.date}T${endHour}:${String(minutes).padStart(2, '0')}:00`;

    onCreateAppointment({
      id: String(Date.now()),
      clientName: formData.clientName.trim(),
      service: formData.service,
      start: startDateTime,
      end: endDateTime,
      status: 'PROGRAMADA',
      notes: formData.notes.trim() || 'Cita agendada desde el calendario.',
    });

    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>
            {isCreateMode ? 'Agendar Nueva Cita' : 'Detalle de la Cita'}
          </h3>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {isCreateMode ? (
          /* FORMULARIO PARA CREAR CITA */
          <form onSubmit={handleCreateSubmit} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Nombre del Cliente *</label>
              <input
                type="text"
                placeholder="Ej. Juan Pérez"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
                style={inputStyle}
                autoFocus
              />
            </div>

            <div>
              <label style={labelStyle}>Trámite / Tipo de Visa *</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                style={inputStyle}
              >
                <option value="Visa B1/B2 Turismo">Visa B1/B2 Turismo</option>
                <option value="Renovación Visa F-1 Estudiante">Renovación Visa F-1 Estudiante</option>
                <option value="Asesoría Residencia Permanente">Asesoría Residencia Permanente</option>
                <option value="Trámite Visa de Trabajo H-1B">Trámite Visa de Trabajo H-1B</option>
                <option value="Consulta General Migratoria">Consulta General Migratoria</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Fecha</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ width: '120px' }}>
                <label style={labelStyle}>Hora</label>
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
              <label style={labelStyle}>Notas adicionales (Opcional)</label>
              <textarea
                placeholder="Detalles sobre documentos o caso..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <div style={actionsStyle}>
              <button
                type="button"
                onClick={onClose}
                style={{ ...btnStyle, backgroundColor: '#f1f5f9', color: '#475569' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{ ...btnStyle, backgroundColor: '#d91e36', color: '#fff' }}
              >
                Guardar Cita
              </button>
            </div>
          </form>
        ) : (
          /* DETALLE DE CITA EXISTENTE */
          appointment && (
            <div>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <span style={labelStyle}>Cliente:</span>
                  <p style={valueStyle}>{appointment.clientName}</p>
                </div>

                <div>
                  <span style={labelStyle}>Trámite / Servicio:</span>
                  <p style={valueStyle}>{appointment.service}</p>
                </div>

                <div>
                  <span style={labelStyle}>Fecha y Hora:</span>
                  <p style={valueStyle}>
                    {new Date(appointment.start).toLocaleString('es-MX', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>

                <div>
                  <span style={labelStyle}>Estado:</span>
                  <div>
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: '4px',
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
                </div>

                {appointment.notes && (
                  <div>
                    <span style={labelStyle}>Notas adicionales:</span>
                    <p style={{ ...valueStyle, fontSize: '0.875rem', color: '#64748b' }}>
                      {appointment.notes}
                    </p>
                  </div>
                )}
              </div>

              <div style={actionsStyle}>
                {appointment.status !== 'CANCELADA' && (
                  <button
                    onClick={() => onStatusChange(appointment.id, 'CANCELADA')}
                    style={{ ...btnStyle, backgroundColor: '#dc2626', color: '#fff' }}
                  >
                    Cancelar Cita
                  </button>
                )}

                {appointment.status === 'PROGRAMADA' && (
                  <button
                    onClick={() => onStatusChange(appointment.id, 'COMPLETADA')}
                    style={{ ...btnStyle, backgroundColor: '#16a34a', color: '#fff' }}
                  >
                    Marcar Completada
                  </button>
                )}

                <button
                  onClick={onClose}
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
  backgroundColor: 'rgba(0, 0, 0, 0.45)',
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
  maxWidth: '480px',
  padding: '24px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
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
  fontSize: '0.75rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  color: '#64748b',
  letterSpacing: '0.05em',
  marginBottom: '4px',
};

const valueStyle = {
  margin: '2px 0 0 0',
  fontSize: '0.95rem',
  fontWeight: '500',
  color: '#1e293b',
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const actionsStyle = {
  marginTop: '24px',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  borderTop: '1px solid #e2e8f0',
  paddingTop: '16px',
  flexWrap: 'wrap',
};

const btnStyle = {
  padding: '8px 14px',
  borderRadius: '6px',
  border: 'none',
  fontSize: '0.875rem',
  fontWeight: '600',
  cursor: 'pointer',
};
