import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
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
          padding: '4rem 3rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              color: 'white',
              margin: '0 auto 2rem auto',
              boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)'
            }}>
              <i className="bi bi-gem"></i>
            </div>
            
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              letterSpacing: '-2px'
            }}>
              Bienvenido a EliteShop
            </h1>
            
            <p style={{
              fontSize: '1.25rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto 3rem auto',
              lineHeight: '1.7'
            }}>
              Tu plataforma premium de compras. Descubre productos exclusivos y vive una experiencia de compra única con tecnología de vanguardia.
            </p>
          </div>

          {isAuthenticated ? (
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '2rem',
              border: '1px solid #0ea5e9'
            }}>
              <h2 style={{ 
                color: '#0369a1', 
                marginBottom: '1rem',
                fontSize: '1.5rem'
              }}>
                ¡Hola {user?.name}! 👋
              </h2>
              <p style={{ color: '#0284c7', marginBottom: '1.5rem' }}>
                Estás autenticado y listo para explorar todas las funcionalidades.
              </p>
              <Link 
                to="/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
                }}
              >
                <i className="bi bi-speedometer2"></i>
                Ir al Dashboard
              </Link>
            </div>
          ) : (
            <div style={{
              background: 'linear-gradient(135deg, #fef3f2 0%, #fee2e2 100%)',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '2rem',
              border: '1px solid #f87171'
            }}>
              <h2 style={{ 
                color: '#dc2626', 
                marginBottom: '1rem',
                fontSize: '1.5rem'
              }}>
                Comienza tu experiencia premium
              </h2>
              <p style={{ color: '#b91c1c', marginBottom: '1.5rem' }}>
                Regístrate o inicia sesión para acceder a todas las funcionalidades exclusivas.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link 
                  to="/register"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <i className="bi bi-person-plus"></i>
                  Crear Cuenta
                </Link>
                
                <Link 
                  to="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <i className="bi bi-box-arrow-in-right"></i>
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid #cbd5e1',
              textAlign: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                fontSize: '1.5rem',
                color: 'white'
              }}>
                <i className="bi bi-award"></i>
              </div>
              <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Productos Premium</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Accede a una selección exclusiva de productos de alta calidad
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid #cbd5e1',
              textAlign: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                fontSize: '1.5rem',
                color: 'white'
              }}>
                <i className="bi bi-truck"></i>
              </div>
              <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Envío Express</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Recibe tus pedidos en tiempo récord con nuestro servicio express
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid #cbd5e1',
              textAlign: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                fontSize: '1.5rem',
                color: 'white'
              }}>
                <i className="bi bi-headset"></i>
              </div>
              <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Soporte 24/7</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Nuestro equipo está disponible las 24 horas para ayudarte
              </p>
            </div>
          </div>

          <div style={{
            marginTop: '3rem',
            padding: '1.5rem',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <i className="bi bi-shield-check" style={{ color: '#059669', fontSize: '1.2rem' }}></i>
              <span style={{ color: '#059669', fontWeight: '600', fontSize: '0.9rem' }}>
                Conexión segura protegida con SSL de 256 bits
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;