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

  // Iniciar sesión - VERSIÓN CORREGIDA
  login: async (credentials) => {
    try {
      const response = await authApi.post('/login', credentials);
      
      console.log('Login response:', response.data); // Debug
      
      // Verificar si la respuesta es exitosa
      if (response.data.isSuccess && response.data.result) {
        const { user, token } = response.data.result;
        
        console.log('User data from server:', user); // Debug
        
        // Asegurarse de que el rol se incluya en el objeto usuario
        const userWithRole = {
          ...user,
          // Si el rol viene en 'roles' como string, también ponerlo en 'role'
          role: user.roles || user.role,
          // Si el rol viene en 'role', también ponerlo en 'roles' como array
          roles: user.roles ? (Array.isArray(user.roles) ? user.roles : [user.roles]) : (user.role ? [user.role] : [])
        };
        
        console.log('Processed user data:', userWithRole); // Debug
        
        // Guardar token y datos del usuario en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userWithRole));
        
        return {
          success: true,
          user: userWithRole,
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

  // Asignar rol a usuario - MÉTODO PARA USAR DIRECTAMENTE EN BASE DE DATOS
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

      console.log('Enviando payload para asignar rol:', payload); // Para debug

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

  // MÉTODO TEMPORAL PARA FORZAR ROL DE ADMIN
  forceAdminRole: () => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const adminUser = {
        ...currentUser,
        role: 'ADMIN',
        roles: ['ADMIN']
      };
      localStorage.setItem('user', JSON.stringify(adminUser));
      console.log('Forced admin role for user:', adminUser);
      return adminUser;
    }
    return null;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Obtener usuario actual - VERSIÓN MEJORADA
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('Current user from localStorage:', user); // Debug
        return user;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      }
    }
    return null;
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