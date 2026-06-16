// src/modules/documents/documents.routes.js
import { Router } from 'express'
import { list, getById, create, update, archive } from './documents.controller.js'
import { verifyToken } from '../../middleware/auth.js'
import firmaRouter from './firma.routes.js'

const router = Router()

// Todas las rutas de documentos requieren autenticación
router.use(verifyToken)

router.get('/',              list)
router.post('/',             create)
router.get('/:id',           getById)
router.patch('/:id',         update)
router.patch('/:id/archive', archive)

// firma-imagen — multipart/form-data, real
router.use('/', firmaRouter)

// Stub: exportación — Fase 2B
router.get('/:id/export', (_req, res) => {
  res.status(501).json({ message: 'Exportación — implementación pendiente (Fase 2B)' })
})

export default router
