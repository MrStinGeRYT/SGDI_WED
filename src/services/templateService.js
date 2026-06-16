// ============================================================
// SGDI Web — templateService.js
// Conectado al backend real: /api/templates
// templateSchemas.json se mantiene local (estático).
// ============================================================

import { request, upload } from './api.js'
import templateSchemas from '../data/templateSchemas.json'
import { auditService } from './auditService'

// ── Clasificador local (no toca el backend — lógica client-side) ──────────────

const TYPE_KEYWORDS = {
  oficio:      ['oficio', 'ofc', 'comunicado', 'designacion', 'asignacion'],
  constancia:  ['constancia', 'const', 'certificado', 'cert', 'certificacion'],
  memorandum:  ['memo', 'memorandum', 'memorándum', 'circular', 'convocatoria'],
  acta:        ['acta', 'minuta', 'acuerdo', 'reunion'],
  informe:     ['informe', 'reporte', 'report', 'avance', 'seguimiento'],
}

const GROUP_KEYWORDS = {
  tesis:       ['tesis', 'thesis', 'posgrado', 'graduacion', 'examen', 'titulacion'],
  jurados:     ['jurado', 'sinodal', 'asignacion', 'designacion'],
  comites:     ['comite', 'comité', 'consejo', 'etica', 'academico'],
  eventos:     ['evento', 'seminario', 'congreso', 'convocatoria', 'semana', 'fci'],
  seguimiento: ['seguimiento', 'proyecto', 'alfa', 'beta', 'avance', 'reporte'],
}

function normalizeText(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function scoreKeywords(text, keywordsMap) {
  const normalized = normalizeText(text)
  let best = { key: null, score: 0 }
  for (const [key, words] of Object.entries(keywordsMap)) {
    const score = words.filter(w => normalized.includes(w)).length
    if (score > best.score) best = { key, score }
  }
  return best
}

export function suggestClassification(fileName, title = '') {
  const combined    = `${fileName} ${title}`
  const typeResult  = scoreKeywords(combined, TYPE_KEYWORDS)
  const groupResult = scoreKeywords(combined, GROUP_KEYWORDS)
  const type        = typeResult.key  || 'oficio'
  const group       = groupResult.key || 'seguimiento'
  const confidence  = Math.min(100, 40 + (typeResult.score + groupResult.score) * 15)
  const reasons     = []
  if (typeResult.key)  reasons.push(`El nombre contiene palabras clave de tipo "${type}"`)
  if (groupResult.key) reasons.push(`El contenido sugiere el grupo funcional "${group}"`)
  if (reasons.length === 0) reasons.push('Clasificación basada en reglas generales del sistema')
  return { type, functionalGroup: group, confidence, reasons }
}

// ── API pública ───────────────────────────────────────────────────────────────

export async function getTemplates(filters = {}) {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.type)   params.set('type',   filters.type)
  if (filters.group)  params.set('group',  filters.group)
  // El frontend puede pedir 'active' o 'archived' — el backend espera 'ACTIVE'/'ARCHIVED'
  if (filters.status) params.set('status', filters.status.toUpperCase())

  const query = params.toString()
  const res   = await request(`/templates${query ? `?${query}` : ''}`)
  return res.data || []
}

export async function getTemplateById(id) {
  return request(`/templates/${id}`)
}

/**
 * Sube una nueva plantilla al backend.
 * @param {File}   file     - Objeto File del browser
 * @param {object} metadata - { title, type, functionalGroup, description, version, tags[] }
 */
export async function uploadTemplate(file, metadata) {
  const formData = new FormData()
  formData.append('file',  file)
  formData.append('title', metadata.title)
  formData.append('type',  metadata.type)
  if (metadata.description)     formData.append('description',     metadata.description)
  if (metadata.functionalGroup) formData.append('functionalGroup', metadata.functionalGroup)
  if (metadata.version)         formData.append('version',         metadata.version)
  if (metadata.tags?.length)    formData.append('tags',            metadata.tags.join(','))

  const tpl = await upload('/templates', formData)
  auditService.log('upload_template', tpl.title, tpl.id, 'Biblioteca')
  return tpl
}

export async function archiveTemplate(id) {
  const result = await request(`/templates/${id}/archive`, { method: 'PATCH' })
  auditService.log('archive_template', result.id, id, 'Biblioteca')
  return result
}

export async function deleteTemplate(id) {
  const result = await request(`/templates/${id}`, { method: 'DELETE' })
  auditService.log('delete_template', id, id, 'Biblioteca')
  return result
}

/**
 * Devuelve el schema de campos para un tipo documental.
 * Se mantiene como JSON local — no requiere backend.
 */
export async function getTemplateSchema(type) {
  return templateSchemas[type] || null
}

const templateService = {
  getTemplates, getTemplateById, uploadTemplate,
  archiveTemplate, deleteTemplate, suggestClassification,
  getTemplateSchema,
}
export default templateService
