// src/modules/auth/auth.controller.js
import { z } from 'zod'
import * as authService from './auth.service.js'

const loginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const result = await authService.login(email, password)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/auth/me
 * Requiere token válido (middleware verifyToken)
 */
export async function me(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id)
    res.json(user)
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/logout
 * El token es stateless — el cliente debe descartarlo.
 * Este endpoint confirma la acción en el servidor sin más.
 */
export function logout(_req, res) {
  res.json({ message: 'Sesión cerrada. Descarta el token en el cliente.' })
}
