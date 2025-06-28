import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const AddToCartButton = ({ 
  productId, 
  productName = 'este producto',
  variant = 'primary', 
  size = 'medium',
  showQuantity = false,
  disabled = false 
}) => {
  const { addToCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setMessage('Debes iniciar sesión para agregar productos al carrito');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setButtonLoading(true);
    setMessage('');

    try {
      const result = await addToCart(productId, quantity);
      
      if (result.success) {
        setMessage('¡Producto agregado al carrito!');
        if (showQuantity) {
          setQuantity(1);
        }
      } else {
        setMessage(result.message || 'Error al agregar al carrito');
      }
    } catch (error) {
      setMessage('Error al agregar al carrito');
    } finally {
      setButtonLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getButtonStyles = () => {
    const baseStyles = {
      border: 'none',
      borderRadius: size === 'small' ? '8px' : '12px',
      fontWeight: '600',
      cursor: (disabled || buttonLoading || loading) ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      opacity: (disabled || buttonLoading || loading) ? 0.6 : 1,
      fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
      padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 24px' : '12px 20px',
      width: '100%'
    };

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyles,
          background: 'rgba(99, 102, 241, 0.1)',
          color: '#6366f1',
          border: '2px solid #6366f1'
        };
      case 'success':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
        };
      case 'minimal':
        return {
          ...baseStyles,
          background: 'transparent',
          color: '#6366f1',
          border: '1px solid #e2e8f0'
        };
      default: // primary
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
        };
    }
  };

  const buttonStyles = getButtonStyles();

  return (
    <div style={{ width: '100%' }}>
      {/* Selector de cantidad solo si está habilitado */}
      {showQuantity && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '12px',
          justifyContent: 'center'
        }}>
          <label style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#374151',
            minWidth: '65px'
          }}>
            Cantidad:
          </label>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            background: 'white',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || buttonLoading}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '8px 12px',
                cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                color: quantity <= 1 ? '#cbd5e1' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <i className="bi bi-dash"></i>
            </button>
            <div style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b',
              borderLeft: '1px solid #e2e8f0',
              borderRight: '1px solid #e2e8f0',
              minWidth: '50px',
              textAlign: 'center'
            }}>
              {quantity}
            </div>
            <button
              onClick={() => setQuantity(Math.min(99, quantity + 1))}
              disabled={quantity >= 99 || buttonLoading}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '8px 12px',
                cursor: quantity >= 99 ? 'not-allowed' : 'pointer',
                color: quantity >= 99 ? '#cbd5e1' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>
        </div>
      )}

      {/* Botón principal - manteniendo el diseño original */}
      <button
        onClick={handleAddToCart}
        disabled={disabled || buttonLoading || loading}
        style={buttonStyles}
        onMouseEnter={(e) => {
          if (!disabled && !buttonLoading && !loading) {
            if (variant === 'secondary') {
              e.target.style.background = '#6366f1';
              e.target.style.color = 'white';
            } else if (variant === 'minimal') {
              e.target.style.background = '#f8fafc';
            } else {
              e.target.style.transform = 'translateY(-2px)';
              if (variant === 'success') {
                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
              } else {
                e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)';
              }
            }
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !buttonLoading && !loading) {
            if (variant === 'secondary') {
              e.target.style.background = 'rgba(99, 102, 241, 0.1)';
              e.target.style.color = '#6366f1';
            } else if (variant === 'minimal') {
              e.target.style.background = 'transparent';
            } else {
              e.target.style.transform = 'translateY(0)';
              if (variant === 'success') {
                e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
              } else {
                e.target.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
              }
            }
          }
        }}
      >
        {buttonLoading || loading ? (
          <>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Agregando...
          </>
        ) : (
          <>
            <i className="bi bi-cart-plus"></i>
            {showQuantity && quantity > 1 
              ? `Agregar ${quantity} al Carrito` 
              : 'Agregar al Carrito'
            }
          </>
        )}
      </button>

      {/* Mensaje de respuesta */}
      {message && (
        <div
          style={{
            marginTop: '8px',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            textAlign: 'center',
            background: message.includes('Error') || message.includes('Debes') 
              ? 'linear-gradient(135deg, #fef2f2, #fee2e2)' 
              : 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
            color: message.includes('Error') || message.includes('Debes') 
              ? '#dc2626' 
              : '#065f46',
            border: message.includes('Error') || message.includes('Debes')
              ? '1px solid #fca5a5'
              : '1px solid #10b981'
          }}
        >
          {message}
        </div>
      )}

      {/* Información adicional para usuarios no autenticados */}
      {!isAuthenticated && (
        <div style={{
          marginTop: '8px',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          textAlign: 'center',
          background: 'rgba(59, 130, 246, 0.1)',
          color: '#1e40af',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <i className="bi bi-info-circle" style={{ marginRight: '4px' }}></i>
          Inicia sesión para agregar productos al carrito
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;