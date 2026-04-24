// ============================================================
// SGDI Web — dashboardService.js
// Capa de acceso a datos del Dashboard (mock).
// Mock: lee de mockDashboard.json. Listo para reemplazar con HTTP.
// ============================================================

import mockDashboard from '../data/mockDashboard.json';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Devuelve las métricas y la actividad reciente del sistema.
 * En Fase 2 este método realizará GET /api/dashboard/summary.
 */
export async function getDashboardSummary() {
  await delay(0); // sin retardo intencional — datos críticos para la vista inicial
  return { ...mockDashboard };
}

const dashboardService = { getDashboardSummary };
export default dashboardService;
