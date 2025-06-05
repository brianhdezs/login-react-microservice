import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, assignRole } = useAuth();
  const [roleForm, setRoleForm] = useState({
    email: '',
    role: 'ADMIN'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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

            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>Información del Usuario</h2>
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
                  <strong style={{ color: '#374151' }}>ID:</strong>
                  <p style={{ margin: '0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>{user?.id}</p>
                </div>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #fef3f2 0%, #fee2e2 100%)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid #fca5a5'
            }}>
              <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>
                <i className="bi bi-shield-lock" style={{ marginRight: '0.5rem' }}></i>
                Asignar Rol (Solo Administradores)
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
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Dashboard;