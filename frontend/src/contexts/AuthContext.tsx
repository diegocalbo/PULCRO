import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, LoginRequest, LoginResponse } from '../services/api';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  userLevel: string;
  username: string;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userLevel, setUserLevel] = useState('user');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const level = localStorage.getItem('user_level');
    const storedUsername = localStorage.getItem('username');
    
    if (token && level && storedUsername) {
      setIsAuthenticated(true);
      setUserLevel(level);
      setUsername(storedUsername);
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      const response: LoginResponse = await authAPI.login(credentials);
      
      // Store authentication data
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user_level', response.user_level);
      localStorage.setItem('username', response.username);
      
      setIsAuthenticated(true);
      setUserLevel(response.user_level);
      setUsername(response.username);
      
      toast.success(`¡Bienvenido, ${response.username}!`);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error de autenticación. Verifique sus credenciales.');
      return false;
    }
  };

  const logout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setUserLevel('user');
    setUsername('');
    toast.info('Sesión cerrada correctamente');
  };

  const isAdmin = () => userLevel === 'admin';

  const value: AuthContextType = {
    isAuthenticated,
    userLevel,
    username,
    login,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
