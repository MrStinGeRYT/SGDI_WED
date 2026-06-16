// src/middleware/errorHandler.js — Handler global de errores
export function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message)

  // Error de validación Zod (v3 usa .issues)
  if (err.name === 'ZodError' || err.issues) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: (err.issues || err.errors || []).map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
  }

  // Error de Prisma — registro no encontrado
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Registro no encontrado' })
  }

  // Error de Prisma — constraint único violado
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Ya existe un registro con ese valor único' })
  }

  const status  = err.status  || err.statusCode || 500
  const message = err.message || 'Error interno del servidor'

  res.status(status).json({ error: message })
}
