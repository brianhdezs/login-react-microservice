// Utilidades para manejo de autenticación

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const getUserFromToken = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      roles: payload.roles || []
    };
  } catch (error) {
    return null;
  }
};

export const hasRole = (user, role) => {
  return user?.roles?.includes(role) || false;
};

export const isAdmin = (user) => {
  return hasRole(user, 'ADMIN');
};

export const formatUserName = (user) => {
  if (!user) return '';
  return user.name || user.email || 'Usuario';
};

export const getUserInitials = (user) => {
  if (!user) return 'U';
  
  if (user.name) {
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }
  
  return user.email ? user.email[0].toUpperCase() : 'U';
};