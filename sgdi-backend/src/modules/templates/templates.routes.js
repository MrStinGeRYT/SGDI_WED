// src/modules/templates/templates.routes.js
import { Router } from 'express'
import multer from 'multer'
import { verifyToken, requireRole } from '../../middleware/auth.js'
import { list, getById, create, archive, remove } from './templates.controller.js'

// multer en memoria: el buffer pasa a storage.service.js
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 20 * 1024 * 1024 }, // 20 MB máx
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ]
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Tipo de archivo no permitido. Use .docx, .doc, .pdf o .xlsx'))
    }
  },
})

const router = Router()
router.use(verifyToken)

router.get('/',              list)
router.get('/:id',           getById)

// Upload requiere ADMIN o EDITOR
router.post('/',             requireRole('ADMIN', 'EDITOR'), upload.single('file'), create)
router.patch('/:id/archive', requireRole('ADMIN', 'EDITOR'), archive)
router.delete('/:id',        requireRole('ADMIN'), remove)

export default router
