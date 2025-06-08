import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

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

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${productName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeleteLoading(productId);
    try {
      const result = await productService.deleteProduct(productId);
      if (result.success) {
        // Actualizar la lista local removiendo el producto eliminado
        setProducts(prevProducts => prevProducts.filter(p => p.productId !== productId));
        alert('Producto eliminado exitosamente');
      } else {
        alert(result.message || 'Error al eliminar el producto');
      }
    } catch (error) {
      alert('Error de conexión al eliminar el producto');
    } finally {
      setDeleteLoading(null);
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '300px' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '2rem', 
            color: '#6366f1', 
            marginBottom: '1rem',
            animation: 'spin 1s linear infinite'
          }}>
            <i className="bi bi-arrow-repeat"></i>
          </div>
          <p style={{ color: '#64748b' }}>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '16px',
      padding: '2rem',
      border: '1px solid #e2e8f0'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h2 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>
            <i className="bi bi-grid" style={{ marginRight: '0.5rem' }}></i>
            Gestión de Productos
          </h2>
          <p style={{ color: '#64748b', margin: 0 }}>
            Administra el catálogo de productos de la tienda
          </p>
        </div>
        
        <Link
          to="/admin/products/new"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.3s ease',
            fontSize: '14px'
          }}
        >
          <i className="bi bi-plus-circle"></i>
          Nuevo Producto
        </Link>
      </div>

      {/* Filtros */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
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
              padding: '10px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
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
        fontSize: '13px', 
        color: '#64748b',
        marginBottom: '1.5rem'
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

      {/* Error */}
      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '1rem',
          color: '#dc2626',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Tabla de productos */}
      {filteredProducts.length > 0 ? (
        <div style={{ 
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  <th style={{ 
                    padding: '16px 12px', 
                    textAlign: 'left', 
                    fontWeight: '700',
                    color: '#374151',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Producto
                  </th>
                  <th style={{ 
                    padding: '16px 12px', 
                    textAlign: 'center', 
                    fontWeight: '700',
                    color: '#374151',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Categoría
                  </th>
                  <th style={{ 
                    padding: '16px 12px', 
                    textAlign: 'center', 
                    fontWeight: '700',
                    color: '#374151',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Precio
                  </th>
                  <th style={{ 
                    padding: '16px 12px', 
                    textAlign: 'center', 
                    fontWeight: '700',
                    color: '#374151',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr 
                    key={product.productId} 
                    style={{ 
                      borderBottom: '1px solid #f1f5f9',
                      background: index % 2 === 0 ? 'white' : '#fafbfc'
                    }}
                  >
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={productService.getImageUrl(product.imageUrl)}
                          alt={product.name}
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '1px solid #e2e8f0'
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '2px' }}>
                            {product.name}
                          </div>
                          <div style={{ 
                            color: '#64748b', 
                            fontSize: '12px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            maxWidth: '200px'
                          }}>
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                      {product.categoryName ? (
                        <span style={{
                          background: '#e0f2fe',
                          color: '#0369a1',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {product.categoryName}
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '12px' }}>Sin categoría</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                      <div style={{
                        fontWeight: '700',
                        color: '#059669',
                        fontSize: '16px'
                      }}>
                        {productService.formatPrice(product.price)}
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <Link
                          to={`/products/${product.productId}`}
                          style={{
                            background: '#6366f1',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.3s ease'
                          }}
                          title="Ver detalles"
                        >
                          <i className="bi bi-eye"></i>
                          Ver
                        </Link>
                        
                        <Link
                          to={`/admin/products/edit/${product.productId}`}
                          style={{
                            background: '#f59e0b',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.3s ease'
                          }}
                          title="Editar producto"
                        >
                          <i className="bi bi-pencil"></i>
                          Editar
                        </Link>

                        <button
                          onClick={() => handleDeleteProduct(product.productId, product.name)}
                          disabled={deleteLoading === product.productId}
                          style={{
                            background: deleteLoading === product.productId 
                              ? '#9ca3af' 
                              : '#ef4444',
                            color: 'white',
                            padding: '6px 10px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: deleteLoading === product.productId ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.3s ease',
                            opacity: deleteLoading === product.productId ? 0.6 : 1
                          }}
                          title="Eliminar producto"
                        >
                          <i className={deleteLoading === product.productId ? "bi bi-arrow-repeat" : "bi bi-trash"}></i>
                          {deleteLoading === product.productId ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '3rem 2rem',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '3rem', color: '#94a3b8', marginBottom: '1rem' }}>
            <i className="bi bi-inbox"></i>
          </div>
          <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>
            No se encontraron productos
          </h3>
          <p style={{ color: '#64748b' }}>
            {searchTerm || categoryFilter 
              ? 'Intenta cambiar los filtros de búsqueda' 
              : 'Aún no hay productos en el catálogo'
            }
          </p>
          {(!searchTerm && !categoryFilter) && (
            <Link
              to="/admin/products/new"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '1rem',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
            >
              <i className="bi bi-plus-circle"></i>
              Crear Primer Producto
            </Link>
          )}
        </div>
      )}

      {/* Información adicional */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(59, 130, 246, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <i className="bi bi-info-circle" style={{ color: '#3b82f6' }}></i>
          <strong style={{ color: '#1e40af', fontSize: '14px' }}>Información:</strong>
        </div>
        <ul style={{ 
          color: '#1e40af', 
          fontSize: '13px', 
          lineHeight: '1.6',
          marginLeft: '1.5rem',
          margin: 0
        }}>
          <li>Usa "Ver" para revisar los detalles completos del producto</li>
          <li>Usa "Editar" para modificar la información del producto</li>
          <li>Usa "Eliminar" para remover permanentemente el producto del catálogo</li>
          <li>Los cambios se reflejan inmediatamente en la tienda</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductManagement;