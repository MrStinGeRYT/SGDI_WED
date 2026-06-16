// src/modules/users/users.routes.js
// Fase 2A: CRUD básico de usuarios (solo ADMIN)
import { Router } from 'express'
import { verifyToken, requireRole } from '../../middleware/auth.js'
import * as usersController from './users.controller.js'

const router = Router()

router.use(verifyToken, requireRole('ADMIN'))

router.get('/',      usersController.list)
router.post('/',     usersController.create)
router.patch('/:id', usersController.update)

export default router
