// ============================================================
// SGDI Web — userService.js
// Capa de acceso a datos de Usuarios (mock).
// ============================================================

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

export function getAllUsers() {
  return [...mockUsers];
}

const userService = { getCurrentUser, getUserById, getUsersByRole, getAllUsers };
export default userService;
