import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="modern-login-container">
        <div className="login-container" style={{ maxWidth: '400px', minHeight: '300px' }}>
          <div className="form-panel" style={{ padding: '60px 40px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '3rem', 
                color: '#6366f1', 
                marginBottom: '20px',
                animation: 'spin 1s linear infinite'
              }}>
                <i className="bi bi-arrow-repeat"></i>
              </div>
              <h2 style={{ color: '#0f172a', marginBottom: '10px' }}>Verificando sesión...</h2>
              <p style={{ color: '#64748b' }}>Por favor espera un momento</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si requiere autenticación pero no está autenticado, redirigir al login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si no requiere autenticación pero está autenticado (como login/register), redirigir al dashboard
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;