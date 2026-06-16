// src/modules/emails/emails.routes.js — Stub Fase 2A
// Integración real con MS365 Graph en Fase 2B
import { Router } from 'express'
import { verifyToken } from '../../middleware/auth.js'

const router = Router()
router.use(verifyToken)

router.get('/',      (_req, res) => res.json({ data: [], message: 'Emails — implementación pendiente (Fase 2B)' }))
router.post('/send', (_req, res) => res.status(501).json({ message: 'Envío de email — pendiente. Fase 2B: integración MS365 Graph' }))

export default router
