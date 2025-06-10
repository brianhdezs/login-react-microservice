import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import couponService from '../services/couponService';
import { isAdmin } from '../utils/auth';

const CouponForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    couponCode: '',
    discountAmount: '',
    minAmount: '',
    amountType: 'PERCENTAGE',
    limitUse: '',
    dateInit: '',
    dateEnd: '',
    category: '',
    stateCoupon: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(isEdit);
  const [validationSummary, setValidationSummary] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadCoupon();
    }
  }, [id, isEdit]);

  const loadCoupon = async () => {
    setLoadingCoupon(true);
    try {
      const result = await couponService.getCouponById(id);
      if (result.success) {
        const coupon = result.data;
        setFormData({
          couponCode: coupon.couponCode,
          discountAmount: coupon.discountAmount.toString(),
          minAmount: coupon.minAmount.toString(),
          amountType: coupon.amountType || 'PERCENTAGE',
          limitUse: coupon.limitUse ? coupon.limitUse.toString() : '',
          dateInit: coupon.dateInit ? new Date(coupon.dateInit).toISOString().slice(0, 16) : '',
          dateEnd: coupon.dateEnd ? new Date(coupon.dateEnd).toISOString().slice(0, 16) : '',
          category: coupon.category || '',
          stateCoupon: coupon.stateCoupon
        });
      } else {
        setValidationSummary('Cupón no encontrado');
      }
    } catch (error) {
      setValidationSummary('Error al cargar el cupón');
    } finally {
      setLoadingCoupon(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.couponCode.trim()) {
      newErrors.couponCode = 'El código del cupón es requerido';
    } else if (formData.couponCode.length < 3) {
      newErrors.couponCode = 'El código debe tener al menos 3 caracteres';
    }
    
    if (!formData.discountAmount) {
      newErrors.discountAmount = 'El monto de descuento es requerido';
    } else if (isNaN(formData.discountAmount) || parseFloat(formData.discountAmount) <= 0) {
      newErrors.discountAmount = 'El monto debe ser un número mayor a 0';
    } else if (formData.amountType === 'PERCENTAGE' && parseFloat(formData.discountAmount) > 100) {
      newErrors.discountAmount = 'El porcentaje no puede ser mayor a 100%';
    } else if (formData.amountType === 'FIXED' && parseFloat(formData.discountAmount) > 50000) {
      newErrors.discountAmount = 'El descuento fijo no puede ser mayor a $50,000';
    }
    
    if (!formData.minAmount) {
      newErrors.minAmount = 'El monto mínimo es requerido';
    } else if (isNaN(formData.minAmount) || parseFloat(formData.minAmount) < 0) {
      newErrors.minAmount = 'El monto mínimo debe ser un número mayor o igual a 0';
    }
    
    if (formData.limitUse && (isNaN(formData.limitUse) || parseInt(formData.limitUse) <= 0)) {
      newErrors.limitUse = 'El límite de uso debe ser un número mayor a 0';
    }
    
    if (formData.dateInit && formData.dateEnd) {
      const startDate = new Date(formData.dateInit);
      const endDate = new Date(formData.dateEnd);
      if (startDate >= endDate) {
        newErrors.dateEnd = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationSummary('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const couponData = {
        couponCode: formData.couponCode.trim().toUpperCase(),
        discountAmount: parseFloat(formData.discountAmount),
        minAmount: parseFloat(formData.minAmount),
        amountType: formData.amountType,
        limitUse: formData.limitUse ? parseInt(formData.limitUse) : null,
        dateInit: formData.dateInit ? new Date(formData.dateInit) : null,
        dateEnd: formData.dateEnd ? new Date(formData.dateEnd) : null,
        category: formData.category.trim() || null,
        stateCoupon: formData.stateCoupon
      };

      if (isEdit) {
        couponData.couponId = parseInt(id);
      }

      const result = isEdit 
        ? await couponService.updateCoupon(couponData)
        : await couponService.createCoupon(couponData);
      
      if (result.success) {
        setValidationSummary('');
        navigate('/dashboard', { 
          state: { 
            message: `Cupón ${isEdit ? 'actualizado' : 'creado'} exitosamente`,
            activeTab: 'coupons'
          } 
        });
      } else {
        setValidationSummary(result.message);
      }
    } catch (error) {
      setValidationSummary('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Verificar permisos
  if (!isAdmin(user)) {
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
              <i className="bi bi-shield-x"></i>
            </div>
            <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Acceso Denegado</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
              Solo los administradores pueden gestionar cupones.
            </p>
            <Link
              to="/dashboard"
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
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (loadingCoupon) {
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
            <h2 style={{ color: 'white' }}>Cargando cupón...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <Layout>
        <div style={{ 
          padding: '2rem',
          maxWidth: '1000px',
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
                <Link to="/dashboard" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
                  Dashboard
                </Link>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>/</span>
                <span style={{ color: 'white', fontWeight: '600' }}>
                  {isEdit ? 'Editar Cupón' : 'Nuevo Cupón'}
                </span>
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
                <i className="bi bi-ticket-perforated" style={{ marginRight: '0.5rem' }}></i>
                {isEdit ? 'Editar Cupón' : 'Crear Nuevo Cupón'}
              </h1>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                {isEdit 
                  ? 'Actualiza la información del cupón de descuento' 
                  : 'Completa la información para crear un nuevo cupón de descuento'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {validationSummary && (
                <div style={{
                  background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                  border: '2px solid #fca5a5',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '2rem',
                  color: '#dc2626',
                  fontWeight: '600'
                }}>
                  {validationSummary}
                </div>
              )}

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '2rem',
                marginBottom: '2rem'
              }}>
                {/* Columna izquierda */}
                <div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Código del Cupón *
                    </label>
                    <input
                      type="text"
                      name="couponCode"
                      value={formData.couponCode}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Inter, sans-serif',
                        textTransform: 'uppercase'
                      }}
                      placeholder="Ej: DESCUENTO10"
                    />
                    {errors.couponCode && <span style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px', display: 'block' }}>{errors.couponCode}</span>}
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Tipo de Descuento *
                    </label>
                    <select
                      name="amountType"
                      value={formData.amountType}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      <option value="PERCENTAGE">Porcentaje (%)</option>
                      <option value="FIXED">Monto Fijo ($)</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Monto de Descuento * {formData.amountType === 'PERCENTAGE' ? '(%)' : '(MXN)'}
                    </label>
                    <input
                      type="number"
                      name="discountAmount"
                      value={formData.discountAmount}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Inter, sans-serif'
                      }}
                      placeholder={formData.amountType === 'PERCENTAGE' ? '10' : '100.00'}
                      min="0"
                      max={formData.amountType === 'PERCENTAGE' ? '100' : '50000'}
                      step={formData.amountType === 'PERCENTAGE' ? '1' : '0.01'}
                    />
                    {errors.discountAmount && <span style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px', display: 'block' }}>{errors.discountAmount}</span>}
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Monto Mínimo de Compra * (MXN)
                    </label>
                    <input
                      type="number"
                      name="minAmount"
                      value={formData.minAmount}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Inter, sans-serif'
                      }}
                      placeholder="500.00"
                      min="0"
                      step="0.01"
                    />
                    {errors.minAmount && <span style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px', display: 'block' }}>{errors.minAmount}</span>}
                  </div>
                </div>

                {/* Columna derecha */}
                <div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Categoría
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Inter, sans-serif'
                      }}
                      placeholder="Ej: Electrónicos, Ropa, General"
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Límite de Usos
                    </label>
                    <input
                      type="number"
                      name="limitUse"
                      value={formData.limitUse}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Inter, sans-serif'
                      }}
                      placeholder="100 (dejar vacío para ilimitado)"
                      min="1"
                    />
                    {errors.limitUse && <span style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px', display: 'block' }}>{errors.limitUse}</span>}
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Fecha de Inicio
                    </label>
                    <input
                      type="datetime-local"
                      name="dateInit"
                      value={formData.dateInit}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Fecha de Fin
                    </label>
                    <input
                      type="datetime-local"
                      name="dateEnd"
                      value={formData.dateEnd}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    />
                    {errors.dateEnd && <span style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px', display: 'block' }}>{errors.dateEnd}</span>}
                  </div>
                </div>
              </div>

              {/* Estado del cupón */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    <input
                      type="checkbox"
                      name="stateCoupon"
                      checked={formData.stateCoupon}
                      onChange={handleInputChange}
                      style={{
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer'
                      }}
                    />
                    <span>
                      <i className="bi bi-toggle-on" style={{ marginRight: '8px', color: '#10b981' }}></i>
                      Cupón activo
                    </span>
                  </label>
                  <p style={{ 
                    color: '#64748b', 
                    fontSize: '14px', 
                    margin: '8px 0 0 32px' 
                  }}>
                    Los cupones inactivos no pueden ser utilizados por los clientes
                  </p>
                </div>
              </div>

              {/* Vista previa del cupón */}
              <div style={{
                background: 'linear-gradient(135deg, #fef3f2 0%, #fee2e2 100%)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
                border: '1px solid #fca5a5'
              }}>
                <h3 style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '1.2rem' }}>
                  <i className="bi bi-eye" style={{ marginRight: '0.5rem' }}></i>
                  Vista Previa del Cupón
                </h3>
                <div style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  border: '2px dashed #fca5a5'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ color: '#1e293b', margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
                        {formData.couponCode.toUpperCase() || 'CÓDIGO_CUPÓN'}
                      </h4>
                      <p style={{ color: '#64748b', margin: 0 }}>
                        {formData.amountType === 'PERCENTAGE' 
                          ? `${formData.discountAmount || 0}% de descuento`
                          : `$${formData.discountAmount || 0} MXN de descuento`
                        }
                      </p>
                      <p style={{ color: '#64748b', fontSize: '12px', margin: '0.5rem 0 0 0' }}>
                        Compra mínima: ${formData.minAmount || 0} MXN
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        background: formData.stateCoupon ? '#10b981' : '#6b7280',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {formData.stateCoupon ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div style={{ 
                display: 'flex', 
                gap: '1rem',
                justifyContent: 'flex-end',
                paddingTop: '2rem',
                borderTop: '1px solid #e2e8f0'
              }}>
                <Link
                  to="/dashboard"
                  style={{
                    background: 'rgba(107, 114, 128, 0.1)',
                    color: '#374151',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    border: '2px solid #e5e7eb',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <i className="bi bi-x-circle"></i>
                  Cancelar
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading 
                      ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                      : isEdit 
                        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: loading 
                      ? '0 4px 15px rgba(156, 163, 175, 0.3)'
                      : isEdit
                        ? '0 4px 15px rgba(245, 158, 11, 0.3)'
                        : '0 4px 15px rgba(16, 185, 129, 0.3)',
                    opacity: loading ? 0.7 : 1,
                    fontSize: '16px'
                  }}
                >
                  <i className={
                    loading 
                      ? "bi bi-arrow-repeat" 
                      : isEdit 
                        ? "bi bi-check-circle" 
                        : "bi bi-plus-circle"
                  }></i>
                  {loading 
                    ? (isEdit ? 'Actualizando...' : 'Creando...') 
                    : (isEdit ? 'Actualizar Cupón' : 'Crear Cupón')
                  }
                </button>
              </div>

              {/* Información adicional */}
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                  <i className="bi bi-info-circle" style={{ color: '#3b82f6' }}></i>
                  <strong style={{ color: '#1e40af' }}>Información importante:</strong>
                </div>
                <ul style={{ 
                  color: '#1e40af', 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  marginLeft: '1.5rem'
                }}>
                  <li>Los campos marcados con (*) son obligatorios</li>
                  <li>El código del cupón se convertirá automáticamente a mayúsculas</li>
                  <li>Para descuentos porcentuales, el máximo es 100%</li>
                  <li>Para descuentos fijos, el máximo es $50,000 MXN</li>
                  <li>Si no estableces fechas, el cupón será válido indefinidamente</li>
                  <li>Si no estableces límite de usos, será ilimitado</li>
                  {isEdit && <li>Los cambios se aplicarán inmediatamente</li>}
                </ul>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CouponForm;

          