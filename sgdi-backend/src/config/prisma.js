// src/config/prisma.js — Singleton PrismaClient (Prisma 5 + SQLite)
// Prisma 5 usa DATABASE_URL en schema.prisma directamente.
// Para migrar a PostgreSQL: cambiar provider y DATABASE_URL en .env — sin tocar este archivo.
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

export default prisma
