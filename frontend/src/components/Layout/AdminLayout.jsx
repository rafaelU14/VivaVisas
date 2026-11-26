import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { to: '/dashboard', label: 'Citas' },
    { to: '/clientes', label: 'Clientes' },
    { to: '/disponibilidad', label: 'Disponibilidad' },
  ];

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-primary">Viva</span>
          <span className="brand-accent">Viajes</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="admin-main">
        <header className="admin-header">
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label="Abrir menú"
          >
            ☰
          </button>

          <div className="header-profile">
            <div className="profile-info">
              <span className="profile-name">
                {user?.nombre || user?.email}
              </span>
              {user?.role && (
                <span className="profile-role">{user.role}</span>
              )}
            </div>
            <button type="button" className="logout-button" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
