// src/modules/auth/auth.service.js
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../../config/prisma.js'
import { env } from '../../config/env.js'

/**
 * Valida credenciales y devuelve token + datos del usuario.
 */
export async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !user.active) {
    // Mismo mensaje para no revelar si el email existe
    throw Object.assign(new Error('Credenciales inválidas'), { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw Object.assign(new Error('Credenciales inválidas'), { status: 401 })
  }

  const token = jwt.sign(
    {
      sub:   user.id,
      name:  user.name,
      email: user.email,
      role:  user.role,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  )

  return {
    token,
    user: {
      id:    user.id,
      name:  user.name,
      email: user.email,
      role:  user.role,
    },
  }
}

/**
 * Devuelve los datos del usuario activo desde el DB.
 * (req.user ya viene del middleware verifyToken, pero verificamos que siga activo)
 */
export async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  })

  if (!user || !user.active) {
    throw Object.assign(new Error('Usuario no encontrado o inactivo'), { status: 404 })
  }

  return user
}
