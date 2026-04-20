// ============================================================
// SGDI Web — auditService.js
// Servicio de bitácora/auditoría mock.
// Registra acciones del usuario en memoria y en el log base.
// ============================================================

import baseLog from '../data/mockAuditLog.json';
import { getCurrentUser } from './userService';

let _log = [...baseLog];

const ACTION_LABELS = {
  upload_template:  'Subió plantilla',
  edit_template:    'Editó plantilla',
  archive_template: 'Archivó plantilla',
  delete_template:  'Eliminó plantilla',
  classify_template:'Clasificó plantilla',
  create_document:  'Creó documento',
  edit_document:    'Editó documento',
  archive_document: 'Archivó documento',
  upload_cloud:     'Subió a la nube',
  send_email:       'Envió correo',
  login:            'Inició sesión',
  logout:           'Cerró sesión',
};

function logAction(action, target, targetId, module = 'Sistema') {
  const user = getCurrentUser();
  const entry = {
    id:          `log_${Date.now()}`,
    userId:      user?.id   || 'sys',
    userName:    user?.name || 'Sistema',
    userRole:    user?.role || '',
    action,
    actionLabel: ACTION_LABELS[action] || action,
    module,
    target,
    targetId,
    status:      'success',
    timestamp:   new Date().toISOString(),
  };
  _log = [entry, ..._log];
  return entry;
}

function getLog(filters = {}) {
  let result = [..._log];
  if (filters.userId)  result = result.filter((e) => e.userId === filters.userId);
  if (filters.module)  result = result.filter((e) => e.module === filters.module);
  if (filters.action)  result = result.filter((e) => e.action === filters.action);
  return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export const auditService = { log: logAction, getLog };
export default auditService;
