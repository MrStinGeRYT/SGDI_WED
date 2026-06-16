// src/services/api.js
// Cliente HTTP central para todas las llamadas al backend SGDI.
// Maneja: base URL, inyección de JWT, errores de red y 401 automático.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const TOKEN_KEY = 'sgdi_token'

// ── Token helpers ─────────────────────────────────────────────────────────────

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// ── Fetch wrapper ─────────────────────────────────────────────────────────────

/**
 * Realiza una petición autenticada al backend.
 * @param {string}  path    - Ruta relativa: '/auth/login', '/documents', etc.
 * @param {object}  options - Opciones fetch estándar + { auth: bool }
 * @returns {Promise<any>}  - JSON de respuesta o lanza error con { error, details }
 */
export async function request(path, { auth = true, ...options } = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }

  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  // 401: token expirado o inválido → limpiar sesión y recargar
  if (res.status === 401) {
    clearToken()
    window.location.href = '/'
    return
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(data.error || `Error ${res.status}`)
    err.status  = res.status
    err.details = data.details || []
    throw err
  }

  return data
}

/**
 * Sube un archivo via multipart/form-data.
 * No pone Content-Type — el browser lo pone automáticamente con el boundary.
 */
export async function upload(path, formData) {
  const token   = getToken()
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body:   formData,
  })

  if (res.status === 401) {
    clearToken()
    window.location.href = '/'
    return
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `Error ${res.status}`)
    err.status = res.status
    throw err
  }

  return data
}
