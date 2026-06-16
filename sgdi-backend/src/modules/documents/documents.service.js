// src/modules/documents/documents.service.js
import prisma from '../../config/prisma.js'

const ALLOWED_STATUSES = ['DRAFT', 'REVIEW', 'SIGNED', 'ARCHIVED']

/**
 * Lista documentos con filtros opcionales.
 */
export async function getDocuments({ search, type, status, page = 1, limit = 20 }) {
  const where = {}

  if (search) {
    where.title = { contains: search }
  }
  if (type)   where.type = type
  if (status) where.status = status

  const skip  = (page - 1) * limit
  const total = await prisma.document.count({ where })

  const documents = await prisma.document.findMany({
    where,
    skip,
    take: limit,
    orderBy: { updatedAt: 'desc' },
    select: {
      id:          true,
      title:       true,
      type:        true,
      status:      true,
      firmaImgUrl: true,
      cloudStatus: true,
      emailStatus: true,
      createdAt:   true,
      updatedAt:   true,
      createdBy: {
        select: { id: true, name: true, email: true }
      },
    },
  })

  return { data: documents, total, page, limit, pages: Math.ceil(total / limit) }
}

/**
 * Obtiene un documento por ID con todos sus campos.
 */
export async function getDocumentById(id) {
  const doc = await prisma.document.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true, email: true, role: true } },
      updatedBy: { select: { id: true, name: true, email: true, role: true } },
    },
  })

  if (!doc) {
    throw Object.assign(new Error('Documento no encontrado'), { status: 404 })
  }

  // Deserializar fields
  return {
    ...doc,
    fields: JSON.parse(doc.fields || '{}'),
  }
}

/**
 * Crea un nuevo documento en estado DRAFT.
 */
export async function createDocument({ title, type, fields = {}, userId }) {
  const doc = await prisma.document.create({
    data: {
      title,
      type,
      status:      'DRAFT',
      fields:      JSON.stringify(fields),
      createdById: userId,
    },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
    },
  })

  return { ...doc, fields: JSON.parse(doc.fields) }
}

/**
 * Actualiza campos de un documento.
 * Permite actualizar: title, type, status, fields, firmaTexto, firmaImgUrl, cloudStatus, emailStatus
 */
export async function updateDocument(id, data, userId) {
  // Verificar que existe
  const existing = await prisma.document.findUnique({ where: { id } })
  if (!existing) {
    throw Object.assign(new Error('Documento no encontrado'), { status: 404 })
  }

  if (existing.status === 'ARCHIVED') {
    throw Object.assign(new Error('No se puede editar un documento archivado'), { status: 400 })
  }

  if (data.status && !ALLOWED_STATUSES.includes(data.status)) {
    throw Object.assign(new Error(`Estado inválido: ${data.status}`), { status: 400 })
  }

  const updateData = {
    updatedById: userId,
    updatedAt:   new Date(),
  }

  if (data.title       !== undefined) updateData.title       = data.title
  if (data.type        !== undefined) updateData.type        = data.type
  if (data.status      !== undefined) updateData.status      = data.status
  if (data.firmaTexto  !== undefined) updateData.firmaTexto  = data.firmaTexto
  if (data.firmaImgUrl !== undefined) updateData.firmaImgUrl = data.firmaImgUrl
  if (data.cloudStatus !== undefined) updateData.cloudStatus = data.cloudStatus
  if (data.emailStatus !== undefined) updateData.emailStatus = data.emailStatus

  // Merge de fields: mezclar con los existentes si se envían campos parciales
  if (data.fields !== undefined) {
    const current = JSON.parse(existing.fields || '{}')
    updateData.fields = JSON.stringify({ ...current, ...data.fields })
  }

  const updated = await prisma.document.update({
    where: { id },
    data:  updateData,
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      updatedBy: { select: { id: true, name: true, email: true } },
    },
  })

  return { ...updated, fields: JSON.parse(updated.fields) }
}

/**
 * Archiva un documento (status = ARCHIVED).
 */
export async function archiveDocument(id, userId) {
  const existing = await prisma.document.findUnique({ where: { id } })
  if (!existing) {
    throw Object.assign(new Error('Documento no encontrado'), { status: 404 })
  }

  if (existing.status === 'ARCHIVED') {
    throw Object.assign(new Error('El documento ya está archivado'), { status: 400 })
  }

  const archived = await prisma.document.update({
    where: { id },
    data: {
      status:      'ARCHIVED',
      updatedById: userId,
    },
  })

  return { id: archived.id, status: archived.status, updatedAt: archived.updatedAt }
}
