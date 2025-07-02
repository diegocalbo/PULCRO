import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  UserCog, 
  Settings, 
  FileText, 
  LogOut,
  Menu,
  X,
  Wrench
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Panel principal'
  },
  {
    name: 'Clientes',
    href: '/clientes',
    icon: Users,
    description: 'Gestión de clientes'
  },
  {
    name: 'Servicios',
    href: '/servicios',
    icon: Calendar,
    description: 'Programación de servicios'
  },
  {
    name: 'Equipos',
    href: '/equipos',
    icon: UserCog,
    description: 'Equipos de trabajo'
  },
  {
    name: 'Tipos de Servicio',
    href: '/tipos-servicio',
    icon: Wrench,
    description: 'Catálogo de servicios'
  },
  {
    name: 'Reportes',
    href: '/reportes',
    icon: FileText,
    description: 'Informes y reportes'
  }
];

const adminNavItems = [
  {
    name: 'Usuarios',
    href: '/usuarios',
    icon: Settings,
    description: 'Gestión de usuarios'
  }
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const allNavItems = isAdmin() ? [...navItems, ...adminNavItems] : navItems;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed z-50 h-full w-64 bg-blue-900 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 bg-blue-800">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                <Wrench className="w-5 h-5 text-blue-800" />
              </div>
              <h1 className="text-xl font-bold text-white">PULCRO</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User info */}
          <div className="px-4 py-4 bg-blue-800 border-b border-blue-700">
            <div className="text-white">
              <p className="text-sm font-medium">{user?.nombre || user?.username}</p>
              <p className="text-xs text-blue-200 capitalize">{user?.nivel}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = isCurrentPath(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-blue-200">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-blue-700">
            <Button
              onClick={logout}
              variant="ghost"
              className="w-full justify-start text-blue-100 hover:bg-blue-800 hover:text-white"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="ml-4 lg:ml-0">
                <h2 className="text-lg font-semibold text-gray-800">
                  Sistema de Gestión de Servicios de Limpieza
                </h2>
                <p className="text-sm text-gray-500">
                  Gestión profesional de limpieza de campanas extractoras
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user?.nombre || user?.username}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.nivel}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
