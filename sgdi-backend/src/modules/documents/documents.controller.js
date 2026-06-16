// src/modules/documents/documents.controller.js
import { z } from 'zod'
import * as documentsService from './documents.service.js'

const createSchema = z.object({
  title:  z.string().min(1, 'El título es requerido'),
  type:   z.string().min(1, 'El tipo de documento es requerido'),
  fields: z.record(z.unknown()).optional().default({}),
})

const updateSchema = z.object({
  title:       z.string().min(1).optional(),
  type:        z.string().optional(),
  status:      z.enum(['DRAFT', 'REVIEW', 'SIGNED', 'ARCHIVED']).optional(),
  fields:      z.record(z.unknown()).optional(),
  firmaTexto:  z.string().optional(),
  firmaImgUrl: z.string().optional(),
  cloudStatus: z.string().optional(),
  emailStatus: z.string().optional(),
})

const listSchema = z.object({
  search: z.string().optional(),
  type:   z.string().optional(),
  status: z.string().optional(),
  page:   z.coerce.number().int().positive().optional().default(1),
  limit:  z.coerce.number().int().positive().max(100).optional().default(20),
})

/** GET /api/documents */
export async function list(req, res, next) {
  try {
    const query  = listSchema.parse(req.query)
    const result = await documentsService.getDocuments(query)
    res.json(result)
  } catch (err) { next(err) }
}

/** GET /api/documents/:id */
export async function getById(req, res, next) {
  try {
    const doc = await documentsService.getDocumentById(req.params.id)
    res.json(doc)
  } catch (err) { next(err) }
}

/** POST /api/documents */
export async function create(req, res, next) {
  try {
    const body = createSchema.parse(req.body)
    const doc  = await documentsService.createDocument({ ...body, userId: req.user.id })
    res.status(201).json(doc)
  } catch (err) { next(err) }
}

/** PATCH /api/documents/:id */
export async function update(req, res, next) {
  try {
    const body = updateSchema.parse(req.body)
    const doc  = await documentsService.updateDocument(req.params.id, body, req.user.id)
    res.json(doc)
  } catch (err) { next(err) }
}

/** PATCH /api/documents/:id/archive */
export async function archive(req, res, next) {
  try {
    const result = await documentsService.archiveDocument(req.params.id, req.user.id)
    res.json(result)
  } catch (err) { next(err) }
}
