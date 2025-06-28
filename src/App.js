import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Páginas principales
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Páginas de productos
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ProductForm from './pages/ProductForm';

// Páginas de cupones
import CouponForm from './pages/CouponForm';

// Páginas de carrito
import ShoppingCart from './pages/ShoppingCart';

// Estilos globales
import './styles/auth.css';
import './styles/layout.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Página de inicio */}
              <Route path="/" element={<Home />} />
              
              {/* Rutas de autenticación */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rutas protegidas */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Rutas de productos */}
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              
              {/* Rutas de administración de productos (solo ADMIN) */}
              <Route path="/admin/products/new" element={<ProductForm />} />
              <Route path="/admin/products/edit/:id" element={<ProductForm />} />

              {/* Rutas de administración de cupones (solo ADMIN) */}
              <Route path="/admin/coupons/new" element={<CouponForm />} />
              <Route path="/admin/coupons/edit/:id" element={<CouponForm />} />
              
              {/* Rutas del carrito de compras */}
              <Route path="/cart" element={<ShoppingCart />} />
              
              {/* Páginas adicionales (placeholder) */}
              <Route path="/profile" element={<Dashboard />} />
              <Route path="/orders" element={<Dashboard />} />
              <Route path="/wishlist" element={<Dashboard />} />
              <Route path="/settings" element={<Dashboard />} />
              <Route path="/privacy" element={<Home />} />
              
              {/* Redirigir rutas no encontradas al inicio */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;