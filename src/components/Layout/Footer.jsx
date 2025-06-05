import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-container">
        <div>
          <p>&copy; 2025 - EliteShop - Tu tienda premium de confianza</p>
        </div>
        <div>
          <Link to="/privacy">Política de Privacidad</Link>
          <span style={{ margin: '0 10px' }}>|</span>
          <a href="#">Términos de Servicio</a>
          <span style={{ margin: '0 10px' }}>|</span>
          <a href="#">Soporte</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;