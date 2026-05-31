export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  IT_ADMIN: 'IT_ADMIN',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
};

export const hasRole = (user, role) => {
  return user?.role === role;
};

export const isAdmin = (user) => {
  return user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.IT_ADMIN;
};

export const isSuperAdmin = (user) => {
  return user?.role === ROLES.SUPER_ADMIN;
};