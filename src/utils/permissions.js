// ============================================================
// SGDI Web — Permissions
// Tabla de permisos mock por rol de usuario.
// Cuando exista backend real, esta lógica se conectará
// a los permisos devueltos por la API.
// ============================================================

// ── Tabla de permisos por rol ──────────────────────────────
const ROLE_PERMISSIONS = {
  'Administrador': [
    'template.upload', 'template.edit', 'template.archive',
    'template.delete', 'template.classify', 'template.view',
    'document.create', 'document.edit', 'document.archive',
    'document.delete', 'document.send', 'document.upload_cloud',
    'document.view',
    'email.send', 'email.view',
    'audit.view',
    'config.edit',
  ],
  'Coordinadora Académica': [
    'template.upload', 'template.edit', 'template.classify', 'template.view',
    'document.create', 'document.edit', 'document.view', 'document.upload_cloud',
    'email.send', 'email.view',
    'audit.view',
  ],
  'Responsable Documental': [
    'template.upload', 'template.archive', 'template.classify', 'template.view',
    'document.create', 'document.view', 'document.archive',
    'email.view',
    'audit.view',
  ],
  'Asistente Administrativo': [
    'template.view',
    'document.create', 'document.view',
    'email.send', 'email.view',
  ],
  'Editor Institucional': [
    'template.edit', 'template.view',
    'document.edit', 'document.view', 'document.create',
    'email.view',
  ],
};

/**
 * Verifica si un usuario tiene un permiso específico.
 * @param {object|null} user  - Objeto de sesión { role, ... }
 * @param {string}      permission - Ej: 'template.archive'
 * @returns {boolean}
 */
export function can(user, permission) {
  if (!user?.role) return false;
  const perms = ROLE_PERMISSIONS[user.role] || [];
  return perms.includes(permission);
}

/**
 * Devuelve todos los permisos del usuario actual.
 * @param {object|null} user
 * @returns {string[]}
 */
export function getPermissions(user) {
  if (!user?.role) return [];
  return ROLE_PERMISSIONS[user.role] || [];
}

export { ROLE_PERMISSIONS };
