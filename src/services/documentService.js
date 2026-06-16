// ============================================================
// SGDI Web — documentService.js
// Conectado al backend real: /api/documents
// ============================================================

import { request, upload } from './api.js'
import { auditService } from './auditService'

// ── Normalización ─────────────────────────────────────────────────────────────
// El backend devuelve status en inglés (DRAFT, ARCHIVED, etc.).
// El frontend usa español (borrador, archivado, etc.) en algunos lugares.
// Centralizamos la conversión aquí para no tocar las vistas.

const STATUS_MAP = {
  DRAFT:    'borrador',
  REVIEW:   'revision',
  SIGNED:   'firmado',
  ARCHIVED: 'archivado',
}

const STATUS_REVERSE = Object.fromEntries(
  Object.entries(STATUS_MAP).map(([k, v]) => [v, k])
)

function normalizeDoc(doc) {
  if (!doc) return doc
  return {
    ...doc,
    status: STATUS_MAP[doc.status] || doc.status,
    // Campos que el frontend puede esperar
    createdByName: doc.createdBy?.name || '',
    createdByRole: doc.createdBy?.role || '',
    updatedByName: doc.updatedBy?.name || '',
    fields:        doc.fields || {},
  }
}

function denormalizeStatus(status) {
  return STATUS_REVERSE[status] || status
}

// ── API pública ───────────────────────────────────────────────────────────────

export async function getDocuments(filters = {}) {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.status) params.set('status', denormalizeStatus(filters.status))
  if (filters.type)   params.set('type',   filters.type)
  if (filters.page)   params.set('page',   filters.page)

  const query    = params.toString()
  const response = await request(`/documents${query ? `?${query}` : ''}`)
  return (response.data || []).map(normalizeDoc)
}

export async function getDocumentById(id) {
  const doc = await request(`/documents/${id}`)
  return normalizeDoc(doc)
}

export async function createDocument(metadata) {
  const doc = await request('/documents', {
    method: 'POST',
    body:   JSON.stringify({
      title:           metadata.title,
      type:            metadata.type,
      fields:          metadata.fields || {},
    }),
  })
  const normalized = normalizeDoc(doc)
  auditService.log('create_document', normalized.title, normalized.id, 'Documentos')
  return normalized
}

export async function updateDocument(id, changes) {
  // Separar firmaImgUrl si viene como base64 (legado) — no enviarla al backend
  const { fields, firmaTexto, firmaImgUrl, status, title, type, ...rest } = changes

  const body = {}
  if (fields     !== undefined) body.fields     = fields
  if (firmaTexto !== undefined) body.firmaTexto  = firmaTexto
  if (status     !== undefined) body.status      = denormalizeStatus(status)
  if (title      !== undefined) body.title       = title
  if (type       !== undefined) body.type        = type

  // firmaImgUrl: solo pasar si viene del storage (URL de servidor), no base64
  if (firmaImgUrl && !firmaImgUrl.startsWith('data:')) {
    body.firmaImgUrl = firmaImgUrl
  }

  const doc = await request(`/documents/${id}`, {
    method: 'PATCH',
    body:   JSON.stringify(body),
  })
  const normalized = normalizeDoc(doc)
  auditService.log('edit_document', normalized.title, id, 'Documentos')
  return normalized
}

/**
 * Sube la imagen de firma de un documento.
 * @param {string} id      - ID del documento
 * @param {File}   file    - Objeto File (imagen)
 * @returns {{ firmaImgUrl: string }}
 */
export async function uploadFirmaImagen(id, file) {
  const formData = new FormData()
  formData.append('firma', file)
  return upload(`/documents/${id}/firma-imagen`, formData)
}

export async function archiveDocument(id) {
  const result = await request(`/documents/${id}/archive`, { method: 'PATCH' })
  auditService.log('archive_document', result.id, id, 'Documentos')
  return result
}

export async function uploadToCloud(id) {
  // Stub hasta Fase 2B — actualiza cloudStatus localmente
  const doc = await request(`/documents/${id}`, {
    method: 'PATCH',
    body:   JSON.stringify({ cloudStatus: 'synced' }),
  })
  auditService.log('upload_cloud', id, id, 'Documentos')
  return normalizeDoc(doc)
}

export async function sendDocumentByEmail(id) {
  // Stub hasta Fase 2B (MS365 Graph)
  const doc = await request(`/documents/${id}`, {
    method: 'PATCH',
    body:   JSON.stringify({ emailStatus: 'sent', status: 'SIGNED' }),
  })
  return normalizeDoc(doc)
}

const documentService = {
  getDocuments, getDocumentById, createDocument,
  updateDocument, uploadToCloud, sendDocumentByEmail,
  archiveDocument, uploadFirmaImagen,
}
export default documentService
