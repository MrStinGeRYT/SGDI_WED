// ============================================================
// SGDI Web — usePermissions Hook
// Consume el usuario de sesión y expone la función can()
// ============================================================

import { useAuth } from '../context/AuthContext';
import { can, getPermissions } from '../utils/permissions';

export function usePermissions() {
  const { user } = useAuth();

  return {
    /**
     * Verifica si el usuario actual puede realizar una acción.
     * @param {string} permission - Ej: 'template.archive'
     * @returns {boolean}
     */
    can: (permission) => can(user, permission),

    /**
     * Lista completa de permisos del usuario actual.
     */
    permissions: getPermissions(user),

    /**
     * Mensaje estándar para mostrar cuando no hay permiso.
     */
    noPermissionMsg: 'No tienes permisos para realizar esta acción',
  };
}
