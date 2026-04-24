// ============================================================
// SGDI Web — templateService.js
// Capa de acceso a datos de Plantillas.
// Mock: lee de JSON estático. Listo para reemplazar con HTTP.
// ============================================================

import mockTemplates    from '../data/mockTemplates.json';
import templateSchemas  from '../data/templateSchemas.json';
import { auditService } from './auditService';
import { getCurrentUser } from './userService';

let _templates = [...mockTemplates]; // estado local en memoria

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Clasificador local mock ────────────────────────────────

const TYPE_KEYWORDS = {
  oficio:      ['oficio', 'ofc', 'comunicado', 'designacion', 'asignacion'],
  constancia:  ['constancia', 'const', 'certificado', 'cert', 'certificacion'],
  memorandum:  ['memo', 'memorandum', 'memorándum', 'circular', 'convocatoria'],
  acta:        ['acta', 'minuta', 'acuerdo', 'reunion'],
  informe:     ['informe', 'reporte', 'report', 'avance', 'seguimiento'],
};

const GROUP_KEYWORDS = {
  tesis:       ['tesis', 'thesis', 'posgrado', 'graduacion', 'examen', 'titulacion'],
  jurados:     ['jurado', 'sinodal', 'asignacion', 'designacion'],
  comites:     ['comite', 'comité', 'consejo', 'etica', 'academico'],
  eventos:     ['evento', 'seminario', 'congreso', 'convocatoria', 'semana', 'fci'],
  seguimiento: ['seguimiento', 'proyecto', 'alfa', 'beta', 'avance', 'reporte'],
};

function normalizeText(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function scoreKeywords(text, keywordsMap) {
  const normalized = normalizeText(text);
  let best = { key: null, score: 0 };
  for (const [key, words] of Object.entries(keywordsMap)) {
    const score = words.filter((w) => normalized.includes(w)).length;
    if (score > best.score) best = { key, score };
  }
  return best;
}

export function suggestClassification(fileName, title = '') {
  const combined = `${fileName} ${title}`;
  const typeResult  = scoreKeywords(combined, TYPE_KEYWORDS);
  const groupResult = scoreKeywords(combined, GROUP_KEYWORDS);

  const type  = typeResult.key  || 'oficio';
  const group = groupResult.key || 'seguimiento';

  // Nivel de confianza mock (0–100)
  const confidence = Math.min(
    100,
    40 + (typeResult.score + groupResult.score) * 15,
  );

  const reasons = [];
  if (typeResult.key)  reasons.push(`El nombre contiene palabras clave de tipo "${type}"`);
  if (groupResult.key) reasons.push(`El contenido sugiere el grupo funcional "${group}"`);
  if (reasons.length === 0) reasons.push('Clasificación basada en reglas generales del sistema');

  return { type, functionalGroup: group, confidence, reasons };
}

// ── CRUD ──────────────────────────────────────────────────

export async function getTemplates(filters = {}) {
  await delay(300);
  let result = [..._templates];
  if (filters.search) {
    const q = normalizeText(filters.search);
    result = result.filter(
      (t) => normalizeText(t.title).includes(q) ||
             (t.tags || []).some((tag) => normalizeText(tag).includes(q)),
    );
  }
  if (filters.type)  result = result.filter((t) => t.type === filters.type);
  if (filters.group) result = result.filter((t) => t.functionalGroup === filters.group);
  return result;
}

export async function getTemplateById(id) {
  await delay(200);
  return _templates.find((t) => t.id === id) || null;
}

export async function uploadTemplate(file, metadata) {
  await delay(1500); // simula análisis
  const user = getCurrentUser();
  const now  = new Date().toISOString();
  const newTemplate = {
    id:              `tpl_${Date.now()}`,
    title:           metadata.title,
    description:     metadata.description || '',
    fileName:        file.name,
    type:            metadata.type,
    functionalGroup: metadata.functionalGroup,
    status:          'active',
    version:         '1.0',
    tags:            metadata.tags || [],
    uploadedById:    user?.id   || 'usr-001',
    uploadedByName:  user?.name || 'Administrador',
    uploadedByRole:  user?.role || 'Administrador',
    lastUpdated:     now,
  };
  _templates = [newTemplate, ..._templates];
  auditService.log('upload_template', newTemplate.title, newTemplate.id, 'Biblioteca');
  return newTemplate;
}

export async function archiveTemplate(id) {
  await delay(800);
  _templates = _templates.map((t) =>
    t.id === id ? { ...t, status: 'archived' } : t,
  );
  const tpl = _templates.find((t) => t.id === id);
  if (tpl) auditService.log('archive_template', tpl.title, id, 'Biblioteca');
  return true;
}

export async function deleteTemplate(id) {
  await delay(600);
  const tpl = _templates.find((t) => t.id === id);
  _templates = _templates.filter((t) => t.id !== id);
  if (tpl) auditService.log('delete_template', tpl.title, id, 'Biblioteca');
  return true;
}

/**
 * Devuelve el schema de campos para un tipo documental.
 * En Fase 2: GET /api/template-schemas/:type
 * @param {string} type - 'oficio' | 'constancia' | 'memorandum' | 'acta' | 'informe'
 */
export async function getTemplateSchema(type) {
  await delay(0);
  return templateSchemas[type] || null;
}

const templateService = {
  getTemplates, getTemplateById, uploadTemplate,
  archiveTemplate, deleteTemplate, suggestClassification,
  getTemplateSchema,
};
export default templateService;
