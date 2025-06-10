import axios from 'axios';

// Configuración base para el microservicio de cupones
const COUPON_API_BASE_URL = 'http://localhost:3004/api';

// Crear instancia de axios para cupones
const couponApi = axios.create({
  baseURL: COUPON_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT a todas las solicitudes
couponApi.interceptors.request.use(
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
couponApi.interceptors.response.use(
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

const couponService = {
  // Obtener todos los cupones
  getAllCoupons: async () => {
    try {
      const response = await couponApi.get('/cupon');
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data.result,
          message: response.data.message || 'Cupones obtenidos exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error al obtener cupones'
        };
      }
    } catch (error) {
      console.error('Error al obtener cupones:', error);
      
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

  // Obtener cupón por ID
  getCouponById: async (id) => {
    try {
      const response = await couponApi.get(`/cupon/${id}`);
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data.result,
          message: response.data.message || 'Cupón obtenido exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Cupón no encontrado'
        };
      }
    } catch (error) {
      console.error('Error al obtener cupón:', error);
      
      if (error.response) {
        switch (error.response.status) {
          case 404:
            return {
              success: false,
              message: 'Cupón no encontrado'
            };
          default:
            return {
              success: false,
              message: error.response.data?.message || 'Error en el servidor'
            };
        }
      }
      
      return {
        success: false,
        message: 'Error de conexión.'
      };
    }
  },

  // Obtener cupón por código
  getCouponByCode: async (code) => {
    try {
      const response = await couponApi.get(`/cupon/GetByCode/${code}`);
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data.result,
          message: response.data.message || 'Cupón obtenido exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Cupón no encontrado'
        };
      }
    } catch (error) {
      console.error('Error al obtener cupón por código:', error);
      
      if (error.response) {
        switch (error.response.status) {
          case 404:
            return {
              success: false,
              message: 'Cupón no encontrado'
            };
          default:
            return {
              success: false,
              message: error.response.data?.message || 'Error en el servidor'
            };
        }
      }
      
      return {
        success: false,
        message: 'Error de conexión.'
      };
    }
  },

  // Crear nuevo cupón (solo ADMIN)
  createCoupon: async (couponData) => {
    try {
      const response = await couponApi.post('/cupon', couponData);
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data.result,
          message: response.data.message || 'Cupón creado exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error al crear cupón'
        };
      }
    } catch (error) {
      console.error('Error al crear cupón:', error);
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            return {
              success: false,
              message: error.response.data?.message || 'Datos de cupón inválidos'
            };
          case 401:
            return {
              success: false,
              message: 'No tienes permisos para crear cupones'
            };
          case 403:
            return {
              success: false,
              message: 'Acceso denegado. Solo administradores pueden crear cupones.'
            };
          default:
            return {
              success: false,
              message: error.response.data?.message || 'Error en el servidor'
            };
        }
      }
      
      return {
        success: false,
        message: 'Error de conexión.'
      };
    }
  },

  // Actualizar cupón (solo ADMIN)
  updateCoupon: async (couponData) => {
    try {
      const response = await couponApi.put('/cupon', couponData);
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data.result,
          message: response.data.message || 'Cupón actualizado exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error al actualizar cupón'
        };
      }
    } catch (error) {
      console.error('Error al actualizar cupón:', error);
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            return {
              success: false,
              message: error.response.data?.message || 'Datos de cupón inválidos'
            };
          case 401:
            return {
              success: false,
              message: 'No tienes permisos para actualizar cupones'
            };
          case 403:
            return {
              success: false,
              message: 'Acceso denegado. Solo administradores pueden actualizar cupones.'
            };
          case 404:
            return {
              success: false,
              message: 'Cupón no encontrado'
            };
          default:
            return {
              success: false,
              message: error.response.data?.message || 'Error en el servidor'
            };
        }
      }
      
      return {
        success: false,
        message: 'Error de conexión.'
      };
    }
  },

  // Eliminar cupón (solo ADMIN)
  deleteCoupon: async (id) => {
    try {
      const response = await couponApi.delete(`/cupon/${id}`);
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data.result,
          message: response.data.message || 'Cupón eliminado exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error al eliminar cupón'
        };
      }
    } catch (error) {
      console.error('Error al eliminar cupón:', error);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            return {
              success: false,
              message: 'No tienes permisos para eliminar cupones'
            };
          case 403:
            return {
              success: false,
              message: 'Acceso denegado. Solo administradores pueden eliminar cupones.'
            };
          case 404:
            return {
              success: false,
              message: 'Cupón no encontrado'
            };
          default:
            return {
              success: false,
              message: error.response.data?.message || 'Error en el servidor'
            };
        }
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

  // Formatear fecha
  formatDate: (date) => {
    if (!date) return 'Sin fecha';
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  },

  // Validar si el cupón está activo
  isCouponActive: (coupon) => {
    if (!coupon.stateCoupon) return false;
    
    const now = new Date();
    const startDate = coupon.dateInit ? new Date(coupon.dateInit) : null;
    const endDate = coupon.dateEnd ? new Date(coupon.dateEnd) : null;
    
    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;
    
    return true;
  },

  // Obtener estado del cupón para mostrar
  getCouponStatus: (coupon) => {
    if (!coupon.stateCoupon) return { text: 'Inactivo', color: '#6b7280' };
    
    const now = new Date();
    const startDate = coupon.dateInit ? new Date(coupon.dateInit) : null;
    const endDate = coupon.dateEnd ? new Date(coupon.dateEnd) : null;
    
    if (startDate && now < startDate) {
      return { text: 'Programado', color: '#f59e0b' };
    }
    
    if (endDate && now > endDate) {
      return { text: 'Expirado', color: '#ef4444' };
    }
    
    return { text: 'Activo', color: '#10b981' };
  }
};

export default couponService;