import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar carrito cuando el usuario se autentique
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadCart();
      loadCartCount();
    } else {
      // Limpiar carrito si no hay usuario autenticado
      setCart(null);
      setCartCount(0);
    }
  }, [isAuthenticated, user?.id]);

  // Cargar carrito completo
  const loadCart = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const result = await cartService.getCart(user.id);
      if (result.success) {
        setCart(result.data);
        setError('');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error al cargar el carrito');
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar solo el contador del carrito
  const loadCartCount = async () => {
    if (!user?.id) return;
    
    try {
      const result = await cartService.getCartCount(user.id);
      if (result.success) {
        setCartCount(result.data);
      }
    } catch (error) {
      console.error('Error loading cart count:', error);
    }
  };

  // Agregar producto al carrito
  const addToCart = async (productId, quantity = 1) => {
    if (!user?.id) {
      setError('Debes iniciar sesión para agregar productos al carrito');
      return { success: false, message: 'Debes iniciar sesión' };
    }

    setLoading(true);
    try {
      const result = await cartService.addToCart(user.id, productId, quantity);
      if (result.success) {
        // Recargar carrito y contador
        await loadCart();
        await loadCartCount();
        setError('');
        return { success: true, message: 'Producto agregado al carrito' };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = 'Error al agregar producto al carrito';
      setError(errorMessage);
      console.error('Error adding to cart:', error);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Remover producto del carrito
  const removeFromCart = async (cartDetailsId) => {
    if (!user?.id) return { success: false, message: 'Usuario no autenticado' };

    setLoading(true);
    try {
      const result = await cartService.removeFromCart(cartDetailsId);
      if (result.success) {
        // Recargar carrito y contador
        await loadCart();
        await loadCartCount();
        setError('');
        return { success: true, message: 'Producto eliminado del carrito' };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = 'Error al eliminar producto del carrito';
      setError(errorMessage);
      console.error('Error removing from cart:', error);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Aplicar cupón
  const applyCoupon = async (couponCode) => {
    if (!user?.id) return { success: false, message: 'Usuario no autenticado' };

    setLoading(true);
    try {
      const result = await cartService.applyCoupon(user.id, couponCode);
      if (result.success) {
        // Recargar carrito para ver el descuento aplicado
        await loadCart();
        setError('');
        return { success: true, message: 'Cupón aplicado exitosamente' };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = 'Error al aplicar cupón';
      setError(errorMessage);
      console.error('Error applying coupon:', error);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Remover cupón
  const removeCoupon = async () => {
    if (!user?.id) return { success: false, message: 'Usuario no autenticado' };

    setLoading(true);
    try {
      const result = await cartService.removeCoupon(user.id);
      if (result.success) {
        // Recargar carrito para ver el cambio
        await loadCart();
        setError('');
        return { success: true, message: 'Cupón removido exitosamente' };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = 'Error al remover cupón';
      setError(errorMessage);
      console.error('Error removing coupon:', error);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Obtener total del carrito
  const getCartTotal = () => {
    if (!cart || !cart.cartDetailsDtos) return 0;
    return cartService.calculateCartTotal(cart.cartDetailsDtos);
  };

  // Obtener total con descuento
  const getCartTotalWithDiscount = () => {
    const total = getCartTotal();
    const discount = cart?.cartHeader?.discount || 0;
    return Math.max(0, total - discount);
  };

  // Verificar si el carrito está vacío
  const isCartEmpty = () => {
    return cartService.isCartEmpty(cart);
  };

  // Limpiar errores
  const clearError = () => {
    setError('');
  };

  // Actualizar información del carrito (nombre, teléfono, email)
  const updateCartInfo = async (name, phone, email) => {
    if (!user?.id || !cart) return { success: false, message: 'No hay carrito para actualizar' };

    // Para actualizar la información, podríamos necesitar un endpoint específico
    // Por ahora, actualizamos localmente
    setCart(prevCart => ({
      ...prevCart,
      cartHeader: {
        ...prevCart.cartHeader,
        name: name || '',
        phone: phone || '',
        email: email || ''
      }
    }));

    return { success: true, message: 'Información actualizada' };
  };

  const value = {
    // Estado
    cart,
    cartCount,
    loading,
    error,

    // Acciones
    loadCart,
    addToCart,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    updateCartInfo,
    clearError,

    // Utilidades
    getCartTotal,
    getCartTotalWithDiscount,
    isCartEmpty,
    formatPrice: cartService.formatPrice,
    getProductImageUrl: cartService.getProductImageUrl,

    // Estado del carrito
    hasDiscount: cart?.cartHeader?.discount > 0,
    couponCode: cart?.cartHeader?.couponCode || '',
    discount: cart?.cartHeader?.discount || 0
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;