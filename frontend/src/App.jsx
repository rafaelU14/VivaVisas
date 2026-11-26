import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from '../components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRouted';
import AdminLayout from './components/Layout/AdminLayout';
import Dashboard from './components/Dashboard/Dashboard';
import ClientsView from './components/Clients/ClientsView';
import AvailabilityView from './components/Availability/AvailabilityView';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<ClientsView />} />
            <Route path="/disponibilidad" element={<AvailabilityView />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
