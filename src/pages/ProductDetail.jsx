import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import { isAdmin } from '../utils/auth';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const result = await productService.getProductById(id);
      if (result.success) {
        setProduct(result.data);
        setError('');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      return;
    }

    setDeleteLoading(true);
    try {
      const result = await productService.deleteProduct(id);
      if (result.success) {
        alert('Producto eliminado exitosamente');
        navigate('/products');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Error al eliminar el producto');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
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
              marginBottom: '20px',
              animation: 'spin 1s linear infinite'
            }}>
              <i className="bi bi-arrow-repeat"></i>
            </div>
            <h2 style={{ color: 'white' }}>Cargando producto...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={{ 
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            padding: '4rem 2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ fontSize: '4rem', color: '#ef4444', marginBottom: '1rem' }}>
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Error</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>{error}</p>
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
                gap: '8px'
              }}
            >
              <i className="bi bi-arrow-left"></i>
              Volver al Catálogo
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return null;
  }

  return (
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
              <span style={{ color: 'white', fontWeight: '600' }}>{product.name}</span>
            </div>
          </nav>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {/* Contenido del producto */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '0',
            minHeight: '600px'
          }}>
            {/* Imagen */}
            <div style={{ 
              position: 'relative',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img
                src={productService.getImageUrl(product.imageUrl)}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
              />
              {product.categoryName && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  background: 'rgba(99, 102, 241, 0.9)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                }}>
                  {product.categoryName}
                </div>
              )}
            </div>

            {/* Información */}
            <div style={{ padding: '3rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: '#0f172a',
                  marginBottom: '1rem',
                  lineHeight: '1.2'
                }}>
                  {product.name}
                </h1>

                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '2rem'
                }}>
                  {productService.formatPrice(product.price)}
                </div>
              </div>

              {/* Descripción */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#374151',
                  marginBottom: '1rem'
                }}>
                  Descripción
                </h3>
                <p style={{
                  color: '#64748b',
                  fontSize: '1.1rem',
                  lineHeight: '1.7',
                  marginBottom: '0'
                }}>
                  {product.description || 'Sin descripción disponible'}
                </p>
              </div>

              {/* Información adicional */}
              <div style={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                padding: '1.5rem',
                borderRadius: '16px',
                marginBottom: '3rem',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ 
                  color: '#374151', 
                  marginBottom: '1rem',
                  fontWeight: '600'
                }}>
                  Información del Producto
                </h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1rem' 
                }}>
                  <div>
                    <strong style={{ color: '#374151' }}>Categoría:</strong>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>
                      {product.categoryName || 'Sin categoría'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div style={{ 
                display: 'flex', 
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                {/* Botón principal de compra (simulado) */}
                <button
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    padding: '16px 24px',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                    minWidth: '200px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
                  }}
                  onClick={() => alert('Funcionalidad de compra próximamente')}
                >
                  <i className="bi bi-bag-plus"></i>
                  Agregar al Carrito
                </button>

                {/* Acciones de administrador */}
                {isAdmin(user) && (
                  <>
                    <Link
                      to={`/admin/products/edit/${product.productId}`}
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                      }}
                    >
                      <i className="bi bi-pencil"></i>
                      Editar
                    </Link>

                    <button
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      style={{
                        background: deleteLoading 
                          ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                          : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: 'white',
                        padding: '16px 20px',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '600',
                        cursor: deleteLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: deleteLoading 
                          ? '0 4px 15px rgba(156, 163, 175, 0.3)'
                          : '0 4px 15px rgba(239, 68, 68, 0.3)',
                        opacity: deleteLoading ? 0.7 : 1
                      }}
                    >
                      <i className={deleteLoading ? "bi bi-arrow-repeat" : "bi bi-trash"}></i>
                      {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </>
                )}
              </div>

              {/* Botón volver */}
              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
                <Link
                  to="/products"
                  style={{
                    color: '#6366f1',
                    textDecoration: 'none',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#4f46e5';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#6366f1';
                  }}
                >
                  <i className="bi bi-arrow-left"></i>
                  Volver al Catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de productos relacionados (placeholder) */}
        <div style={{
          marginTop: '4rem',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            Productos Relacionados
          </h3>
          <p style={{ 
            color: '#64748b', 
            textAlign: 'center', 
            padding: '2rem',
            fontStyle: 'italic'
          }}>
            Próximamente: productos relacionados basados en categoría y preferencias
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;