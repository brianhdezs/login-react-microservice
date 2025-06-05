import axios from 'axios';

// Configuración base de las APIs
const AUTH_API_BASE_URL = 'http://localhost:3001/api/auth';
const PRODUCT_API_BASE_URL = 'http://localhost:3003/api';

// Crear instancia de axios para Auth
const authApi = axios.create({
  baseURL: AUTH_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Crear instancia de axios principal (productos y otros servicios)
const api = axios.create({
  baseURL: PRODUCT_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT a todas las solicitudes
const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

// Interceptor para manejar errores de autenticación
const handleAuthError = (error) => {
  if (error.response && error.response.status === 401) {
    // Token expirado o inválido, redirigir al login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

// Aplicar interceptors a ambas instancias
authApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
authApi.interceptors.response.use((response) => response, handleAuthError);

api.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
api.interceptors.response.use((response) => response, handleAuthError);

// Exportar la instancia principal como default y authApi como named export
export { authApi };
export default api;