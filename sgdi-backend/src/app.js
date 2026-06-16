// src/app.js — Express setup y registro de rutas
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'

// Rutas
import authRoutes from './modules/auth/auth.routes.js'
import usersRoutes from './modules/users/users.routes.js'
import documentsRoutes from './modules/documents/documents.routes.js'
import templatesRoutes from './modules/templates/templates.routes.js'
import auditRoutes from './modules/audit/audit.routes.js'
import dashboardRoutes from './modules/dashboard/dashboard.routes.js'
import emailsRoutes from './modules/emails/emails.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// ── Middleware global ─────────────────────────────────────────────────────────
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))

// Servir archivos subidos (dev únicamente)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '2A', env: env.NODE_ENV })
})

// ── Rutas de la API ───────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/users',     usersRoutes)
app.use('/api/documents', documentsRoutes)
app.use('/api/templates', templatesRoutes)
app.use('/api/audit',     auditRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/emails',    emailsRoutes)

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// ── Error handler global ─────────────────────────────────────────────────────
app.use(errorHandler)

export default app
