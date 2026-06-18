// ============================================================
// SGDI Web — authService.js
// Conectado al backend real: POST /api/auth/login, GET /api/auth/me
// ============================================================

import { request, setToken, clearToken, getToken } from './api.js'

const SESSION_KEY = 'sgdi_session'

// ── Helpers de sesión ─────────────────────────────────────────────────────────

function saveSession(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

// ── API pública ───────────────────────────────────────────────────────────────

/**
 * Login con email (o nombre de usuario si no contiene @, intenta como email de la institución).
 * @returns {{ success: boolean, user: object|null, error: string|null }}
 */
export async function login(emailOrUsername, password) {
  try {
    // Si el usuario no escribió un @, asumirlo como email directo al backend
    // El backend valida si existe ese email — si el usuario no sabe su email puede poner "admin"
    // y fallaría con "credenciales inválidas" (mensaje correcto)
    const email = emailOrUsername.includes('@')
      ? emailOrUsername
      : emailOrUsername  // enviamos como está — el backend lo valida como email

    const data = await request('/auth/login', {
      method: 'POST',
      body:   JSON.stringify({ email, password }),
      auth:   false,
    })

    // Guardar JWT en localStorage
    setToken(data.token)

    // Normalizar usuario para que coincida con lo que espera el frontend
    const user = {
      id:         data.user.id,
      name:       data.user.name,
      email:      data.user.email,
      role:       data.user.role,
      // Campos extra que el frontend usa — derivados del backend
      username:   data.user.email.split('@')[0],
      initials:   data.user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      department: 'SGDI',
      loggedAt:   new Date().toISOString(),
    }

    saveSession(user)
    return { success: true, user, error: null }

  } catch (err) {
    return { success: false, user: null, error: err.message || 'Error al iniciar sesión' }
  }
}

/**
 * Cierra la sesión y limpia el token.
 */
export async function logout() {
  try {
    // Notificar al backend (simbólico — JWT es stateless)
    await request('/auth/logout', { method: 'POST' }).catch(() => {})
  } finally {
    clearToken()
    clearSession()
  }
}

/**
 * Devuelve el usuario de sesión almacenado localmente.
 */
export function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Verifica si existe una sesión activa con token válido.
 */
export function isAuthenticated() {
  return !!(getCurrentUser() && getToken())
}

/**
 * Refresca los datos del usuario desde el backend (GET /api/auth/me).
 * Actualiza la sesión local con los datos frescos.
 * Lanza si hay error de red u otro fallo — el caller decide el fallback.
 */
export async function refreshUser() {
  const data    = await request('/auth/me')
  const current = getCurrentUser()
  const merged  = { ...current, ...data }
  saveSession(merged)
  return merged
}
