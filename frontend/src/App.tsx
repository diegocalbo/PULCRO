import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import './index.css';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  useEffect(() => {
    // Aggressive watermark removal
    const removeWatermarks = () => {
      // Remove any elements containing watermark text
      const watermarkTexts = ['Created by', 'MiniMax', 'Agent', 'watermark'];
      watermarkTexts.forEach(text => {
        const elements = Array.from(document.querySelectorAll('*')).filter(el => 
          el.textContent?.includes(text) && !el.closest('#root')
        );
        elements.forEach(el => el.remove());
      });

      // Remove fixed/absolute positioned elements not in root
      const suspiciousElements = document.querySelectorAll('body > div:not(#root)');
      suspiciousElements.forEach(el => el.remove());

      // Remove elements with suspicious positioning
      const positionedElements = document.querySelectorAll('[style*="position: fixed"], [style*="position: absolute"]');
      positionedElements.forEach(el => {
        if (!el.closest('#root')) {
          el.remove();
        }
      });
    };

    // Run immediately and then periodically
    removeWatermarks();
    const interval = setInterval(removeWatermarks, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
        <Toaster />
        <SonnerToaster position="top-right" richColors />
      </Router>
    </AuthProvider>
  );
}

export default App;
