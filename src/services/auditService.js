// ============================================================
// SGDI Web — auditService.js
// Conectado al backend real: GET /api/audit, POST /api/audit
//
// ESTRATEGIA: log() es fire-and-forget (síncrono para el caller).
// Registra en memoria local Y envía al backend en paralelo.
// Así la bitácora del frontend es instantánea y no bloquea operaciones.
// ============================================================

import { request, getToken } from './api.js'
import { getCurrentUser } from './userService'

const ACTION_LABELS = {
  upload_template:   'Subió plantilla',
  edit_template:     'Editó plantilla',
  archive_template:  'Archivó plantilla',
  delete_template:   'Eliminó plantilla',
  classify_template: 'Clasificó plantilla',
  create_document:   'Creó documento',
  edit_document:     'Editó documento',
  archive_document:  'Archivó documento',
  upload_cloud:      'Subió a la nube',
  send_email:        'Envió correo',
  login:             'Inició sesión',
  logout:            'Cerró sesión',
}

// ── Cache local (para la vista de bitácora sin esperar fetch) ─────────────────
let _localLog = []

/**
 * Registra una acción.
 * - Es síncrono (fire-and-forget) — no bloquea al caller.
 * - Persiste en backend via POST /api/audit en segundo plano.
 */
function logAction(action, target, targetId, module = 'Sistema') {
  const user = getCurrentUser()

  const entry = {
    id:          `log_${Date.now()}`,
    userId:      user?.id   || 'anon',
    userName:    user?.name || 'Sistema',
    userRole:    user?.role || '',
    action,
    actionLabel: ACTION_LABELS[action] || action,
    module,
    target,
    targetId,
    entityName:  target,
    entityId:    targetId,
    status:      'success',
    timestamp:   new Date().toISOString(),
  }

  // Agregar al log local inmediatamente
  _localLog = [entry, ..._localLog]

  // Enviar al backend en segundo plano (sin await)
  if (getToken()) {
    request('/audit', {
      method: 'POST',
      body:   JSON.stringify({
        action,
        module,
        entityId:   targetId ? String(targetId) : null,
        entityName: target   ? String(target)   : null,
        userId:     user?.id   || 'anon',
        userName:   user?.name || 'Sistema',
        userRole:   user?.role || '',
      }),
    }).catch(() => {
      // Silencioso — el log local ya existe, el backend fallará sin romper la UI
    })
  }

  return entry
}

/**
 * Obtiene el log de auditoría.
 * Si hay token activo, consulta el backend.
 * Si no, devuelve el log local en memoria.
 */
async function getLog(filters = {}) {
  if (!getToken()) {
    // Sin token: solo log local
    return filterLocal(filters)
  }

  try {
    const params = new URLSearchParams()
    if (filters.userId) params.set('userId', filters.userId)
    if (filters.module) params.set('module', filters.module)
    if (filters.from)   params.set('from',   filters.from)
    if (filters.to)     params.set('to',     filters.to)
    params.set('limit', '100')

    const query = params.toString()
    const res   = await request(`/audit${query ? `?${query}` : ''}`)

    // Normalizar respuesta para que la vista de bitácora funcione igual
    return (res.data || []).map(e => ({
      id:          e.id,
      userId:      e.userId,
      userName:    e.userName,
      userRole:    e.userRole,
      action:      e.action,
      actionLabel: ACTION_LABELS[e.action] || e.action,
      module:      e.module,
      target:      e.entityName || '',
      targetId:    e.entityId   || '',
      timestamp:   e.timestamp,
      status:      'success',
    }))
  } catch {
    // Fallback al log local si el backend falla
    return filterLocal(filters)
  }
}

function filterLocal(filters = {}) {
  let result = [..._localLog]
  if (filters.userId) result = result.filter(e => e.userId === filters.userId)
  if (filters.module) result = result.filter(e => e.module === filters.module)
  if (filters.action) result = result.filter(e => e.action === filters.action)
  return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export const auditService = { log: logAction, getLog }
export default auditService
