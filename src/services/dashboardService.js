// ============================================================
// SGDI Web — dashboardService.js
// Conectado al backend real: GET /api/dashboard
// ============================================================

import { request } from './api.js'

/**
 * Devuelve las métricas y actividad reciente desde el backend real.
 * Normaliza al mismo formato que esperaba el mock (stats + recentActivity).
 */
export async function getDashboardSummary() {
  const data = await request('/dashboard')

  return {
    // La vista usa dashboardData.stats[card.key]
    stats: {
      totalDocuments:    data.documents?.total    ?? 0,
      activeTemplates:   data.templates           ?? 0,
      emailsSent:        0,   // Fase 2B: real cuando se conecte emailService
      pendingDocuments:  (data.documents?.draft ?? 0) + (data.documents?.review ?? 0),
    },

    // La vista usa dashboardData.recentActivity
    // El backend devuelve: { action, module, entityName, userName, timestamp }
    // La vista espera: { id, type, description, user, status, timestamp }
    recentActivity: (data.recentActivity || []).map((e, i) => ({
      id:          e.timestamp + i,
      type:        mapActionToType(e.action),
      description: `${e.action} — ${e.entityName || e.module}`,
      user:        e.userName,
      status:      'completed',
      timestamp:   e.timestamp,
    })),
  }
}

function mapActionToType(action = '') {
  if (action.includes('upload') || action.includes('subir'))  return 'upload'
  if (action.includes('email')  || action.includes('send'))   return 'email'
  if (action.includes('cloud'))                               return 'cloud'
  if (action.includes('create') || action.includes('crear'))  return 'create'
  if (action.includes('classify'))                            return 'classify'
  return 'create'
}

const dashboardService = { getDashboardSummary }
export default dashboardService
