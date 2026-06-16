// src/modules/dashboard/dashboard.routes.js
import { Router } from 'express'
import { verifyToken } from '../../middleware/auth.js'
import prisma from '../../config/prisma.js'

const router = Router()
router.use(verifyToken)

/** GET /api/dashboard — estadísticas agregadas */
router.get('/', async (_req, res, next) => {
  try {
    const [
      totalDocuments,
      totalTemplates,
      totalUsers,
      docsByStatus,
      recentActivity,
    ] = await Promise.all([
      prisma.document.count(),
      prisma.template.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { active: true } }),
      prisma.document.groupBy({ by: ['status'], _count: { status: true } }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { timestamp: 'desc' },
        select: { action: true, module: true, entityName: true, userName: true, timestamp: true },
      }),
    ])

    const statusMap = Object.fromEntries(
      docsByStatus.map(s => [s.status, s._count.status])
    )

    res.json({
      documents: {
        total:    totalDocuments,
        draft:    statusMap['DRAFT']    || 0,
        review:   statusMap['REVIEW']   || 0,
        signed:   statusMap['SIGNED']   || 0,
        archived: statusMap['ARCHIVED'] || 0,
      },
      templates:      totalTemplates,
      activeUsers:    totalUsers,
      recentActivity,
    })
  } catch (err) { next(err) }
})

export default router
