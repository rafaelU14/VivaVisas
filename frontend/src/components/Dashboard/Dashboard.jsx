import { useAuth } from '../../../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Panel de Administración</h1>
      <p>Bienvenido, <strong>{user?.nombre || user?.email}</strong></p>
      
      {/* Botón que ejecuta el logout y limpia la caché de TanStack Query */}
      <button
        onClick={logout}
        style={{
          padding: '10px 20px',
          backgroundColor: '#d91e36',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}