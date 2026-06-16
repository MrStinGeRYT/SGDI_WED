// src/modules/auth/auth.routes.js
import { Router } from 'express'
import { login, me, logout } from './auth.controller.js'
import { verifyToken } from '../../middleware/auth.js'

const router = Router()

// POST /api/auth/login — pública
router.post('/login', login)

// GET /api/auth/me — requiere token
router.get('/me', verifyToken, me)

// POST /api/auth/logout — requiere token (simbólico, el cliente descarta el JWT)
router.post('/logout', verifyToken, logout)

export default router
