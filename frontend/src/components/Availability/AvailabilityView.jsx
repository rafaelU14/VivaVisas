import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './AvailabilityView.css';

export default function AvailabilityView() {
  const { token } = useAuth();
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );
  const [duration, setDuration] = useState('60');
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAvailability() {
      setIsLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({
          fecha: selectedDate,
          duracion: duration,
        });
        const response = await fetch(
          `http://localhost:4000/api/citas/disponibilidad?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.error || 'No se pudo consultar la disponibilidad.'
          );
        }
        setSlots(data.slots || []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (selectedDate) {
      fetchAvailability();
    }
    return () => controller.abort();
  }, [token, selectedDate, duration]);

  return (
    <section className="panel-card">
      <div className="panel-header">
        <h2 className="panel-title">Disponibilidad de Horarios</h2>

        <div className="availability-controls">
          <input
            type="date"
            className="availability-field"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <select
            className="availability-field"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="30">30 minutos</option>
            <option value="60">60 minutos</option>
            <option value="90">90 minutos</option>
          </select>
        </div>
      </div>

      {error && <div className="panel-error">{error}</div>}

      {isLoading ? (
        <p className="panel-empty">Consultando horarios disponibles...</p>
      ) : slots.length === 0 ? (
        <p className="panel-empty">
          No hay horarios disponibles para la fecha seleccionada.
        </p>
      ) : (
        <div className="slots-grid">
          {slots.map((slot, index) => (
            <div key={`${slot.start || slot}-${index}`} className="slot-item">
              {slot.label ||
                (slot.start && slot.end
                  ? `${slot.start} - ${slot.end}`
                  : String(slot))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
