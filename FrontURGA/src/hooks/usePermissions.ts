import { useAuth } from './useAuth';

export function usePermissions() {
  const { user } = useAuth();

  const role = user?.role;
  const isAdmin = role === 'Administrador' || role === 'Admin';
  const isComum = role === 'Usuário';
  const canManageUsers = isAdmin;
  const canEditPrivilegedFields = !isComum;

  return {
    role,
    isAdmin,
    isComum,
    canManageUsers,
    canEditPrivilegedFields,
    hasValidRole: isComum || isAdmin,
  };
}
