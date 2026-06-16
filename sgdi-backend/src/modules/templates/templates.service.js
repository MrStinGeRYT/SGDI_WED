// src/modules/templates/templates.service.js
import prisma from '../../config/prisma.js'
import { uploadFile, deleteFile } from '../../storage/storage.service.js'

/**
 * Lista plantillas con filtros opcionales.
 */
export async function getTemplates({ search, type, group, status = 'ACTIVE', page = 1, limit = 20 }) {
  const where = { status }

  if (search) where.title = { contains: search }
  if (type)   where.type  = type
  if (group)  where.functionalGroup = group

  const skip  = (page - 1) * limit
  const total = await prisma.template.count({ where })

  const templates = await prisma.template.findMany({
    where,
    skip,
    take:    limit,
    orderBy: { createdAt: 'desc' },
    include: {
      uploadedBy: { select: { id: true, name: true, email: true } },
    },
  })

  return {
    data: templates.map(t => ({
      ...t,
      tags: t.tags ? JSON.parse(t.tags) : [],
    })),
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  }
}

/**
 * Obtiene una plantilla por ID.
 */
export async function getTemplateById(id) {
  const tpl = await prisma.template.findUnique({
    where: { id },
    include: { uploadedBy: { select: { id: true, name: true, email: true } } },
  })
  if (!tpl) throw Object.assign(new Error('Plantilla no encontrada'), { status: 404 })
  return { ...tpl, tags: tpl.tags ? JSON.parse(tpl.tags) : [] }
}

/**
 * Crea una plantilla nueva con el archivo subido via multer.
 */
export async function createTemplate({ file, metadata, userId }) {
  // Subir archivo al storage configurado
  const fileUrl = await uploadFile(file, 'templates')

  const tpl = await prisma.template.create({
    data: {
      title:           metadata.title,
      description:     metadata.description || null,
      type:            metadata.type,
      functionalGroup: metadata.functionalGroup || null,
      tags:            metadata.tags ? JSON.stringify(
                         Array.isArray(metadata.tags)
                           ? metadata.tags
                           : metadata.tags.split(',').map(t => t.trim())
                       ) : null,
      status:          'ACTIVE',
      version:         metadata.version || '1.0',
      fileName:        file.originalname,
      fileUrl,
      uploadedById:    userId,
    },
    include: { uploadedBy: { select: { id: true, name: true, email: true } } },
  })

  return { ...tpl, tags: tpl.tags ? JSON.parse(tpl.tags) : [] }
}

/**
 * Archiva una plantilla (status = ARCHIVED).
 */
export async function archiveTemplate(id) {
  const existing = await prisma.template.findUnique({ where: { id } })
  if (!existing) throw Object.assign(new Error('Plantilla no encontrada'), { status: 404 })

  return prisma.template.update({
    where: { id },
    data:  { status: 'ARCHIVED' },
    select: { id: true, status: true, updatedAt: true },
  })
}

/**
 * Elimina una plantilla y su archivo del storage.
 */
export async function deleteTemplate(id) {
  const existing = await prisma.template.findUnique({ where: { id } })
  if (!existing) throw Object.assign(new Error('Plantilla no encontrada'), { status: 404 })

  // Eliminar archivo del storage
  await deleteFile(existing.fileUrl)

  await prisma.template.delete({ where: { id } })
  return { deleted: true, id }
}
