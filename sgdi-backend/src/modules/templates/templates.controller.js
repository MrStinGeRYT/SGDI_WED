// src/modules/templates/templates.controller.js
import { z } from 'zod'
import * as templatesService from './templates.service.js'

const listSchema = z.object({
  search: z.string().optional(),
  type:   z.string().optional(),
  group:  z.string().optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional().default('ACTIVE'),
  page:   z.coerce.number().int().positive().optional().default(1),
  limit:  z.coerce.number().int().positive().max(100).optional().default(20),
})

const metaSchema = z.object({
  title:           z.string().min(1, 'El título es requerido'),
  type:            z.string().min(1, 'El tipo es requerido'),
  description:     z.string().optional(),
  functionalGroup: z.string().optional(),
  version:         z.string().optional(),
  tags:            z.union([z.string(), z.array(z.string())]).optional(),
})

/** GET /api/templates */
export async function list(req, res, next) {
  try {
    const query  = listSchema.parse(req.query)
    const result = await templatesService.getTemplates(query)
    res.json(result)
  } catch (err) { next(err) }
}

/** GET /api/templates/:id */
export async function getById(req, res, next) {
  try {
    const tpl = await templatesService.getTemplateById(req.params.id)
    res.json(tpl)
  } catch (err) { next(err) }
}

/**
 * POST /api/templates
 * Content-Type: multipart/form-data
 * Fields: file (required) + title, type, description, functionalGroup, version, tags
 */
export async function create(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Se requiere un archivo de plantilla' })
    }

    const metadata = metaSchema.parse(req.body)
    const tpl      = await templatesService.createTemplate({
      file:     req.file,
      metadata,
      userId:   req.user.id,
    })
    res.status(201).json(tpl)
  } catch (err) { next(err) }
}

/** PATCH /api/templates/:id/archive */
export async function archive(req, res, next) {
  try {
    const result = await templatesService.archiveTemplate(req.params.id)
    res.json(result)
  } catch (err) { next(err) }
}

/** DELETE /api/templates/:id */
export async function remove(req, res, next) {
  try {
    const result = await templatesService.deleteTemplate(req.params.id)
    res.json(result)
  } catch (err) { next(err) }
}
