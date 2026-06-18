// ============================================================
// SGDI Web — userService.js
// Capa de acceso a datos de Usuarios.
// getAllUsers → GET /api/users (requiere token ADMIN).
// Resto de helpers síncronos: sessionStorage / mock local.
// ============================================================

import { request, getToken } from './api.js'
import mockUsers from '../data/mockUsers.json';

const SESSION_KEY = 'sgdi_session';

export function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getUserById(id) {
  return mockUsers.find((u) => u.id === id) || null;
}

export function getUsersByRole(role) {
  return mockUsers.filter((u) => u.role === role);
}

/**
 * Obtiene todos los usuarios.
 * Si hay token, consulta GET /api/users (solo ADMIN).
 * Fallback al mock local si no hay token o el request falla.
 */
export async function getAllUsers() {
  if (!getToken()) return [...mockUsers];
  try {
    const data = await request('/users');
    // El backend devuelve un array directo (sin wrapper .data)
    return Array.isArray(data) ? data : (data.data ?? [...mockUsers]);
  } catch {
    return [...mockUsers];
  }
}

const userService = { getCurrentUser, getUserById, getUsersByRole, getAllUsers };
export default userService;
