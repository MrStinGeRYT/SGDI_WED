# Plan Estratégico: Fase 1D — Cierre y Preparación para Backend

## Contexto restaurado

El proyecto **SGDI Web** ya tiene las Fases 1A, 1B y 1C completamente implementadas. La revisión del código actual revela que la mayor parte de la Fase 1D también fue ejecutada en la conversación anterior. A continuación se documenta el **estado real** y **lo que queda pendiente**.

---

## Estado actual verificado en código

### ✅ YA IMPLEMENTADO (no tocar)

| Área | Estado |
|---|---|
| Servicios: `templateService`, `documentService`, `emailService`, `auditService`, `userService`, `ms365Service` | ✅ Completo |
| `UploadTemplateModal` — flujo híbrido subir + clasificar | ✅ Completo |
| `CreateDocumentModal` — modal paso a paso (4 pasos) | ✅ Completo |
| `BibliotecaPage` — usa servicios, RowActionsMenu, permisos, toast | ✅ Completo |
| `DocumentosPage` — usa servicios, permisos, ConfirmDialog, toast | ✅ Completo |
| `CorreosPage` — usa `emailService`, historial en tabla | ✅ Completo |
| `BitacoraPage` — sección propia en sidebar, consume `auditService` | ✅ Completo |
| `usePermissions` + `permissions.js` — roles mock | ✅ Completo |
| Botones deshabilitados con tooltip | ✅ En `RowActionsMenu` |
| Trazabilidad de usuarios (no departamentos) | ✅ En todos los servicios |
| Dark mode + responsive + toast + ConfirmDialog | ✅ Fase 1C |

---

## Lo que falta implementar

### GAP 1 — Editor: no conecta con `documentService`

`DocumentoEditPage.jsx` actualmente:
- Lee el documento **directo de `mockDocuments.json`** (no usa `documentService.getDocumentById`)
- Los botones Guardar / Nube / Enviar **no llaman a los servicios** (`updateDocument`, `uploadToCloud`, `sendDocumentByEmail`)
- El panel lateral de metadatos tiene **opciones hardcoded** en lugar de usar `documentTypes.json`

**Lo que necesita:**
- Usar `documentService.getDocumentById(id)` para cargar el documento
- `handleSave` → llama a `documentService.updateDocument(id, { content, title })`
- `handleCloud` → llama a `documentService.uploadToCloud(id)` + actualiza estado visual
- `handleSend` → llama a `documentService.sendDocumentByEmail(id)` + actualiza estado visual
- Panel lateral muestra `cloudStatus` y `emailStatus` del documento real
- Selects de Tipo y Grupo Funcional deben venir de `documentTypes.json`

### GAP 2 — Correos: adjuntos hardcoded

`CorreosPage.jsx` líneas 146–149 tienen opciones hardcoded en el `<select>` de adjuntos.

**Lo que necesita:**
- Cargar `documentService.getDocuments()` al montar
- Usar esa lista para poblar el `<select>` de adjuntos
- El correo enviado debe registrar `sourceDocument` si se adjuntó uno

### GAP 3 — Panel MS365 Readiness en Configuración

`ConfiguracionPage` tiene una pestaña de integración pero no usa `ms365Service.MS365_INTEGRATIONS`.

**Lo que necesita:**
- Mostrar las 4 integraciones definidas en `ms365Service` (Outlook, OneDrive, SharePoint, Entra ID)
- Cada integración muestra: nombre, descripción, features, estado (pending)
- Botón "Conectar" llama a `connectMs365()` con feedback de toast

### GAP 4 — QA final

- Verificar que no queden `alert()` nativos
- Verificar dark mode en todas las páginas
- Verificar responsive en todas las páginas clave
- Actualizar `documentacion_proyecto.md`

---

## Propuesta de ejecución por bloques

### BLOQUE A — Editor conectado a servicios (GAP 1)

**Archivos a modificar:**
- `src/pages/Documentos/DocumentoEditPage.jsx` — reescritura completa para usar servicios

**Lógica:**
1. `useEffect` carga `documentService.getDocumentById(id)`
2. Estado local: `doc`, `content`, `title`, `cloudStatus`, `emailStatus`, `isSaving`
3. `handleSave` → `documentService.updateDocument()` → toast success
4. `handleCloud` → `documentService.uploadToCloud()` → actualiza `cloudStatus` local → toast
5. `handleSend` → `documentService.sendDocumentByEmail()` → actualiza `emailStatus` local → toast
6. Panel lateral: selects desde `documentTypes.json`, estados de integración reactivos

---

### BLOQUE B — Correos con adjuntos dinámicos (GAP 2)

**Archivos a modificar:**
- `src/pages/Correos/CorreosPage.jsx` — cargar documentos para el selector

---

### BLOQUE C — Panel MS365 Readiness en Configuración (GAP 3)

**Archivos a modificar:**
- `src/pages/Configuracion/ConfiguracionPage.jsx` — integrar `ms365Service.MS365_INTEGRATIONS`

---

### BLOQUE D — QA + documentación (GAP 4)

- Búsqueda de `alert(` en todo el proyecto
- Revisión visual responsive + dark mode
- Actualización de `documentacion_proyecto.md`

---

## Archivos que NO se tocarán

- `Login/LoginPage.jsx` y `Login.css` — ya correctos
- `Sidebar.jsx` — ya correcto con Bitácora
- `BibliotecaPage.jsx` — ya correcto
- `DocumentosPage.jsx` — ya correcto
- `CreateDocumentModal.jsx` — ya correcto
- `UploadTemplateModal.jsx` — ya correcto
- `BitacoraPage.jsx` — ya correcto
- Todos los servicios — ya correctos
- `usePermissions.js` + `permissions.js` — ya correctos
- `AppContext`, `AuthContext`, `ToastContext` — ya correctos

---

## Verificación

1. Servidor de desarrollo en `http://localhost:5173/`
2. Flujo completo: Login → Biblioteca → Subir plantilla → Crear documento → Editor (guardar/nube/enviar) → Correos → Bitácora
3. Verificación de dark mode en cada página
4. Verificación de responsive en mobile/tablet
