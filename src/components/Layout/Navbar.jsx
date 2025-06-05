import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/layout.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const getUserInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <i className="bi bi-gem"></i>
          </div>
          EliteShop
        </Link>

        <ul className="navbar-nav">
          <li>
            <Link to="/" className="nav-link">
              <i className="bi bi-house-door"></i> Inicio
            </Link>
          </li>
          <li>
            <Link to="/privacy" className="nav-link">
              <i className="bi bi-shield-check"></i> Privacidad
            </Link>
          </li>
        </ul>

        <div className="nav-separator"></div>

        <div className="auth-nav">
          {isAuthenticated ? (
            <div className="user-menu" ref={dropdownRef}>
              <button 
                className="user-profile-btn" 
                onClick={toggleDropdown}
                aria-expanded={dropdownOpen}
              >
                <div className="user-avatar-nav">
                  {getUserInitial()}
                </div>
                <div className="user-info">
                  <div className="user-name">{user?.name || user?.email}</div>
                  <div className="user-status">
                    En línea <span className="status-indicator"></span>
                  </div>
                </div>
                <i className="bi bi-chevron-down"></i>
              </button>

              <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                <div className="dropdown-header">
                  <i className="bi bi-person-circle"></i> Mi Cuenta
                </div>
                
                <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <div className="item-icon">
                    <i className="bi bi-person"></i>
                  </div>
                  <span>Ver Perfil</span>
                </Link>
                
                <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <div className="item-icon">
                    <i className="bi bi-bag"></i>
                  </div>
                  <span>Mis Pedidos</span>
                </Link>
                
                <Link to="/wishlist" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <div className="item-icon">
                    <i className="bi bi-heart"></i>
                  </div>
                  <span>Lista de Deseos</span>
                </Link>
                
                <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <div className="item-icon">
                    <i className="bi bi-gear"></i>
                  </div>
                  <span>Configuración</span>
                </Link>
                
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <div className="item-icon">
                    <i className="bi bi-box-arrow-right"></i>
                  </div>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/register" className="auth-btn register-btn">
                <i className="bi bi-person-plus"></i>
                <span>Registrarse</span>
              </Link>
              <Link to="/login" className="auth-btn login-btn">
                <i className="bi bi-box-arrow-in-right"></i>
                <span>Iniciar Sesión</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;