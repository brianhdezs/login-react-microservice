import { authApi } from './api';

const authService = {
  // Registrar nuevo usuario
  register: async (userData) => {
    try {
      const response = await authApi.post('/register', userData);
      
      // NestJS devuelve ResponseDto con isSuccess cuando es exitoso
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || 'Usuario registrado exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error al registrar usuario'
        };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      
      // Manejar errores HTTP específicos
      if (error.response) {
        switch (error.response.status) {
          case 409: // Conflict - usuario ya existe
            return {
              success: false,
              message: error.response.data?.message || 'El usuario ya existe'
            };
          case 400: // Bad Request - datos inválidos
            return {
              success: false,
              message: error.response.data?.message || 'Datos de registro inválidos'
            };
          default:
            return {
              success: false,
              message: error.response.data?.message || 'Error en el servidor'
            };
        }
      }
      
      // Error de conexión
      return {
        success: false,
        message: 'Error de conexión. Verifica que el servidor esté funcionando.'
      };
    }
  },

  // Iniciar sesión
  login: async (credentials) => {
    try {
      const response = await authApi.post('/login', credentials);
      
      // Verificar si la respuesta es exitosa
      if (response.data.isSuccess && response.data.result) {
        const { user, token } = response.data.result;
        
        // Guardar token y datos del usuario en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
          success: true,
          user,
          token,
          message: 'Inicio de sesión exitoso'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error en el inicio de sesión'
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      
      // Manejar errores HTTP específicos
      if (error.response) {
        switch (error.response.status) {
          case 401: // Unauthorized - credenciales inválidas
            return {
              success: false,
              message: error.response.data?.message || 'Credenciales inválidas'
            };
          case 400: // Bad Request - datos inválidos
            return {
              success: false,
              message: error.response.data?.message || 'Datos de inicio de sesión inválidos'
            };
          default:
            return {
              success: false,
              message: error.response.data?.message || 'Error en el servidor'
            };
        }
      }
      
      // Error de conexión
      return {
        success: false,
        message: 'Error de conexión. Verifica que el servidor esté funcionando.'
      };
    }
  },

  // Asignar rol a usuario - CORREGIDO CON TODOS LOS CAMPOS
  assignRole: async (email, role) => {
    try {
      // Crear payload completo con todos los campos requeridos
      const payload = {
        email: email,
        name: email.split('@')[0], // Usar la parte antes del @ como nombre
        phoneNumber: "0000000000", // Teléfono temporal
        password: "TempPassword123!", // Password temporal 
        role: role
      };

      console.log('Enviando payload:', payload); // Para debug

      const response = await authApi.post('/assignRole', payload);
      
      if (response.data.isSuccess) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || 'Rol asignado exitosamente'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Error al asignar rol'
        };
      }
    } catch (error) {
      console.error('Error en asignación de rol:', error);
      
      // Manejar errores HTTP específicos
      if (error.response) {
        console.error('Response data:', error.response.data); // Para debug
        switch (error.response.status) {
          case 404: // Not Found - usuario no encontrado
            return {
              success: false,
              message: error.response.data?.message || 'Usuario no encontrado'
            };
          case 400: // Bad Request - datos inválidos
            return {
              success: false,
              message: error.response.data?.message || 'Datos inválidos para asignar rol'
            };
          default:
            return {
              success: false,
              message: error.response.data?.message || 'Error en el servidor'
            };
        }
      }
      
      // Error de conexión
      return {
        success: false,
        message: 'Error de conexión. Verifica que el servidor esté funcionando.'
      };
    }
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obtener token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;