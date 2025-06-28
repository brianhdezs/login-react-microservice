import axios from 'axios';

// Configuración base para el microservicio de carrito
const CART_API_BASE_URL = 'http://localhost:3005/api';

// Crear instancia de axios para carrito
const cartApi = axios.create({
  baseURL: CART_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT a todas las solicitudes
cartApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
cartApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado o inválido, redirigir al login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Función para obtener información del usuario actual
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

const cartService = {
  // Obtener carrito del usuario
  getCart: async (userId) => {
    try {
      const response = await cartApi.get(`/cartapi/GetCart/${userId}`);
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data.result,
          message: response.data.message || 'Carrito obtenido exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error al obtener el carrito'
        };
      }
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Error en el servidor'
        };
      }
      
      return {
        success: false,
        message: 'Error de conexión. Verifica que el servidor esté funcionando.'
      };
    }
  },

  // Añadir o actualizar producto en el carrito
  addToCart: async (userId, productId, quantity = 1) => {
    try {
      // Obtener información del usuario para los campos requeridos
      const currentUser = getCurrentUser();
      
      const cartData = {
        cartHeader: {
          userId: userId,
          couponCode: '',
          // Usar datos del usuario si están disponibles, sino usar valores por defecto
          name: currentUser?.name || '',
          phone: currentUser?.phoneNumber || currentUser?.phone || '',
          email: currentUser?.email || `user${userId}@temp.com` // Email temporal válido
        },
        cartDetailsDtos: [
          {
            productId: productId,
            count: quantity
          }
        ]
      };

      const response = await cartApi.post('/cartapi/CartUpsert', cartData);
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data.result,
          message: 'Producto agregado al carrito exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error al agregar producto al carrito'
        };
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      
      if (error.response) {
        // Log del error específico para debugging
        console.error('Server response:', error.response.data);
        return {
          success: false,
          message: error.response.data?.message || 'Error en el servidor'
        };
      }
      
      return {
        success: false,
        message: 'Error de conexión.'
      };
    }
  },

 // Remover producto del carrito
removeFromCart: async (cartDetailsId) => {
  try {
    const response = await cartApi.post('/cartapi/RemoveCart', {
      cartDetailsId: cartDetailsId
    });
    
    if (response.data.isSuccess) {
      return {
        success: true,
        data: response.data.result,
        message: 'Producto eliminado del carrito exitosamente'
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Error al eliminar producto del carrito'
      };
    }
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'Error en el servidor'
      };
    }
    
    return {
      success: false,
      message: 'Error de conexión.'
    };
  }
},

  // Aplicar cupón al carrito
  applyCoupon: async (userId, couponCode) => {
    try {
      const currentUser = getCurrentUser();
      
      const cartData = {
        cartHeader: {
          userId: userId,
          couponCode: couponCode,
          name: currentUser?.name || '',
          phone: currentUser?.phoneNumber || currentUser?.phone || '',
          email: currentUser?.email || `user${userId}@temp.com`
        },
        cartDetailsDtos: []
      };

      const response = await cartApi.post('/cartapi/ApplyCoupon', cartData);
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data.result,
          message: 'Cupón aplicado exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error al aplicar cupón'
        };
      }
    } catch (error) {
      console.error('Error al aplicar cupón:', error);
      
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Error en el servidor'
        };
      }
      
      return {
        success: false,
        message: 'Error de conexión.'
      };
    }
  },

  // Remover cupón del carrito
  removeCoupon: async (userId) => {
    try {
      const currentUser = getCurrentUser();
      
      const cartData = {
        cartHeader: {
          userId: userId,
          couponCode: '',
          name: currentUser?.name || '',
          phone: currentUser?.phoneNumber || currentUser?.phone || '',
          email: currentUser?.email || `user${userId}@temp.com`
        },
        cartDetailsDtos: []
      };

      const response = await cartApi.post('/cartapi/RemoveCoupon', cartData);
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data.result,
          message: 'Cupón removido exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error al remover cupón'
        };
      }
    } catch (error) {
      console.error('Error al remover cupón:', error);
      
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Error en el servidor'
        };
      }
      
      return {
        success: false,
        message: 'Error de conexión.'
      };
    }
  },

  // Obtener cantidad de productos en el carrito
  getCartCount: async (userId) => {
    try {
      const response = await cartApi.get(`/cartapi/GetCartCount/${userId}`);
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data.result,
          message: 'Contador obtenido exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error al obtener contador'
        };
      }
    } catch (error) {
      console.error('Error al obtener contador del carrito:', error);
      
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Error en el servidor'
        };
      }
      
      return {
        success: false,
        message: 'Error de conexión.'
      };
    }
  },

  // Formatear precio para mostrar
  formatPrice: (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  },

  // Calcular total del carrito
  calculateCartTotal: (cartItems) => {
    if (!cartItems || cartItems.length === 0) return 0;
    
    return cartItems.reduce((total, item) => {
      const price = item.productDto?.price || 0;
      const quantity = item.count || 0;
      return total + (price * quantity);
    }, 0);
  },

  // Calcular total de productos (cantidad)
  calculateCartItemsCount: (cartItems) => {
    if (!cartItems || cartItems.length === 0) return 0;
    
    return cartItems.reduce((total, item) => {
      return total + (item.count || 0);
    }, 0);
  },

  // Aplicar descuento
  applyDiscount: (total, discount, discountType = 'FIXED') => {
    if (!discount || discount <= 0) return total;
    
    if (discountType === 'PERCENTAGE') {
      return total * (1 - discount / 100);
    } else {
      // FIXED discount
      return Math.max(0, total - discount);
    }
  },

  // Validar si el carrito está vacío
  isCartEmpty: (cart) => {
    return !cart || !cart.cartDetailsDtos || cart.cartDetailsDtos.length === 0;
  },

  // Obtener imagen del producto (usando el servicio de productos)
  getProductImageUrl: (imageUrl) => {
    if (!imageUrl) {
      return 'https://placehold.co/300x200/e2e8f0/64748b?text=Sin+Imagen';
    }
    
    // Si ya es una URL completa, devolverla tal como está
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Si es placeholder, devolverlo tal como está
    if (imageUrl.includes('placehold.co')) {
      return imageUrl;
    }
    
    // Para URLs del servidor (que empiezan con /ProductImages/)
    if (imageUrl.startsWith('/ProductImages/')) {
      return `http://localhost:3003${imageUrl}`;
    }
    
    // Para cualquier otra URL relativa
    const cleanUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `http://localhost:3003${cleanUrl}`;
  }
};

export default cartService;