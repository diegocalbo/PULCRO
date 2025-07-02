import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Navigation from './Navigation';
import Dashboard from '../pages/Dashboard';
import Clientes from '../pages/Clientes';
import Servicios from '../pages/Servicios';
import TiposServicio from '../pages/TiposServicio';
import Equipos from '../pages/Equipos';
import Usuarios from '../pages/Usuarios';
import Reportes from '../pages/Reportes';

const Layout: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Navigation />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/tipos-servicio" element={<TiposServicio />} />
            <Route path="/equipos" element={<Equipos />} />
            {isAdmin() && <Route path="/usuarios" element={<Usuarios />} />}
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Layout;
