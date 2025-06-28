import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const CartIcon = () => {
  const { cartCount, loading } = useCart();
  const { isAuthenticated } = useAuth();

  // No mostrar el icono si no está autenticado
  if (!isAuthenticated) return null;

  return (
    <Link
      to="/cart"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = 'rgba(255, 255, 255, 0.2)';
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }}
      title="Ver carrito de compras"
    >
      <i 
        className="bi bi-cart3" 
        style={{ 
          fontSize: '1.2rem',
          transition: 'transform 0.3s ease'
        }}
      ></i>
      
      {/* Badge con contador */}
      {cartCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '700',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
            border: '2px solid white',
            animation: loading ? 'pulse 1.5s ease-in-out infinite' : 'none'
          }}
        >
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}

      {/* Indicador de carga */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </Link>
  );
};

export default CartIcon;