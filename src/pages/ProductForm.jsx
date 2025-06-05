import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import { isAdmin } from '../utils/auth';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    categoryName: '',
    image: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEdit);
  const [validationSummary, setValidationSummary] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
  }, [id, isEdit]);

  const loadProduct = async () => {
    setLoadingProduct(true);
    try {
      const result = await productService.getProductById(id);
      if (result.success) {
        const product = result.data;
        setFormData({
          name: product.name,
          price: product.price.toString(),
          description: product.description,
          categoryName: product.categoryName,
          image: null
        });
        setImagePreview(productService.getImageUrl(product.imageUrl));
      } else {
        setValidationSummary('Producto no encontrado');
      }
    } catch (error) {
      setValidationSummary('Error al cargar el producto');
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Crear preview de la imagen
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.price) {
      newErrors.price = 'El precio es requerido';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser un número mayor a 0';
    } else if (parseFloat(formData.price) > 100000) {
      newErrors.price = 'El precio no puede ser mayor a $100,000';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'La categoría es requerida';
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
      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        categoryName: formData.categoryName.trim(),
        image: formData.image
      };

      if (isEdit) {
        productData.productId = parseInt(id);
      }

      const result = isEdit 
        ? await productService.updateProduct(productData)
        : await productService.createProduct(productData);
      
      if (result.success) {
        setValidationSummary('');
        navigate('/products', { 
          state: { 
            message: `Producto ${isEdit ? 'actualizado' : 'creado'} exitosamente` 
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
              Solo los administradores pueden gestionar productos.
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

  if (loadingProduct) {
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
                <Link to="/products" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
                  Productos
                </Link>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>/</span>
                <span style={{ color: 'white', fontWeight: '600' }}>
                  {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
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
                {isEdit ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h1>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                {isEdit 
                  ? 'Actualiza la información del producto' 
                  : 'Completa la información para agregar un nuevo producto al catálogo'
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
                {/* Formulario */}
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
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
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
                      placeholder="Ej: iPhone 15 Pro"
                    />
                    {errors.name && <span style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
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
                      Precio (MXN) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
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
                      placeholder="0.00"
                      min="0"
                      max="100000"
                      step="0.01"
                    />
                    {errors.price && <span style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px', display: 'block' }}>{errors.price}</span>}
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
                      Categoría *
                    </label>
                    <input
                      type="text"
                      name="categoryName"
                      value={formData.categoryName}
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
                      placeholder="Ej: Electrónicos"
                    />
                    {errors.categoryName && <span style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px', display: 'block' }}>{errors.categoryName}</span>}
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Descripción *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Inter, sans-serif',
                        resize: 'vertical'
                      }}
                      placeholder="Describe las características y beneficios del producto..."
                    />
                    {errors.description && <span style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px', display: 'block' }}>{errors.description}</span>}
                  </div>
                </div>

                {/* Imagen */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#374151',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em'
                  }}>
                    Imagen del Producto
                  </label>

                  {/* Preview de imagen */}
                  <div style={{
                    width: '100%',
                    height: '300px',
                    border: '2px dashed #e2e8f0',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    background: imagePreview ? 'transparent' : '#f8fafc',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                        <i className="bi bi-image" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                        <p>Selecciona una imagen</p>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  />
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#6b7280', 
                    marginTop: '0.5rem',
                    fontStyle: 'italic'
                  }}>
                    Formatos soportados: JPG, PNG, GIF, WebP (máx. 5MB)
                  </p>
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
                  to="/products"
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
                    : (isEdit ? 'Actualizar Producto' : 'Crear Producto')
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
                  <li>Todos los campos marcados con (*) son obligatorios</li>
                  <li>El precio debe estar entre $1.00 y $100,000.00 MXN</li>
                  <li>Las imágenes se redimensionarán automáticamente</li>
                  <li>Si no subes una imagen, se asignará una por defecto</li>
                  {isEdit && <li>Si no seleccionas una nueva imagen, se mantendrá la actual</li>}
                </ul>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ProductForm;