// src/modules/users/users.controller.js
import { z } from 'zod'
import bcrypt from 'bcrypt'
import prisma from '../../config/prisma.js'

const createSchema = z.object({
  name:     z.string().min(1),
  email:    z.string().email(),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  role:     z.enum(['ADMIN', 'EDITOR', 'VIEWER']).default('VIEWER'),
})

const updateSchema = z.object({
  name:   z.string().min(1).optional(),
  role:   z.enum(['ADMIN', 'EDITOR', 'VIEWER']).optional(),
  active: z.boolean().optional(),
})

/** GET /api/users */
export async function list(_req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(users)
  } catch (err) { next(err) }
}

/** POST /api/users */
export async function create(req, res, next) {
  try {
    const body     = createSchema.parse(req.body)
    const hashed   = await bcrypt.hash(body.password, 12)
    const user     = await prisma.user.create({
      data: { ...body, password: hashed },
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    })
    res.status(201).json(user)
  } catch (err) { next(err) }
}

/** PATCH /api/users/:id */
export async function update(req, res, next) {
  try {
    const body = updateSchema.parse(req.body)
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data:  body,
      select: { id: true, name: true, email: true, role: true, active: true, updatedAt: true },
    })
    res.json(user)
  } catch (err) { next(err) }
}
