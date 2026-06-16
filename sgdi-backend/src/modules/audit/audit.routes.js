// src/modules/audit/audit.routes.js
import { Router } from 'express'
import { verifyToken } from '../../middleware/auth.js'
import prisma from '../../config/prisma.js'

const router = Router()
router.use(verifyToken)

/** GET /api/audit?module=&userId=&from=&to= */
router.get('/', async (req, res, next) => {
  try {
    const { module: mod, userId, from, to, page = 1, limit = 50 } = req.query
    const where = {}
    if (mod)    where.module    = mod
    if (userId) where.userId    = userId
    if (from || to) {
      where.timestamp = {}
      if (from) where.timestamp.gte = new Date(from)
      if (to)   where.timestamp.lte = new Date(to)
    }

    const skip  = (Number(page) - 1) * Number(limit)
    const total = await prisma.auditLog.count({ where })
    const logs  = await prisma.auditLog.findMany({
      where,
      skip,
      take:    Number(limit),
      orderBy: { timestamp: 'desc' },
    })

    res.json({ data: logs, total, page: Number(page) })
  } catch (err) { next(err) }
})

/** POST /api/audit — para uso interno desde servicios */
router.post('/', async (req, res, next) => {
  try {
    const log = await prisma.auditLog.create({ data: req.body })
    res.status(201).json(log)
  } catch (err) { next(err) }
})

export default router
