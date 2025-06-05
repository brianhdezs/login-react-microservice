import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/auth.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [validationSummary, setValidationSummary] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.userName.trim()) {
      newErrors.userName = 'El nombre de usuario es requerido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationSummary('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const result = await login({
        userName: formData.userName,
        password: formData.password
      });
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setValidationSummary(result.message || 'Error en el inicio de sesión');
      }
    } catch (error) {
      setValidationSummary('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-login-container">
      <div className="login-container">
        <div className="brand-panel">
          <div className="brand-content">
            <div className="company-logo">
              <i className="bi bi-gem"></i>
            </div>
            <h2 className="brand-title">EliteShop</h2>
            <p className="brand-subtitle">
              Descubre productos exclusivos y vive una experiencia de compra única
            </p>
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="bi bi-award"></i>
                </div>
                <span>Productos Premium</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="bi bi-truck"></i>
                </div>
                <span>Envío Express</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="bi bi-headset"></i>
                </div>
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-panel">
          <div className="form-header">
            <h1 className="form-title">Bienvenido</h1>
            <p className="form-description">Inicia sesión para acceder a tu cuenta premium</p>
          </div>

          <form onSubmit={handleSubmit}>
            {validationSummary && (
              <div className="validation-summary">
                {validationSummary}
              </div>
            )}

            <div className="input-group">
              <label htmlFor="userName" className="input-label">Usuario</label>
              <input
                id="userName"
                name="userName"
                type="text"
                className="input-field"
                placeholder="Ingresa tu nombre de usuario"
                value={formData.userName}
                onChange={handleInputChange}
              />
              <i className="bi bi-person-badge field-icon"></i>
              {errors.userName && <span className="text-danger">{errors.userName}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input-field"
                placeholder="Ingresa tu contraseña segura"
                value={formData.password}
                onChange={handleInputChange}
              />
              <i className="bi bi-key field-icon"></i>
              {errors.password && <span className="text-danger">{errors.password}</span>}
            </div>

            <div className="form-controls">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <div className="custom-checkbox"></div>
                <label htmlFor="rememberMe" className="checkbox-label">Recordar mi sesión</label>
              </div>
              <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              <i className="bi bi-arrow-right-square"></i>
              {loading ? 'Accediendo...' : 'Acceder Ahora'}
            </button>

            <div className="security-info">
              <i className="bi bi-shield-check"></i>
              <span>Conexión protegida con SSL de 256 bits</span>
            </div>
          </form>

          <div className="divider">
            <span>¿Primera vez aquí?</span>
          </div>

          <div className="register-section">
            <p>Únete a nuestra comunidad premium. <Link to="/register">Crear cuenta gratuita</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;