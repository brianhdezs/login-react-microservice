// Utilidades para manejo de autenticación - VERSIÓN CORREGIDA

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
  if (!user) return false;
  
  // Debug: log para ver qué contiene el usuario
  console.log('Checking role for user:', user);
  console.log('Looking for role:', role);
  
  // Verificar diferentes formas en que podría venir el rol
  // 1. En un array de roles
  if (user.roles && Array.isArray(user.roles)) {
    const hasRoleInArray = user.roles.includes(role);
    console.log('Role found in roles array:', hasRoleInArray);
    return hasRoleInArray;
  }
  
  // 2. En una propiedad role directa (como string)
  if (user.role) {
    const hasDirectRole = user.role === role;
    console.log('Role found in direct role property:', hasDirectRole);
    return hasDirectRole;
  }
  
  // 3. En una propiedad roles como string (por si acaso)
  if (user.roles && typeof user.roles === 'string') {
    const hasRoleAsString = user.roles === role;
    console.log('Role found as string:', hasRoleAsString);
    return hasRoleAsString;
  }
  
  console.log('No role found');
  return false;
};

export const isAdmin = (user) => {
  console.log('Checking if user is admin:', user);
  
  // Verificar múltiples variaciones de "ADMIN"
  const adminVariations = ['ADMIN', 'admin', 'Admin', 'ADMINISTRADOR', 'administrador'];
  
  for (const adminRole of adminVariations) {
    if (hasRole(user, adminRole)) {
      console.log(`User is admin with role: ${adminRole}`);
      return true;
    }
  }
  
  console.log('User is not admin');
  return false;
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