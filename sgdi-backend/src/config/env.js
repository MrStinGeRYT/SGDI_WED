// src/config/env.js — Validación y acceso a variables de entorno
import 'dotenv/config'

function required(key) {
  const val = process.env[key]
  if (!val) throw new Error(`Variable de entorno requerida no definida: ${key}`)
  return val
}

export const env = {
  NODE_ENV:       process.env.NODE_ENV || 'development',
  PORT:           parseInt(process.env.PORT || '3001', 10),
  JWT_SECRET:     required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
  STORAGE_DRIVER: process.env.STORAGE_DRIVER || 'local',
  UPLOAD_DIR:     process.env.UPLOAD_DIR || 'uploads',
  CORS_ORIGIN:    process.env.CORS_ORIGIN || 'http://localhost:5173',
}
