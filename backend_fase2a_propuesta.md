# SGDI Web — Fase 2A: Propuesta Backend

> Stack: Node.js · Express · Prisma · SQLite (dev) · JWT

---

## 1. Arquitectura general

```
Frontend (Vite/React)
       │  HTTP + JWT
       ▼
  Express API  ──► Prisma ORM ──► SQLite (dev) / PostgreSQL (prod)
       │
       ├── /uploads/  (archivos locales en dev, cloud en prod)
       └── Middleware: auth · roles · audit · error handler
```

**Principios:**
- Sin frameworks pesados. Express puro, liviano y predecible.
- Prisma abstrae 100% el driver → migrar a PG es cambiar 1 línea en `schema.prisma`.
- Archivos: carpeta local en dev, variable de entorno `STORAGE_DRIVER=local|s3|azure` para prod.
- `templateSchemas.json` se mantiene en el frontend por ahora (estático).

---

## 2. Estructura de carpetas

```
sgdi-backend/
├── prisma/
│   ├── schema.prisma          ← modelos + datasource
│   ├── seed.js                ← usuario admin inicial
│   └── migrations/
│
├── src/
│   ├── config/
│   │   ├── env.js             ← dotenv, validaciones
│   │   └── prisma.js          ← singleton PrismaClient
│   │
│   ├── middleware/
│   │   ├── auth.js            ← verifyToken, requireRole
│   │   ├── audit.js           ← auto-log por ruta
│   │   └── errorHandler.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   └── auth.service.js
│   │   │
│   │   ├── users/
│   │   │   ├── users.routes.js
│   │   │   ├── users.controller.js
│   │   │   └── users.service.js
│   │   │
│   │   ├── documents/
│   │   │   ├── documents.routes.js
│   │   │   ├── documents.controller.js
│   │   │   └── documents.service.js
│   │   │
│   │   ├── templates/
│   │   │   ├── templates.routes.js
│   │   │   ├── templates.controller.js
│   │   │   └── templates.service.js
│   │   │
│   │   ├── audit/
│   │   │   ├── audit.routes.js
│   │   │   └── audit.service.js
│   │   │
│   │   ├── emails/
│   │   │   ├── emails.routes.js
│   │   │   └── emails.controller.js
│   │   │
│   │   └── dashboard/
│   │       ├── dashboard.routes.js
│   │       └── dashboard.service.js
│   │
│   ├── storage/
│   │   └── storage.service.js ← abstracción local/s3/azure
│   │
│   └── app.js                 ← Express setup + rutas
│
├── uploads/                   ← archivos en dev (gitignored)
├── .env
├── .env.example
├── package.json
└── server.js                  ← entry point
```

---

## 3. Modelos Prisma

```prisma
// prisma/schema.prisma

datasource db {
  provider = "sqlite"   // cambiar a "postgresql" para prod
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String   // bcrypt hash
  role      Role     @default(VIEWER)
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  documents Document[]
  templates Template[]
  auditLogs AuditLog[]
  emails    Email[]
}

enum Role {
  ADMIN
  EDITOR
  VIEWER
}

model Document {
  id          String         @id @default(cuid())
  title       String
  type        String         // tipo documental: oficio, circular, etc.
  status      DocumentStatus @default(DRAFT)
  fields      String         // JSON serializado: campos dinámicos del tipo
  firmaTexto  String?        // texto de firma
  firmaImgUrl String?        // ruta/URL del archivo (no base64)
  cloudStatus String?
  emailStatus String?
  createdById String
  updatedById String?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  createdBy   User      @relation(fields: [createdById], references: [id])
  auditLogs   AuditLog[]
}

enum DocumentStatus {
  DRAFT
  REVIEW
  SIGNED
  ARCHIVED
}

model Template {
  id              String         @id @default(cuid())
  title           String
  description     String?
  type            String
  functionalGroup String?
  tags            String?        // JSON array serializado
  status          TemplateStatus @default(ACTIVE)
  version         String?
  fileName        String
  fileUrl         String         // ruta/URL del archivo
  uploadedById    String
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  uploadedBy  User  @relation(fields: [uploadedById], references: [id])
}

enum TemplateStatus {
  ACTIVE
  ARCHIVED
}

model AuditLog {
  id         String   @id @default(cuid())
  action     String   // CREATE, UPDATE, DELETE, EXPORT, SEND, LOGIN, etc.
  module     String   // documents, templates, auth, etc.
  entityId   String?
  entityName String?
  userId     String
  userName   String
  userRole   String
  metadata   String?  // JSON extra si se necesita
  timestamp  DateTime @default(now())

  user      User       @relation(fields: [userId], references: [id])
  document  Document?  @relation(fields: [entityId], references: [id])
}

model Email {
  id         String      @id @default(cuid())
  subject    String
  to         String      // JSON array serializado
  documentId String?
  status     EmailStatus @default(PENDING)
  sentAt     DateTime?
  createdAt  DateTime    @default(now())

  sentBy     User   @relation(fields: [userId], references: [id])
  userId     String
}

enum EmailStatus {
  PENDING
  SENT
  FAILED
}
```

> **Nota SQLite:** SQLite no soporta enums nativos; Prisma los maneja como `String` internamente. Al migrar a PostgreSQL, los enums quedan como tipos reales sin cambios en el código.

---

