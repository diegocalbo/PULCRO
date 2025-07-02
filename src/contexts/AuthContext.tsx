import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthUser } from '@/types';
import { storageService } from '@/services/localStorage';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Initialize data on first load
    storageService.initializeData();
    
    // Check if user is already logged in
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser({
        id: currentUser.id,
        username: currentUser.username,
        nivel: currentUser.nivel,
        nombre: currentUser.nombre
      });
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const users = storageService.getUsers();
      const foundUser = users.find(u => u.username === username && u.password === password);
      
      if (foundUser) {
        const authUser: AuthUser = {
          id: foundUser.id,
          username: foundUser.username,
          nivel: foundUser.nivel,
          nombre: foundUser.nombre
        };
        
        setUser(authUser);
        storageService.setCurrentUser(foundUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = (): void => {
    setUser(null);
    storageService.setCurrentUser(null);
  };

  const isAdmin = (): boolean => {
    return user?.nivel === 'admin';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
