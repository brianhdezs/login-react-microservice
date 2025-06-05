import api from './api';

const productService = {
  // Obtener todos los productos
  getAllProducts: async () => {
    try {
      const response = await api.get('/product');
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data.result,
          message: response.data.message || 'Productos obtenidos exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error al obtener productos'
        };
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
      
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

  // Obtener producto por ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/product/${id}`);
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data.result,
          message: response.data.message || 'Producto obtenido exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Producto no encontrado'
        };
      }
    } catch (error) {
      console.error('Error al obtener producto:', error);
      
      if (error.response) {
        switch (error.response.status) {
          case 404:
            return {
              success: false,
              message: 'Producto no encontrado'
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

  // Crear nuevo producto (solo ADMIN)
  createProduct: async (productData) => {
    try {
      const formData = new FormData();
      
      // Agregar campos del producto
      formData.append('name', productData.name);
      formData.append('price', productData.price);
      formData.append('description', productData.description || '');
      formData.append('categoryName', productData.categoryName || '');
      
      // Agregar imagen si existe
      if (productData.image) {
        formData.append('image', productData.image);
      }

      const response = await api.post('/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data.result,
          message: response.data.message || 'Producto creado exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error al crear producto'
        };
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            return {
              success: false,
              message: error.response.data?.message || 'Datos de producto inválidos'
            };
          case 401:
            return {
              success: false,
              message: 'No tienes permisos para crear productos'
            };
          case 403:
            return {
              success: false,
              message: 'Acceso denegado. Solo administradores pueden crear productos.'
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

  // Actualizar producto (solo ADMIN)
  updateProduct: async (productData) => {
    try {
      const formData = new FormData();
      
      // Agregar campos del producto
      formData.append('productId', productData.productId);
      formData.append('name', productData.name);
      formData.append('price', productData.price);
      formData.append('description', productData.description || '');
      formData.append('categoryName', productData.categoryName || '');
      
      // Agregar imagen si existe
      if (productData.image) {
        formData.append('image', productData.image);
      }

      const response = await api.put('/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data.result,
          message: response.data.message || 'Producto actualizado exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error al actualizar producto'
        };
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            return {
              success: false,
              message: error.response.data?.message || 'Datos de producto inválidos'
            };
          case 401:
            return {
              success: false,
              message: 'No tienes permisos para actualizar productos'
            };
          case 403:
            return {
              success: false,
              message: 'Acceso denegado. Solo administradores pueden actualizar productos.'
            };
          case 404:
            return {
              success: false,
              message: 'Producto no encontrado'
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

  // Eliminar producto (solo ADMIN)
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/product/${id}`);
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data.result,
          message: response.data.message || 'Producto eliminado exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error al eliminar producto'
        };
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            return {
              success: false,
              message: 'No tienes permisos para eliminar productos'
            };
          case 403:
            return {
              success: false,
              message: 'Acceso denegado. Solo administradores pueden eliminar productos.'
            };
          case 404:
            return {
              success: false,
              message: 'Producto no encontrado'
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

  // Obtener URL completa de imagen - CORREGIDO DEFINITIVO
  getImageUrl: (imageUrl) => {
    console.log('URL recibida:', imageUrl); // Para debug
    
    if (!imageUrl) {
      console.log('No hay URL, usando placeholder');
      return 'https://placehold.co/600x400';
    }
    
    // Si ya es una URL completa, devolverla tal como está
    if (imageUrl.startsWith('http')) {
      console.log('URL completa detectada:', imageUrl);
      return imageUrl;
    }
    
    // Si es placeholder, devolverlo tal como está
    if (imageUrl.includes('placehold.co')) {
      console.log('Placeholder detectado:', imageUrl);
      return imageUrl;
    }
    
    // Para URLs del servidor (que empiezan con /ProductImages/)
    if (imageUrl.startsWith('/ProductImages/')) {
      const fullUrl = `http://localhost:3003${imageUrl}`;
      console.log('URL construida:', fullUrl);
      return fullUrl;
    }
    
    // Para cualquier otra URL relativa
    const cleanUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    const fullUrl = `http://localhost:3003${cleanUrl}`;
    console.log('URL final construida:', fullUrl);
    return fullUrl;
  }
};

export default productService;