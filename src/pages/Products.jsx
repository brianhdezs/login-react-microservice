import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import { isAdmin } from '../utils/auth';
import AddToCartButton from '../components/Cart/AddToCartButton';

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await productService.getAllProducts();
      if (result.success) {
        setProducts(result.data);
        setError('');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.categoryName === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Obtener categorías únicas
  const categories = [...new Set(products.map(product => product.categoryName).filter(Boolean))];

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
            <h2 style={{ color: 'white' }}>Cargando productos...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ 
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        minHeight: '70vh'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem'
              }}>
                Catálogo de Productos
              </h1>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                Descubre nuestra selección premium de productos exclusivos
              </p>
            </div>
            
            {isAdmin(user) && (
              <Link
                to="/admin/products/new"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="bi bi-plus-circle"></i>
                Nuevo Producto
              </Link>
            )}
          </div>

          {/* Filtros */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>
            
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Estadísticas */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            fontSize: '14px', 
            color: '#64748b' 
          }}>
            <span>Total: {products.length} productos</span>
            <span>•</span>
            <span>Mostrando: {filteredProducts.length} productos</span>
            {categoryFilter && (
              <>
                <span>•</span>
                <span>Categoría: {categoryFilter}</span>
              </>
            )}
          </div>
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
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}

        {/* Grid de Productos */}
        {filteredProducts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {filteredProducts.map(product => (
              <div
                key={product.productId}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(20px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Imagen */}
                <div style={{ position: 'relative', height: '250px', overflow: 'hidden' }}>
                  <img
                    src={productService.getImageUrl(product.imageUrl)}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                  {product.categoryName && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(99, 102, 241, 0.9)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backdropFilter: 'blur(10px)'
                    }}>
                      {product.categoryName}
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: '#0f172a',
                    marginBottom: '0.5rem',
                    lineHeight: '1.3'
                  }}>
                    {product.name}
                  </h3>
                  
                  <p style={{
                    color: '#64748b',
                    fontSize: '0.95rem',
                    marginBottom: '1rem',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      fontSize: '1.8rem',
                      fontWeight: '800',
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {productService.formatPrice(product.price)}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <Link
                      to={`/products/${product.productId}`}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: 'white',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '14px',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <i className="bi bi-eye"></i>
                      Ver Detalles
                    </Link>

                    {isAdmin(user) && (
                      <>
                        <Link
                          to={`/admin/products/edit/${product.productId}`}
                          style={{
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ fontSize: '4rem', color: '#94a3b8', marginBottom: '1rem' }}>
              <i className="bi bi-search"></i>
            </div>
            <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>
              No se encontraron productos
            </h3>
            <p style={{ color: '#64748b' }}>
              {searchTerm || categoryFilter 
                ? 'Intenta cambiar los filtros de búsqueda' 
                : 'Aún no hay productos disponibles'
              }
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;