import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Estilos globales
import './styles/auth.css';
import './styles/layout.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Página de inicio */}
            <Route path="/" element={<Home />} />
            
            {/* Rutas de autenticación */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas protegidas */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Páginas adicionales (puedes agregar más después) */}
            <Route path="/profile" element={<Dashboard />} />
            <Route path="/orders" element={<Dashboard />} />
            <Route path="/wishlist" element={<Dashboard />} />
            <Route path="/settings" element={<Dashboard />} />
            <Route path="/privacy" element={<Home />} />
            
            {/* Redirigir rutas no encontradas al inicio */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;