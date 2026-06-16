// src/middleware/auth.js — Verificación de JWT y control de roles
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

/**
 * Verifica que la petición tenga un JWT válido.
 * Inyecta `req.user = { id, name, email, role }` si es válido.
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticación requerido' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, env.JWT_SECRET)
    req.user = {
      id:    payload.sub,
      name:  payload.name,
      email: payload.email,
      role:  payload.role,
    }
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Vuelve a iniciar sesión.' })
    }
    return res.status(401).json({ error: 'Token inválido' })
  }
}

/**
 * Verifica que req.user tenga uno de los roles permitidos.
 * Usar después de verifyToken.
 * @param  {...string} roles - roles permitidos: 'ADMIN', 'EDITOR', 'VIEWER'
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}`,
      })
    }
    next()
  }
}
