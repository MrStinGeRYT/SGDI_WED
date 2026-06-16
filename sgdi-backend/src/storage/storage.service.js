// src/storage/storage.service.js
// Abstracción de almacenamiento de archivos.
// Driver configurable con STORAGE_DRIVER=local|s3|azure
//
// Fase 2A: solo 'local' implementado.
// Para cambiar a S3/Azure: implementar las funciones en las secciones correspondientes
// y cambiar STORAGE_DRIVER en .env — sin tocar el resto del código.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from '../config/env.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const ROOT_DIR   = path.join(__dirname, '..', '..') // raíz del proyecto

// ── Local driver ──────────────────────────────────────────────────────────────

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * Guarda un archivo en disco local.
 * @param {Object} file - Objeto multer { originalname, buffer, mimetype }
 * @param {string} subfolder - Subcarpeta dentro de /uploads (ej: 'firmas', 'templates')
 * @returns {string} URL pública relativa: /uploads/subfolder/filename
 */
async function saveLocally(file, subfolder = 'misc') {
  const uploadDir = path.join(ROOT_DIR, env.UPLOAD_DIR, subfolder)
  ensureDir(uploadDir)

  const ext      = path.extname(file.originalname)
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const filepath = path.join(uploadDir, filename)

  fs.writeFileSync(filepath, file.buffer)

  // URL relativa que Express sirve via /uploads
  return `/${env.UPLOAD_DIR}/${subfolder}/${filename}`
}

/**
 * Elimina un archivo local dado su URL relativa.
 */
async function deleteLocally(fileUrl) {
  if (!fileUrl) return
  const filepath = path.join(ROOT_DIR, fileUrl)
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath)
  }
}

// ── S3 driver (stub) ──────────────────────────────────────────────────────────
// TODO Fase 2B+: implementar con @aws-sdk/client-s3
async function uploadToS3(_file, _subfolder) {
  throw new Error('S3 storage driver no implementado aún. Configura STORAGE_DRIVER=local')
}

// ── Azure driver (stub) ───────────────────────────────────────────────────────
// TODO Fase 2B+: implementar con @azure/storage-blob
async function uploadToAzure(_file, _subfolder) {
  throw new Error('Azure storage driver no implementado aún. Configura STORAGE_DRIVER=local')
}

// ── API pública ───────────────────────────────────────────────────────────────

/**
 * Sube un archivo usando el driver configurado.
 * @param {Object} file - Objeto multer (con buffer, originalname, mimetype)
 * @param {string} subfolder - Subcarpeta lógica: 'firmas' | 'templates' | 'documentos'
 * @returns {Promise<string>} URL o ruta del archivo guardado
 */
export async function uploadFile(file, subfolder = 'misc') {
  switch (env.STORAGE_DRIVER) {
    case 's3':    return uploadToS3(file, subfolder)
    case 'azure': return uploadToAzure(file, subfolder)
    default:      return saveLocally(file, subfolder)
  }
}

/**
 * Elimina un archivo usando el driver configurado.
 * @param {string} fileUrl - URL/ruta del archivo a eliminar
 */
export async function deleteFile(fileUrl) {
  switch (env.STORAGE_DRIVER) {
    case 'local': return deleteLocally(fileUrl)
    // S3/Azure: implementar
    default:      return deleteLocally(fileUrl)
  }
}
