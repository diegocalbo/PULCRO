import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LogOut, User, Shield, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Header: React.FC = () => {
  const { username, userLevel, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src="/images/logo.jpg" 
                  alt="PULCRO" 
                  className="h-10 w-10 rounded-full shadow-md"
                />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PULCRO</h1>
                <p className="text-sm text-gray-500">Gestión de Servicios de Limpieza</p>
              </div>
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">{username}</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {isAdmin() ? (
                    <Badge variant="default" className="text-xs bg-blue-600 hover:bg-blue-700">
                      <Shield className="h-3 w-3 mr-1" />
                      Administrador
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <User className="h-3 w-3 mr-1" />
                      Usuario
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
