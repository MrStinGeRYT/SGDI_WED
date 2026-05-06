# SGDI Web — Preparación para Backend

> **Estado:** Frontend completo (Fases 1A–1D cerradas). Mock activo.
> **Siguiente fase:** Conectar servicios reales vía API REST.

---

## 1. Módulos listos para conectar

| Módulo | Estado frontend | Pendiente en backend |
|---|---|---|
| Documentos | ✅ Lista, editor, preview, descarga, firma | CRUD + storage de firma_imagen |
| Plantillas | ✅ Upload, clasificador, archivo, delete | CRUD + almacenamiento de archivos |
| Bitácora | ✅ Vista de log con filtros | Persistencia del audit log |
| Correos | ✅ Lista, envío | Integración MS365 / SMTP |
| Dashboard | ✅ Métricas y stats | Aggregations reales |
| Login | ✅ Formulario, roles mock | Auth real (JWT / sesión) |
| Configuración | ✅ Pantalla | User settings en BD |

---

## 2. Servicios mock → reemplazar con HTTP

| Servicio actual | Reemplazar con |
|---|---|
| `authService.login()` | `POST /api/auth/login` → JWT |
| `documentService.getDocuments()` | `GET /api/documents` |
| `documentService.getDocumentById()` | `GET /api/documents/:id` |
| `documentService.createDocument()` | `POST /api/documents` |
| `documentService.updateDocument()` | `PATCH /api/documents/:id` |
| `documentService.archiveDocument()` | `PATCH /api/documents/:id/archive` |
| `documentService.uploadToCloud()` | `POST /api/documents/:id/cloud` |
| `documentService.sendDocumentByEmail()` | `POST /api/documents/:id/send` |
| `templateService.getTemplates()` | `GET /api/templates` |
| `templateService.uploadTemplate()` | `POST /api/templates` (multipart) |
| `templateService.getTemplateSchema()` | `GET /api/template-schemas/:type` *(o mantener JSON local)* |
| `exportService.exportDocument()` | `GET /api/documents/:id/export?format=pdf\|docx` → blob |
| `emailService.sendEmail()` | `POST /api/emails/send` vía MS365 Graph |
| `auditService.log()` | `POST /api/audit` |
| `dashboardService.getDashboardSummary()` | `GET /api/dashboard` |

---

## 3. Modelos / Entidades

```
User
  id, name, email, role, createdAt, updatedAt

Document
  id, title, type, status
  fields: JSON         ← incluye firma_texto, firma_imagen (base64 o URL)
  createdById, updatedById
  cloudStatus, emailStatus
  createdAt, updatedAt

Template
  id, title, description, fileName, fileUrl
  type, functionalGroup, tags[], status, version
  uploadedById, lastUpdated

AuditLog
  id, action, entityId, entityName, module
  userId, userName, userRole
  timestamp

Email
  id, subject, to[], documentId, status, sentAt

TemplateSchema   ← puede ser estático (JSON local) o dinámico (BD)
  type, fields[]
```

---

## 4. Endpoints básicos

```
# Auth
POST   /api/auth/login
GET    /api/auth/me

# Documentos
GET    /api/documents              ?search= &type= &status=
POST   /api/documents
GET    /api/documents/:id
PATCH  /api/documents/:id
PATCH  /api/documents/:id/archive
POST   /api/documents/:id/cloud
POST   /api/documents/:id/send
GET    /api/documents/:id/export   ?format=docx|pdf  → blob

# Plantillas
GET    /api/templates              ?search= &type= &group=
POST   /api/templates              multipart/form-data
GET    /api/templates/:id
PATCH  /api/templates/:id/archive
DELETE /api/templates/:id

# Schemas (opcional — puede ser JSON local)
GET    /api/template-schemas/:type

# Auditoría
GET    /api/audit                  ?module= &userId= &from= &to=
POST   /api/audit

# Correos
POST   /api/emails/send
GET    /api/emails

# Dashboard
GET    /api/dashboard
```

---

## 5. Flujo real de datos

```
[Usuario] → POST /auth/login → JWT almacenado en cliente
    ↓
[Documentos] → GET /documents → lista
    ↓ crear
POST /documents → { type, title } → recibe { id }
    ↓ editar campos (en tiempo real solo en cliente)
    ↓ guardar
PATCH /documents/:id → { fields: { ...campos, firma_texto, firma_imagen } }
    ↓ exportar
GET /documents/:id/export?format=pdf → blob → triggerDownload()
    ↓ enviar
POST /documents/:id/send → { to[] } → MS365 Graph
    ↓ auditoría (automática en cada acción del servidor)
POST /audit → { action, entityId, userId, module }
```

---

## 6. Decisiones pendientes antes de implementar

### firma_imagen: base64 vs. blob storage

- **Base64 en JSON:** simple, sin dependencias, pero infla la BD.
- **Blob storage (S3 / Azure Blob):** la imagen se sube por separado, se guarda solo la URL en `fields.firma_imagen`.

> **Recomendación:** blob storage para producción. Base64 solo en desarrollo/mock.

### templateSchemas: estático vs. dinámico

- Si los schemas nunca cambian por rol o institución → mantener `templateSchemas.json` en el frontend.
- Si en el futuro un admin necesita configurar campos → mover a BD con endpoint propio.

### Stack de backend (por definir)

- Node.js + Express / Fastify
- Django REST Framework
- Laravel
- Otro

### Auth

- JWT con refresh token
- Sesiones con cookie segura
- OAuth institucional (si UNACAR tiene SSO)

---

## 7. Archivos frontend que cambian al conectar backend

| Archivo | Cambio |
|---|---|
| `services/authService.js` | Reemplazar login mock con fetch real + guardar JWT |
| `services/documentService.js` | Reemplazar arrays en memoria con fetch |
| `services/templateService.js` | Reemplazar arrays en memoria con fetch |
| `services/exportService.js` | Reemplazar stub con fetch → blob → triggerDownload |
| `services/emailService.js` | Reemplazar mock con fetch → MS365 |
| `services/auditService.js` | Reemplazar log local con POST /api/audit |
| `data/mockDocuments.json` | Eliminar (lo provee el backend) |
| `data/mockTemplates.json` | Eliminar |
| `data/mockAuditLog.json` | Eliminar |
| `data/templateSchemas.json` | Mantener si los schemas son estáticos |

---

*Documento generado: 2026-05-06 — SGDI Web Fase 2 Prep*
