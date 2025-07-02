import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Wrench,
  UserCheck,
  Settings,
  FileText,
  Building2
} from 'lucide-react';

const Navigation: React.FC = () => {
  const { isAdmin } = useAuth();

  const navigationItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Clientes',
      href: '/clientes',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Servicios',
      href: '/servicios',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      label: 'Tipos de Servicio',
      href: '/tipos-servicio',
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      label: 'Equipos',
      href: '/equipos',
      icon: UserCheck,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200'
    }
  ];

  // Add admin-only items
  if (isAdmin()) {
    navigationItems.push({
      label: 'Usuarios',
      href: '/usuarios',
      icon: Settings,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    });
  }

  navigationItems.push({
    label: 'Reportes',
    href: '/reportes',
    icon: FileText,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200'
  });

  return (
    <nav className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group',
                  'hover:shadow-sm border border-transparent',
                  isActive
                    ? `${item.bgColor} ${item.borderColor} ${item.color} shadow-sm`
                    : 'text-gray-700 hover:bg-gray-50 hover:border-gray-200'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    className={cn(
                      'h-5 w-5 transition-colors',
                      isActive ? item.color : 'text-gray-500 group-hover:text-gray-700'
                    )} 
                  />
                  <span className={cn(
                    'font-medium text-sm',
                    isActive ? 'font-semibold' : 'group-hover:text-gray-900'
                  )}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
          <Building2 className="h-4 w-4 mx-auto mb-1 text-gray-400" />
          <p className="font-medium">PULCRO v2.0</p>
          <p>Sistema de Gestión</p>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
