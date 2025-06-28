import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import { useCart } from '../context/CartContext';

const ShoppingCart = () => {
  const {
    cart,
    loading,
    error,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    getCartTotal,
    getCartTotalWithDiscount,
    isCartEmpty,
    formatPrice,
    getProductImageUrl,
    hasDiscount,
    couponCode,
    discount,
    clearError
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');

  const handleRemoveItem = async (cartDetailsId, productName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${productName}" del carrito?`)) {
      const result = await removeFromCart(cartDetailsId);
      if (result.success) {
        setCouponMessage(result.message);
        setTimeout(() => setCouponMessage(''), 3000);
      }
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    
    setCouponLoading(true);
    setCouponMessage('');
    
    const result = await applyCoupon(couponInput.trim().toUpperCase());
    
    if (result.success) {
      setCouponInput('');
      setCouponMessage(result.message);
    } else {
      setCouponMessage(result.message);
    }
    
    setCouponLoading(false);
    setTimeout(() => setCouponMessage(''), 5000);
  };

  const handleRemoveCoupon = async () => {
    setCouponLoading(true);
    const result = await removeCoupon();
    
    if (result.success) {
      setCouponMessage(result.message);
    } else {
      setCouponMessage(result.message);
    }
    
    setCouponLoading(false);
    setTimeout(() => setCouponMessage(''), 3000);
  };

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true}>
        <Layout>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '3rem', 
                color: '#6366f1', 
                marginBottom: '1rem',
                animation: 'spin 1s linear infinite'
              }}>
                <i className="bi bi-arrow-repeat"></i>
              </div>
              <h2 style={{ color: 'white' }}>Cargando carrito...</h2>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <Layout>
        <div style={{ 
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          minHeight: '70vh'
        }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: '2rem' }}>
            <nav style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '1rem', 
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
                  Inicio
                </Link>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>/</span>
                <Link to="/products" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
                  Productos
                </Link>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>/</span>
                <span style={{ color: 'white', fontWeight: '600' }}>Carrito de Compras</span>
              </div>
            </nav>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            padding: '3rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem'
              }}>
                <i className="bi bi-cart3" style={{ marginRight: '0.5rem' }}></i>
                Carrito de Compras
              </h1>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                Revisa los productos que has agregado y procede al checkout
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                border: '2px solid #fca5a5',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '2rem',
                color: '#dc2626',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{error}</span>
                <button
                  onClick={clearError}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            )}

            {/* Mensaje de cupón */}
            {couponMessage && (
              <div style={{
                background: couponMessage.includes('exitosamente') 
                  ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' 
                  : 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                border: couponMessage.includes('exitosamente') 
                  ? '2px solid #10b981' 
                  : '2px solid #fca5a5',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '2rem',
                color: couponMessage.includes('exitosamente') ? '#065f46' : '#dc2626',
                fontWeight: '600'
              }}>
                {couponMessage}
              </div>
            )}

            {/* Carrito vacío */}
            {isCartEmpty() ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem'
              }}>
                <div style={{ fontSize: '5rem', color: '#94a3b8', marginBottom: '2rem' }}>
                  <i className="bi bi-cart-x"></i>
                </div>
                <h3 style={{ color: '#475569', marginBottom: '1rem', fontSize: '1.5rem' }}>
                  Tu carrito está vacío
                </h3>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                  ¡Agrega algunos productos increíbles y comienza a comprar!
                </p>
                <Link
                  to="/products"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <i className="bi bi-grid"></i>
                  Explorar Productos
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
                {/* Lista de productos */}
                <div>
                  <h3 style={{ 
                    color: '#1e293b', 
                    marginBottom: '1.5rem',
                    fontSize: '1.3rem',
                    fontWeight: '600'
                  }}>
                    Productos en tu carrito ({cart?.cartDetailsDtos?.length || 0})
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cart?.cartDetailsDtos?.map((item) => (
                      <div
                        key={item.cartDetailsId}
                        style={{
                          background: 'white',
                          borderRadius: '16px',
                          padding: '1.5rem',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          {/* Imagen del producto */}
                          <div style={{ flexShrink: 0 }}>
                            <img
                              src={getProductImageUrl(item.productDto?.imageUrl)}
                              alt={item.productDto?.name}
                              style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                                border: '1px solid #e2e8f0'
                              }}
                            />
                          </div>

                          {/* Información del producto */}
                          <div style={{ flex: 1 }}>
                            <h4 style={{ 
                              color: '#1e293b', 
                              margin: '0 0 0.5rem 0',
                              fontSize: '1.1rem',
                              fontWeight: '600'
                            }}>
                              {item.productDto?.name || 'Producto no disponible'}
                            </h4>
                            
                            <p style={{ 
                              color: '#64748b', 
                              margin: '0 0 0.5rem 0',
                              fontSize: '0.9rem',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {item.productDto?.description || 'Sin descripción'}
                            </p>

                            {item.productDto?.categoryName && (
                              <span style={{
                                background: '#e0f2fe',
                                color: '#0369a1',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                {item.productDto.categoryName}
                              </span>
                            )}
                          </div>

                          {/* Cantidad y precio */}
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'flex-end',
                            justifyContent: 'space-between'
                          }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                color: '#059669'
                              }}>
                                {formatPrice(item.productDto?.price || 0)}
                              </div>
                              <div style={{ 
                                color: '#64748b', 
                                fontSize: '0.9rem',
                                marginTop: '0.25rem'
                              }}>
                                Cantidad: {item.count}
                              </div>
                              <div style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: '#1e293b',
                                marginTop: '0.25rem'
                              }}>
                                Subtotal: {formatPrice((item.productDto?.price || 0) * item.count)}
                              </div>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.cartDetailsId, item.productDto?.name)}
                              style={{
                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                              }}
                            >
                              <i className="bi bi-trash"></i>
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumen del carrito */}
                <div>
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '2rem',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    position: 'sticky',
                    top: '2rem'
                  }}>
                    <h3 style={{ 
                      color: '#1e293b', 
                      marginBottom: '1.5rem',
                      fontSize: '1.3rem',
                      fontWeight: '600'
                    }}>
                      Resumen del Pedido
                    </h3>

                    {/* Cupón */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      {hasDiscount ? (
                        <div style={{
                          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                          border: '2px solid #10b981',
                          borderRadius: '12px',
                          padding: '1rem'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '0.5rem'
                          }}>
                            <span style={{ color: '#065f46', fontWeight: '600' }}>
                              <i className="bi bi-ticket-perforated" style={{ marginRight: '0.5rem' }}></i>
                              Cupón aplicado
                            </span>
                            <button
                              onClick={handleRemoveCoupon}
                              disabled={couponLoading}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#065f46',
                                cursor: 'pointer',
                                fontSize: '1rem'
                              }}
                            >
                              <i className="bi bi-x-circle"></i>
                            </button>
                          </div>
                          <div style={{ color: '#065f46' }}>
                            <strong>{couponCode}</strong> - Descuento: {formatPrice(discount)}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '0.5rem'
                          }}>
                            Código de Cupón
                          </label>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                              type="text"
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                              placeholder="INGRESA TU CUPÓN"
                              style={{
                                flex: 1,
                                padding: '10px 12px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                textTransform: 'uppercase'
                              }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleApplyCoupon();
                                }
                              }}
                            />
                            <button
                              onClick={handleApplyCoupon}
                              disabled={couponLoading || !couponInput.trim()}
                              style={{
                                background: couponLoading 
                                  ? '#9ca3af' 
                                  : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '10px 16px',
                                cursor: couponLoading ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                opacity: couponLoading || !couponInput.trim() ? 0.6 : 1
                              }}
                            >
                              {couponLoading ? 'Aplicando...' : 'Aplicar'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Desglose de precios */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ color: '#64748b' }}>Subtotal:</span>
                        <span style={{ color: '#1e293b', fontWeight: '600' }}>
                          {formatPrice(getCartTotal())}
                        </span>
                      </div>

                      {hasDiscount && (
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{ color: '#059669' }}>Descuento:</span>
                          <span style={{ color: '#059669', fontWeight: '600' }}>
                            -{formatPrice(discount)}
                          </span>
                        </div>
                      )}

                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ color: '#64748b' }}>Envío:</span>
                        <span style={{ color: '#059669', fontWeight: '600' }}>
                          Gratis
                        </span>
                      </div>

                      <hr style={{ 
                        border: 'none', 
                        borderTop: '1px solid #e2e8f0', 
                        margin: '1rem 0' 
                      }} />

                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        fontSize: '1.2rem',
                        fontWeight: '700'
                      }}>
                        <span style={{ color: '#1e293b' }}>Total:</span>
                        <span style={{ 
                          color: '#059669',
                          fontSize: '1.4rem'
                        }}>
                          {formatPrice(getCartTotalWithDiscount())}
                        </span>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <button
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '16px',
                          fontSize: '16px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                        }}
                        onClick={() => alert('Funcionalidad de checkout próximamente')}
                      >
                        <i className="bi bi-credit-card"></i>
                        Proceder al Checkout
                      </button>

                      <Link
                        to="/products"
                        style={{
                          background: 'rgba(99, 102, 241, 0.1)',
                          color: '#6366f1',
                          border: '2px solid #6366f1',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#6366f1';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                          e.target.style.color = '#6366f1';
                        }}
                      >
                        <i className="bi bi-arrow-left"></i>
                        Seguir Comprando
                      </Link>
                    </div>

                    {/* Información adicional */}
                    <div style={{
                      marginTop: '1.5rem',
                      padding: '1rem',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        marginBottom: '0.5rem' 
                      }}>
                        <i className="bi bi-shield-check" style={{ color: '#3b82f6' }}></i>
                        <strong style={{ color: '#1e40af', fontSize: '14px' }}>
                          Compra Segura
                        </strong>
                      </div>
                      <ul style={{ 
                        color: '#1e40af', 
                        fontSize: '12px', 
                        lineHeight: '1.4',
                        marginLeft: '1.5rem',
                        margin: 0
                      }}>
                        <li>Envío gratis en todos los pedidos</li>
                        <li>Garantía de devolución 30 días</li>
                        <li>Pago 100% seguro</li>
                        <li>Soporte 24/7</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ShoppingCart;