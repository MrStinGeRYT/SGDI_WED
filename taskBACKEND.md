# Fase 2A — Backend SGDI Web

## Paso 1 — Scaffold base
- [x] Crear estructura de carpetas
- [x] package.json + dependencias
- [x] .env / .env.example / .gitignore
- [x] server.js + src/app.js
- [x] src/config/env.js + prisma.js
- [x] src/middleware/auth.js + errorHandler.js

## Paso 2 — Prisma schema
- [x] schema.prisma (User, Document, Template, AuditLog, Email)
- [x] Migración inicial (Prisma 5 + SQLite)
- [x] Generación cliente Prisma

## Paso 3 — Seed
- [x] prisma/seed.js con admin + editor de prueba

## Paso 4 — Auth
- [x] auth.service.js (login bcrypt + JWT, getMe)
- [x] auth.controller.js (Zod validation)
- [x] auth.routes.js
- [x] POST /api/auth/login ✅
- [x] GET /api/auth/me ✅
- [x] POST /api/auth/logout ✅

## Bloque 2 — Templates real + Firma Imagen + Frontend
- [x] templates.service.js (CRUD + file upload real)
- [x] templates.controller.js (multipart + Zod)
- [x] templates.routes.js (multer memoryStorage, roles)
- [x] GET /api/templates ✅
- [x] POST /api/templates (multipart) ✅
- [x] GET /api/templates/:id ✅
- [x] PATCH /api/templates/:id/archive ✅
- [x] DELETE /api/templates/:id ✅
- [x] firma.routes.js (POST /documents/:id/firma-imagen) ✅
- [x] src/services/api.js (cliente HTTP central con JWT)
- [x] authService.js → backend real ✅
- [x] documentService.js → backend real ✅
- [x] .env.local frontend con VITE_API_URL
- [x] LoginPage demo credentials actualizadas
- [x] Smoke Test 2: 9/9 endpoints ✅
