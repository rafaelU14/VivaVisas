import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './ClientsView.css';

export default function ClientsView() {
  const { token } = useAuth();
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchClients() {
      setIsLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ page: '1', limit: '20' });
        if (search.trim()) {
          params.set('search', search.trim());
        }
        const response = await fetch(
          `http://localhost:4000/api/clientes?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'No se pudieron cargar los clientes.');
        }
        setClients(data.data || data.clients || []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchClients();
    return () => controller.abort();
  }, [token, search]);

  return (
    <section className="panel-card">
      <div className="panel-header">
        <h2 className="panel-title">Gestión de Clientes</h2>
        <input
          type="search"
          className="panel-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, correo o identificación..."
        />
      </div>

      {error && <div className="panel-error">{error}</div>}

      {isLoading ? (
        <p className="panel-empty">Cargando clientes...</p>
      ) : clients.length === 0 ? (
        <p className="panel-empty">No se encontraron clientes registrados.</p>
      ) : (
        <div className="table-wrapper">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Nombre completo</th>
                <th>Identificación</th>
                <th>Teléfono</th>
                <th>Correo electrónico</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="client-name">
                    {client.nombres} {client.apellidos}
                  </td>
                  <td>{client.identificacion || '—'}</td>
                  <td>{client.telefono}</td>
                  <td>{client.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
