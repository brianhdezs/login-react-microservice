import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../utils/auth';
import authService from '../services/authService';
import ProductManagement from '../components/Admin/ProductManagement';
import CouponManagement from '../components/Admin/CouponManagement';

const Dashboard = () => {
  const { user, assignRole } = useAuth();
  const [roleForm, setRoleForm] = useState({
    email: '',
    role: 'ADMIN'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('roles'); // Cambiar valor inicial

  const handleRoleAssignment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await assignRole(roleForm.email, roleForm.role);
      if (result.success) {
        setMessage('Rol asignado exitosamente');
        setRoleForm({ email: '', role: 'ADMIN' });
      } else {
        setMessage(result.message || 'Error al asignar rol');
      }
    } catch (error) {
      setMessage('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const userIsAdmin = isAdmin(user);
  
  // Debug: mostrar información del usuario en consola
  console.log('Current user in Dashboard:', user);
  console.log('User is admin:', userIsAdmin);

  // Función temporal para forzar rol de admin
  const handleForceAdminRole = () => {
    authService.forceAdminRole();
    window.location.reload(); // Recargar para aplicar cambios
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <Layout>
        <div style={{ 
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          minHeight: '60vh'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            padding: '3rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ¡Bienvenido al Dashboard!
            </h1>

            {/* Información del Usuario */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ color: '#1e293b', margin: 0 }}>Información del Usuario</h2>
                
                {/* Botón temporal para debug - REMOVER EN PRODUCCIÓN */}
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={handleForceAdminRole}
                    style={{
                      background: '#f59e0b',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                    title="Solo para desarrollo - forzar rol ADMIN"
                  >
                    🔧 Forzar Admin (Dev)
                  </button>
                )}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong style={{ color: '#374151' }}>Nombre:</strong>
                  <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>{user?.name}</p>
                </div>
                <div>
                  <strong style={{ color: '#374151' }}>Email:</strong>
                  <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>{user?.email}</p>
                </div>
                <div>
                  <strong style={{ color: '#374151' }}>Teléfono:</strong>
                  <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>{user?.phoneNumber}</p>
                </div>
                <div>
                  <strong style={{ color: '#374151' }}>Rol Actual:</strong>
                  <p style={{ 
                    margin: '0.5rem 0', 
                    color: userIsAdmin ? '#059669' : '#6b7280',
                    fontWeight: userIsAdmin ? '600' : 'normal'
                  }}>
                    {user?.role || user?.roles || 'Sin rol definido'}
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#374151' }}>Tipo de Usuario:</strong>
                  <p style={{ 
                    margin: '0.5rem 0', 
                    color: userIsAdmin ? '#059669' : '#6b7280',
                    fontWeight: userIsAdmin ? '600' : 'normal'
                  }}>
                    {userIsAdmin ? 'ADMINISTRADOR' : 'USUARIO'}
                  </p>
                </div>
                
                {/* Debug info solo en desarrollo */}
                {process.env.NODE_ENV === 'development' && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong style={{ color: '#374151' }}>Debug Info:</strong>
                    <pre style={{ 
                      margin: '0.5rem 0', 
                      color: '#6b7280', 
                      fontSize: '12px',
                      background: '#f8fafc',
                      padding: '8px',
                      borderRadius: '4px',
                      overflow: 'auto'
                    }}>
                      {JSON.stringify({ 
                        role: user?.role, 
                        roles: user?.roles, 
                        isAdmin: userIsAdmin 
                      }, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Contenido específico para ADMIN */}
            {userIsAdmin ? (
              <div>
                {/* Tabs de navegación para admin */}
                <div style={{
                  display: 'flex',
                  borderBottom: '2px solid #e2e8f0',
                  marginBottom: '2rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <button
                    onClick={() => setActiveTab('roles')}
                    style={{
                      padding: '12px 24px',
                      border: 'none',
                      background: activeTab === 'roles' ? '#6366f1' : 'transparent',
                      color: activeTab === 'roles' ? 'white' : '#64748b',
                      borderRadius: '8px 8px 0 0',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      fontSize: '14px'
                    }}
                  >
                    <i className="bi bi-shield-lock" style={{ marginRight: '0.5rem' }}></i>
                    Asignar Roles
                  </button>
                  <button
                    onClick={() => setActiveTab('products')}
                    style={{
                      padding: '12px 24px',
                      border: 'none',
                      background: activeTab === 'products' ? '#6366f1' : 'transparent',
                      color: activeTab === 'products' ? 'white' : '#64748b',
                      borderRadius: '8px 8px 0 0',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      fontSize: '14px'
                    }}
                  >
                    <i className="bi bi-grid" style={{ marginRight: '0.5rem' }}></i>
                    Gestión de Productos
                  </button>
                  <button
                    onClick={() => setActiveTab('coupons')}
                    style={{
                      padding: '12px 24px',
                      border: 'none',
                      background: activeTab === 'coupons' ? '#6366f1' : 'transparent',
                      color: activeTab === 'coupons' ? 'white' : '#64748b',
                      borderRadius: '8px 8px 0 0',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      fontSize: '14px'
                    }}
                  >
                    <i className="bi bi-ticket-perforated" style={{ marginRight: '0.5rem' }}></i>
                    Gestión de Cupones
                  </button>
                </div>

                {/* Contenido de los tabs */}
                {activeTab === 'roles' && (
                  <div style={{
                    background: 'linear-gradient(135deg, #fef3f2 0%, #fee2e2 100%)',
                    borderRadius: '16px',
                    padding: '2rem',
                    border: '1px solid #fca5a5'
                  }}>
                    <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>
                      <i className="bi bi-shield-lock" style={{ marginRight: '0.5rem' }}></i>
                      Asignar Rol a Usuario
                    </h2>
                    
                    <form onSubmit={handleRoleAssignment} style={{ maxWidth: '500px' }}>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '0.5rem'
                        }}>
                          Email del Usuario:
                        </label>
                        <input
                          type="email"
                          value={roleForm.email}
                          onChange={(e) => setRoleForm(prev => ({ ...prev, email: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #d1d5db',
                            borderRadius: '12px',
                            fontSize: '16px',
                            transition: 'all 0.3s ease',
                            fontFamily: 'Inter, sans-serif'
                          }}
                          placeholder="usuario@ejemplo.com"
                          required
                        />
                      </div>

                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '0.5rem'
                        }}>
                          Rol:
                        </label>
                        <select
                          value={roleForm.role}
                          onChange={(e) => setRoleForm(prev => ({ ...prev, role: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #d1d5db',
                            borderRadius: '12px',
                            fontSize: '16px',
                            transition: 'all 0.3s ease',
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="USER">USER</option>
                          <option value="MODERATOR">MODERATOR</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                          color: 'white',
                          padding: '12px 24px',
                          border: 'none',
                          borderRadius: '12px',
                          fontWeight: '600',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s ease',
                          fontFamily: 'Inter, sans-serif',
                          opacity: loading ? 0.6 : 1
                        }}
                      >
                        {loading ? 'Asignando...' : 'Asignar Rol'}
                      </button>
                    </form>

                    {message && (
                      <div style={{
                        marginTop: '1rem',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: message.includes('exitosamente') ? '#d1fae5' : '#fee2e2',
                        color: message.includes('exitosamente') ? '#059669' : '#dc2626',
                        fontWeight: '600'
                      }}>
                        {message}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'products' && (
                  <ProductManagement />
                )}

                {activeTab === 'coupons' && (
                  <CouponManagement />
                )}
              </div>
            ) : (
              // Contenido para usuarios no administradores
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid #0ea5e9',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', color: '#0ea5e9', marginBottom: '1rem' }}>
                  <i className="bi bi-person-circle"></i>
                </div>
                <h2 style={{ color: '#0369a1', marginBottom: '1rem' }}>
                  Panel de Usuario
                </h2>
                <p style={{ color: '#0284c7', marginBottom: '1.5rem' }}>
                  Bienvenido {user?.name}. Como usuario registrado, puedes:
                </p>
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  justifyContent: 'center', 
                  flexWrap: 'wrap',
                  marginTop: '2rem'
                }}>
                  <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #0ea5e9',
                    minWidth: '200px'
                  }}>
                    <i className="bi bi-grid" style={{ fontSize: '2rem', color: '#0ea5e9', marginBottom: '0.5rem' }}></i>
                    <h3 style={{ color: '#0369a1', margin: '0.5rem 0' }}>Explorar Productos</h3>
                    <p style={{ color: '#0284c7', fontSize: '14px' }}>Navega por nuestro catálogo premium</p>
                  </div>
                  <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #0ea5e9',
                    minWidth: '200px'
                  }}>
                    <i className="bi bi-bag" style={{ fontSize: '2rem', color: '#0ea5e9', marginBottom: '0.5rem' }}></i>
                    <h3 style={{ color: '#0369a1', margin: '0.5rem 0' }}>Realizar Compras</h3>
                    <p style={{ color: '#0284c7', fontSize: '14px' }}>Añade productos a tu carrito</p>
                  </div>
                  <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #0ea5e9',
                    minWidth: '200px'
                  }}>
                    <i className="bi bi-heart" style={{ fontSize: '2rem', color: '#0ea5e9', marginBottom: '0.5rem' }}></i>
                    <h3 style={{ color: '#0369a1', margin: '0.5rem 0' }}>Lista de Deseos</h3>
                    <p style={{ color: '#0284c7', fontSize: '14px' }}>Guarda tus productos favoritos</p>
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

export default Dashboard;