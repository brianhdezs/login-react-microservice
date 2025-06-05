import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/auth.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [validationSummary, setValidationSummary] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    text: '',
    color: ''
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    console.log('Input change:', { name, value, type, checked }); // Debug
    
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

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    if (/[a-z]/.test(password)) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 20;
    if (/[^A-Za-z0-9]/.test(password)) score += 10;
    return Math.min(score, 100);
  };

  const updatePasswordStrength = (strength) => {
    let text, color;
    if (strength < 30) {
      text = 'Débil';
      color = '#ef4444';
    } else if (strength < 60) {
      text = 'Regular';
      color = '#f59e0b';
    } else if (strength < 80) {
      text = 'Buena';
      color = '#3b82f6';
    } else {
      text = 'Excelente';
      color = '#10b981';
    }
    return { score: strength, text, color };
  };

  useEffect(() => {
    if (formData.password) {
      const strength = calculatePasswordStrength(formData.password);
      setPasswordStrength(updatePasswordStrength(strength));
    } else {
      setPasswordStrength({ score: 0, text: '', color: '' });
    }
  }, [formData.password]);

  // Debug: mostrar el estado actual
  useEffect(() => {
    console.log('FormData updated:', formData);
    console.log('Terms accepted:', formData.termsAccepted);
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'El teléfono es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Debes aceptar los términos y condiciones';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationSummary('');
    
    console.log('Submit attempted with data:', formData); // Debug
    
    if (!validateForm()) {
      console.log('Validation failed:', errors);
      return;
    }

    setLoading(true);
    
    try {
      const result = await register({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Register result:', result); // Debug
      
      if (result.success) {
        setValidationSummary('');
        navigate('/login', { 
          state: { 
            message: 'Registro exitoso. Ahora puedes iniciar sesión.' 
          } 
        });
      } else {
        setValidationSummary(result.message || 'Error en el registro');
      }
    } catch (error) {
      console.error('Register error:', error);
      setValidationSummary('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Determinar si el botón debe estar habilitado
  const isButtonEnabled = formData.termsAccepted && !loading;

  return (
    <div className="modern-register-container">
      <div className="register-container">
        <div className="brand-panel">
          <div className="brand-content">
            <div className="company-logo">
              <i className="bi bi-person-plus-fill"></i>
            </div>
            <h2 className="brand-title">EliteShop</h2>
            <p className="brand-subtitle">
              Únete a nuestra comunidad premium y disfruta de beneficios exclusivos
            </p>
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="bi bi-star-fill"></i>
                </div>
                <span>Acceso VIP</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="bi bi-gift"></i>
                </div>
                <span>Ofertas Exclusivas</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="bi bi-crown"></i>
                </div>
                <span>Membresía Premium</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-panel">
          <div className="form-header">
            <h1 className="form-title">Crear Cuenta</h1>
            <p className="form-description">Completa los datos para unirte a nuestra plataforma premium</p>
          </div>

          <form onSubmit={handleSubmit} id="registerForm">
            {validationSummary && (
              <div className="validation-summary">
                {validationSummary}
              </div>
            )}

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="name" className="input-label">Nombre Completo</label>
                <div className="input-wrapper">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-input"
                    placeholder="Tu nombre completo"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <i className="bi bi-person input-icon"></i>
                </div>
                {errors.name && <span className="text-danger">{errors.name}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="phoneNumber" className="input-label">Teléfono</label>
                <div className="input-wrapper">
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    className="form-input"
                    placeholder="+52 123 456 7890"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                  <i className="bi bi-telephone input-icon"></i>
                </div>
                {errors.phoneNumber && <span className="text-danger">{errors.phoneNumber}</span>}
              </div>
            </div>

            <div className="input-group full-width">
              <label htmlFor="email" className="input-label">Correo Electrónico</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="correo@empresa.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <i className="bi bi-envelope input-icon"></i>
              </div>
              {errors.email && <span className="text-danger">{errors.email}</span>}
            </div>

            <div className="input-group full-width">
              <label htmlFor="password" className="input-label">Contraseña Segura</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <i className="bi bi-shield-lock input-icon"></i>
              </div>
              {formData.password && (
                <>
                  <div className="password-strength">
                    <div 
                      className="strength-bar" 
                      style={{
                        width: `${passwordStrength.score}%`,
                        background: passwordStrength.color
                      }}
                    ></div>
                  </div>
                  <div 
                    className="strength-text" 
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.text}
                  </div>
                </>
              )}
              {errors.password && <span className="text-danger">{errors.password}</span>}
            </div>

            <div className="terms-section">
              <div className="checkbox-container" onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  termsAccepted: !prev.termsAccepted
                }));
              }}>
                <input
                  type="checkbox"
                  id="termsAccept"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                />
                <div className={`custom-checkbox ${formData.termsAccepted ? 'checked' : ''}`}>
                  {formData.termsAccepted && '✓'}
                </div>
                <p className="terms-text">
                  Acepto los <a href="#" className="terms-link" onClick={(e) => e.stopPropagation()}>términos y condiciones</a> y la
                  <a href="#" className="terms-link" onClick={(e) => e.stopPropagation()}> política de privacidad</a> de la plataforma.
                </p>
              </div>
              {errors.termsAccepted && <span className="text-danger">{errors.termsAccepted}</span>}
            </div>

            <button 
              type="submit" 
              className={`submit-btn ${isButtonEnabled ? 'enabled' : 'disabled'}`}
              disabled={!isButtonEnabled}
              style={{
                opacity: isButtonEnabled ? 1 : 0.6,
                cursor: isButtonEnabled ? 'pointer' : 'not-allowed'
              }}
            >
              <i className="bi bi-check-circle"></i>
              {loading ? 'Creando Cuenta...' : 'Crear Mi Cuenta Premium'}
            </button>

            {/* Debug info - quitar en producción */}
            <div style={{ 
              fontSize: '12px', 
              color: '#666', 
              marginTop: '10px',
              display: process.env.NODE_ENV === 'development' ? 'block' : 'none'
            }}>
              Debug: Terms accepted: {formData.termsAccepted ? 'YES' : 'NO'} | 
              Loading: {loading ? 'YES' : 'NO'} | 
              Button enabled: {isButtonEnabled ? 'YES' : 'NO'}
            </div>
          </form>

          <div className="divider">
            <span className="divider-text">¿Ya tienes cuenta?</span>
          </div>

          <div className="login-section">
            <p className="login-text">
              Accede con tu cuenta existente <Link to="/login" className="login-link">Iniciar Sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;