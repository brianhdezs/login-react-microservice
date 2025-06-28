import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isAdmin } from '../../utils/auth';
import CartIcon from '../Cart/CartIcon';
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
            <Link to="/products" className="nav-link">
              <i className="bi bi-grid"></i> Productos
            </Link>
          </li>
          {isAdmin(user) && (
            <li>
              <Link to="/admin/products/new" className="nav-link">
                <i className="bi bi-plus-circle"></i> Nuevo Producto
              </Link>
            </li>
          )}
          <li>
            <Link to="/privacy" className="nav-link">
              <i className="bi bi-shield-check"></i> Privacidad
            </Link>
          </li>
        </ul>

        <div className="nav-separator"></div>

        <div className="auth-nav">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Icono del carrito */}
              <CartIcon />
              
              {/* Menú de usuario */}
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
                      {isAdmin(user) ? (
                        <>
                          Administrador <span className="status-indicator" style={{ background: '#f59e0b' }}></span>
                        </>
                      ) : (
                        <>
                          En línea <span className="status-indicator"></span>
                        </>
                      )}
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
                  
                  <Link to="/cart" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <div className="item-icon">
                      <i className="bi bi-cart3"></i>
                    </div>
                    <span>Mi Carrito</span>
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

                  {isAdmin(user) && (
                    <>
                      <div style={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        margin: '0.5rem 0',
                        paddingTop: '0.5rem'
                      }}>
                        <div className="dropdown-header" style={{ margin: '0 0.5rem', fontSize: '11px' }}>
                          <i className="bi bi-gear"></i> Administración
                        </div>
                      </div>
                      
                      <Link to="/admin/products/new" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <div className="item-icon">
                          <i className="bi bi-plus-circle"></i>
                        </div>
                        <span>Nuevo Producto</span>
                      </Link>
                      
                      <Link to="/admin/coupons/new" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <div className="item-icon">
                          <i className="bi bi-ticket-perforated"></i>
                        </div>
                        <span>Nuevo Cupón</span>
                      </Link>
                      
                      <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <div className="item-icon">
                          <i className="bi bi-speedometer2"></i>
                        </div>
                        <span>Panel Admin</span>
                      </Link>
                    </>
                  )}
                  
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