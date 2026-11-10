import { useAuth } from '../../../context/AuthContext';
import CalendarView from '../Calendar/CalendarView';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '24px 16px' }}>
      <header
        style={{
          maxWidth: '1200px',
          margin: '0 auto 24px auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          padding: '16px 24px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a' }}>
            Agenda de Citas — Viva Viajes
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
            Asesor: <strong>{user?.nombre || user?.email}</strong>
          </p>
        </div>

        <button
          onClick={logout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#d91e36',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem',
          }}
        >
          Cerrar sesión
        </button>
      </header>

      <main>
        <CalendarView />
      </main>
    </div>
  );
}