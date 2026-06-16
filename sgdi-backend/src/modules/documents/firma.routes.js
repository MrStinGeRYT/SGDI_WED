// src/modules/documents/firma.routes.js
// Manejo de firma_imagen como archivo (multipart) — nunca base64 en BD
import { Router } from 'express'
import multer from 'multer'
import { verifyToken } from '../../middleware/auth.js'
import { uploadFile } from '../../storage/storage.service.js'
import prisma from '../../config/prisma.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5 MB máx para firma
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten imágenes: PNG, JPG, WEBP'))
    }
  },
})

const router = Router()
router.use(verifyToken)

/**
 * POST /api/documents/:id/firma-imagen
 * Sube la imagen de firma, guarda la URL en el documento y la devuelve.
 * Content-Type: multipart/form-data
 * Field: firma (imagen)
 */
router.post('/:id/firma-imagen', upload.single('firma'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Se requiere una imagen de firma (campo: firma)' })
    }

    // Verificar que el documento existe y pertenece al usuario (o es ADMIN)
    const doc = await prisma.document.findUnique({ where: { id: req.params.id } })
    if (!doc) {
      return res.status(404).json({ error: 'Documento no encontrado' })
    }
    if (doc.status === 'ARCHIVED') {
      return res.status(400).json({ error: 'No se puede modificar un documento archivado' })
    }

    // Subir archivo
    const firmaImgUrl = await uploadFile(req.file, 'firmas')

    // Actualizar el documento con la URL
    const updated = await prisma.document.update({
      where: { id: req.params.id },
      data: {
        firmaImgUrl,
        updatedById: req.user.id,
        updatedAt:   new Date(),
      },
      select: { id: true, firmaImgUrl: true, updatedAt: true },
    })

    res.json({
      message:     'Firma imagen actualizada correctamente',
      firmaImgUrl: updated.firmaImgUrl,
      documentId:  updated.id,
    })
  } catch (err) { next(err) }
})

export default router
