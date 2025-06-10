import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import couponService from '../../services/couponService';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const result = await couponService.getAllCoupons();
      if (result.success) {
        setCoupons(result.data);
        setError('');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error al cargar cupones');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = async (couponId, couponCode) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el cupón "${couponCode}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeleteLoading(couponId);
    try {
      const result = await couponService.deleteCoupon(couponId);
      if (result.success) {
        // Actualizar la lista local removiendo el cupón eliminado
        setCoupons(prevCoupons => prevCoupons.filter(c => c.couponId !== couponId));
        alert('Cupón eliminado exitosamente');
      } else {
        alert(result.message || 'Error al eliminar el cupón');
      }
    } catch (error) {
      alert('Error de conexión al eliminar el cupón');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filtrar cupones
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.couponCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (coupon.category && coupon.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesStatus = true;
    if (statusFilter) {
      const status = couponService.getCouponStatus(coupon);
      matchesStatus = status.text.toLowerCase() === statusFilter.toLowerCase();
    }
    
    return matchesSearch && matchesStatus;
  });

  // Obtener estados únicos para el filtro
  const statuses = ['Activo', 'Inactivo', 'Expirado', 'Programado'];

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
          <p style={{ color: '#64748b' }}>Cargando cupones...</p>
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
            <i className="bi bi-ticket-perforated" style={{ marginRight: '0.5rem' }}></i>
            Gestión de Cupones
          </h2>
          <p style={{ color: '#64748b', margin: 0 }}>
            Administra los cupones de descuento de la tienda
          </p>
        </div>
        
        <Link
          to="/admin/coupons/new"
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
          Nuevo Cupón
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
            placeholder="Buscar cupones..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <option value="">Todos los estados</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
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
        <span>Total: {coupons.length} cupones</span>
        <span>•</span>
        <span>Mostrando: {filteredCoupons.length} cupones</span>
        {statusFilter && (
          <>
            <span>•</span>
            <span>Estado: {statusFilter}</span>
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

      {/* Tabla de cupones */}
      {filteredCoupons.length > 0 ? (
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
                    Código
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
                    Descuento
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
                    Monto Mín.
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
                    Estado
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
                    Vigencia
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
                {filteredCoupons.map((coupon, index) => {
                  const status = couponService.getCouponStatus(coupon);
                  return (
                    <tr 
                      key={coupon.couponId} 
                      style={{ 
                        borderBottom: '1px solid #f1f5f9',
                        background: index % 2 === 0 ? 'white' : '#fafbfc'
                      }}
                    >
                      <td style={{ padding: '16px 12px' }}>
                        <div>
                          <div style={{ fontWeight: '700', color: '#1e293b', marginBottom: '2px', fontSize: '16px' }}>
                            {coupon.couponCode.toUpperCase()}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '12px' }}>
                            ID: {coupon.couponId}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <div style={{ fontWeight: '700', color: '#059669', fontSize: '16px' }}>
                          {coupon.amountType === 'PERCENTAGE' ? 
                            `${coupon.discountAmount}%` : 
                            couponService.formatPrice(coupon.discountAmount)
                          }
                        </div>
                        <div style={{ color: '#64748b', fontSize: '12px' }}>
                          {coupon.amountType === 'PERCENTAGE' ? 'Porcentaje' : 'Fijo'}
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <div style={{ fontWeight: '600', color: '#374151' }}>
                          {couponService.formatPrice(coupon.minAmount)}
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        {coupon.category ? (
                          <span style={{
                            background: '#e0f2fe',
                            color: '#0369a1',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {coupon.category}
                          </span>
                        ) : (
                          <span style={{ color: '#9ca3af', fontSize: '12px' }}>General</span>
                        )}
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <span style={{
                          background: `${status.color}20`,
                          color: status.color,
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {status.text}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {coupon.dateInit && (
                            <div>Desde: {couponService.formatDate(coupon.dateInit)}</div>
                          )}
                          {coupon.dateEnd && (
                            <div>Hasta: {couponService.formatDate(coupon.dateEnd)}</div>
                          )}
                          {!coupon.dateInit && !coupon.dateEnd && 'Sin límite'}
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <Link
                            to={`/admin/coupons/edit/${coupon.couponId}`}
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
                            title="Editar cupón"
                          >
                            <i className="bi bi-pencil"></i>
                            Editar
                          </Link>

                          <button
                            onClick={() => handleDeleteCoupon(coupon.couponId, coupon.couponCode)}
                            disabled={deleteLoading === coupon.couponId}
                            style={{
                              background: deleteLoading === coupon.couponId 
                                ? '#9ca3af' 
                                : '#ef4444',
                              color: 'white',
                              padding: '6px 10px',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: deleteLoading === coupon.couponId ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.3s ease',
                              opacity: deleteLoading === coupon.couponId ? 0.6 : 1
                            }}
                            title="Eliminar cupón"
                          >
                            <i className={deleteLoading === coupon.couponId ? "bi bi-arrow-repeat" : "bi bi-trash"}></i>
                            {deleteLoading === coupon.couponId ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
            <i className="bi bi-ticket-perforated"></i>
          </div>
          <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>
            No se encontraron cupones
          </h3>
          <p style={{ color: '#64748b' }}>
            {searchTerm || statusFilter 
              ? 'Intenta cambiar los filtros de búsqueda' 
              : 'Aún no hay cupones en el sistema'
            }
          </p>
          {(!searchTerm && !statusFilter) && (
            <Link
              to="/admin/coupons/new"
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
              Crear Primer Cupón
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
          <li>Los cupones pueden tener descuentos fijos o porcentuales</li>
          <li>Configura fechas de inicio y fin para controlar la vigencia</li>
          <li>Establece un monto mínimo de compra para aplicar el descuento</li>
          <li>Los cambios se reflejan inmediatamente en el sistema</li>
        </ul>
      </div>
    </div>
  );
};

export default CouponManagement;