## 4. Endpoints — Fase 2A (mínimos)

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | email + password → JWT |
| GET | `/api/auth/me` | usuario actual desde JWT |
| POST | `/api/auth/logout` | invalida token en cliente |

### Users *(solo ADMIN)*
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | lista paginada |
| POST | `/api/users` | crear usuario |
| PATCH | `/api/users/:id` | actualizar nombre/rol/activo |

### Documents
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/documents` | lista con filtros: `?type=&status=&search=` |
| POST | `/api/documents` | crear documento (draft) |
| GET | `/api/documents/:id` | detalle completo |
| PATCH | `/api/documents/:id` | guardar campos / actualizar status |
| PATCH | `/api/documents/:id/archive` | archivar |
| POST | `/api/documents/:id/firma-imagen` | **multipart** → guarda archivo, devuelve URL |

### Templates
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/templates` | lista con filtros |
| POST | `/api/templates` | **multipart**: archivo + metadata |
| GET | `/api/templates/:id` | detalle |
| PATCH | `/api/templates/:id/archive` | archivar |
| DELETE | `/api/templates/:id` | eliminar |

### Audit
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/audit` | log con filtros: `?module=&userId=&from=&to=` |

### Dashboard
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/dashboard` | conteos y stats agregados |

---

## 5. Estrategia de archivos

### Fase 2A (local/dev)

```
POST /api/documents/:id/firma-imagen
  Content-Type: multipart/form-data
  → multer guarda en /uploads/firmas/<cuid>.<ext>
  → BD: firmaImgUrl = "/uploads/firmas/abc123.png"
  → Response: { firmaImgUrl }

POST /api/templates
  Content-Type: multipart/form-data
  → multer guarda en /uploads/templates/<cuid>.<ext>
  → BD: fileUrl = "/uploads/templates/abc123.docx"
```

### Producción (futuro)

```js
// storage.service.js
const driver = process.env.STORAGE_DRIVER // 'local' | 's3' | 'azure'

export async function uploadFile(file) {
  if (driver === 's3')    return uploadToS3(file)
  if (driver === 'azure') return uploadToAzure(file)
  return saveLocally(file)  // default dev
}
```

**El frontend nunca envía base64 para firma_imagen.** Siempre `multipart`. La respuesta es la URL, que el frontend renderiza como `<img src={firmaImgUrl}>`.

### Exportación (futura)
- `GET /api/documents/:id/export?format=pdf|docx`
- Fase 2A: stub que devuelve 501 Not Implemented
- Fase 2B: integrar `pdfkit` o `puppeteer` para PDF, `docxtemplater` para DOCX

---

## 6. Flujo JWT

```
[Login]
  POST /auth/login { email, password }
  → bcrypt.compare(password, user.password)
  → jwt.sign({ sub: id, role, name }, SECRET, { expiresIn: '8h' })
  → Response: { token, user }

[Request autenticada]
  Header: Authorization: Bearer <token>
  → middleware auth.js: jwt.verify(token, SECRET)
  → req.user = { id, role, name }
  → next()

[Protección por rol]
  requireRole('ADMIN')  ← middleware encadenado
  → si role no coincide → 403 Forbidden

[Frontend]
  localStorage.setItem('sgdi_token', token)
  axios.defaults.headers.Authorization = `Bearer ${token}`
```

**Sin refresh tokens en Fase 2A.** Si expira, re-login. Refresh token va en Fase 2B si se necesita.

---

## 7. Orden de implementación (Fase 2A)

Avanzar en este orden para tener un ciclo funcional lo antes posible:

```
Semana 1
  [1] Scaffold: npm init, Express, Prisma, .env, server.js
  [2] Prisma schema + migrate + seed (admin inicial)
  [3] POST /auth/login + GET /auth/me + middleware auth
  [4] Probar con Postman/Thunder Client ✓

Semana 2
  [5] CRUD /documents (sin firma imagen aún)
  [6] Frontend: reemplazar authService mock → fetch real
  [7] Frontend: reemplazar documentService mock → fetch real

Semana 3
  [8] POST /documents/:id/firma-imagen (multer)
  [9] CRUD /templates (multipart)
  [10] GET /dashboard (aggregations)
  [11] GET /audit

Semana 4
  [12] CRUD /users (solo ADMIN)
  [13] Pulir errores, validaciones (zod o express-validator)
  [14] Variables de entorno documentadas (.env.example)
  [15] Smoke test general ✓
```

---

## Decisiones tomadas

| Decisión | Elección |
|----------|----------|
| Runtime | Node.js + Express |
| ORM | Prisma |
| DB dev | SQLite |
| DB prod | PostgreSQL (cambio de 1 línea) |
| Auth | JWT, 8h, sin refresh en Fase 2A |
| Roles | ADMIN / EDITOR / VIEWER |
| Archivos | multer → local en dev, storage.service.js abstracto para prod |
| firma_imagen | multipart desde el principio, nunca base64 en BD |
| templateSchemas | JSON estático en frontend (no mover aún) |
| Validación | zod (ligero, sin decoradores) |
| Emails | Stub en Fase 2A, MS365 Graph en Fase 2B |
| Export | Stub en Fase 2A, pdfkit/puppeteer en Fase 2B |

---

*SGDI Web — Fase 2A Backend Proposal · 2026-06-15*
