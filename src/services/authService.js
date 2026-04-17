// ============================================================
// SGDI Web — Auth Service (Mock)
// Servicio de autenticación simulado — listo para reemplazar
// con Azure AD / SSO / API real en fases posteriores.
// ============================================================

import mockUsers from '../data/mockUsers.json';

const SESSION_KEY = 'sgdi_session';

/**
 * Simula un login con credenciales.
 * @returns {{ success: boolean, user: object|null, error: string|null }}
 */
export async function login(username, password) {
  // Simula latencia de red
  await delay(600);

  const user = mockUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return { success: false, user: null, error: 'Usuario o contraseña incorrectos.' };
  }

  // Guarda sesión en sessionStorage (mock)
  const session = {
    id:         user.id,
    name:       user.name,
    role:       user.role,
    department: user.department,
    email:      user.email,
    initials:   user.initials,
    loggedAt:   new Date().toISOString(),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true, user: session, error: null };
}

/**
 * Cierra la sesión actual.
 */
export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Devuelve el usuario de sesión actual, o null si no hay sesión.
 */
export function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Verifica si existe una sesión activa.
 */
export function isAuthenticated() {
  return !!getCurrentUser();
}

// ── Helper interno ──
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
