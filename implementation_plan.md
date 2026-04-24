# Plan Estratégico: Fase 1D — Cierre y Preparación para Backend

## Objetivo

Llevar el frontend de SGDI Web del estado **demo visual** al estado **listo para conectar a backend real**, sin rehacer nada después. El usuario debe poder recorrer el flujo completo de trabajo de principio a fin en modo simulado:

> `Entrar → Subir plantilla → Clasificar → Guardar → Crear documento → Editar → Enviar → Ver historial`

---

## Organización en Sub-fases

La Fase 1D se divide en **4 bloques de trabajo** ordenados por dependencia. Cada bloque es independiente y puede validarse por separado.

```
1D-I   → Correcciones y capa de servicios     (base para todo lo demás)
1D-II  → Flujos mock funcionales              (experiencia del usuario)
1D-III → Permisos, bitácora y MS365 readiness (valor institucional)
1D-IV  → QA final + documentación cerrada     (entrega y cierre)
```

---

## 1D-I: Correcciones de Base y Capa de Servicios

> **Prioridad: Alta — debe hacerse primero. Todo lo demás depende de esto.**

### 1.1 Corrección de nomenclatura

| Qué | Dónde | Corrección |
|---|---|---|
| Nombre del proyecto en docs | `documentacion_proyecto.md` | `SGDI_WED` → `SGDI_WEB` |
| Estado de la documentación | Encabezado del doc | Actualizar a Fase 1D |
| Credenciales mock en el doc | Sección 10 | Verificar que coincidan con `mockUsers.json` actual |
| Versiones de tecnología | Sección 5 | Verificar React 19 y Vite 8 (ya correctas en `package.json`) |

#### Archivos a modificar
- `documentacion_proyecto.md`

---

### 1.2 Capa de servicios frontend

El cambio más importante estructuralmente. Las páginas dejan de importar JSON directamente y pasan a llamar funciones de servicio. Cuando llegue el backend, solo se cambia el interior de esas funciones.

#### [NEW] `src/services/templateService.js`
```js
// Funciones a implementar:
getTemplates(filters)
getTemplateById(id)
uploadTemplate(file, metadata)   // mock: simula análisis y clasificación
archiveTemplate(id)
deleteTemplate(id)
suggestClassification(fileName)  // mock: devuelve tipo y grupo sugeridos
```

#### [NEW] `src/services/documentService.js`
```js
getDocuments(filters)
getDocumentById(id)
createDocument(templateId, metadata)
updateDocument(id, content, metadata)
archiveDocument(id)
uploadToCloud(id)        // mock
sendByEmail(id, emailData) // mock
```

#### [NEW] `src/services/emailService.js`
```js
getEmails()
sendEmail(emailData)     // mock: agrega al historial local
```

#### [NEW] `src/services/userService.js`
```js
getCurrentUser()         // lee sessionStorage
getUserById(id)
getUsersByRole(role)
```

#### [NEW] `src/services/ms365Service.js`
```js
getConnectionStatus()    // devuelve estado mock: not_configured
connect()                // mock: simula intento de conexión con Toast
```

#### [MODIFY] Todas las páginas que actualmente importan JSON directamente
- `BibliotecaPage.jsx` → usar `templateService`
- `DocumentosPage.jsx` → usar `documentService`
- `DocumentoEditPage.jsx` → usar `documentService`
- `CorreosPage.jsx` → usar `emailService`
- `ConfiguracionPage.jsx` → usar `ms365Service`

---

### 1.3 Contratos de datos documentados

#### [NEW] `src/data/contracts/template.contract.js`
```js
// Forma canónica de un objeto Template
export const TemplateContract = {
  id:              String,   // "tpl_xxx"
  title:           String,
  fileName:        String,   // "nombre.docx"
  type:            String,   // ID de tipo documental
  functionalGroup: String,   // ID de grupo funcional
  status:          String,   // "active" | "archived"
  uploadedById:    String,   // ID de usuario
  uploadedByName:  String,
  uploadedByRole:  String,
  uploadedAt:      ISO8601,
  updatedAt:       ISO8601,
  version:         String,
  tags:            Array,
  description:     String,
}
```

#### [NEW] `src/data/contracts/document.contract.js`
```js
export const DocumentContract = {
  id:             String,
  title:          String,
  templateId:     String,
  type:           String,
  functionalGroup:String,
  status:         String,   // "borrador" | "enviado" | "archivado"
  content:        String,   // texto del documento
  createdById:    String,
  createdByName:  String,
  createdByRole:  String,
  createdAt:      ISO8601,
  updatedById:    String,
  updatedByName:  String,
  updatedByRole:  String,
  updatedAt:      ISO8601,
  cloudStatus:    String,   // "synced" | "pending" | "none"
  emailStatus:    String,   // "sent" | "none"
}
```

#### [NEW] `src/data/contracts/email.contract.js`
```js
export const EmailContract = {
  id:         String,
  documentId: String,   // referencia al documento adjunto
  to:         String,
  cc:         String,
  subject:    String,
  body:       String,
  status:     String,   // "delivered" | "pending"
  sentById:   String,
  sentByName: String,
  sentAt:     ISO8601,
  attachment: String,   // nombre del archivo
}
```

---

## 1D-II: Flujos Mock Funcionales

> **Prioridad: Alta — el corazón de la Fase 1D.**

### 2.1 Flujo "Subir Plantilla" en Biblioteca

**Trigger:** Botón "Subir plantilla"

**Pasos del flujo:**
1. Modal de carga con input de archivo (`.docx` únicamente)
2. Validación de extensión y tamaño máximo (mock: 10 MB)
3. Mostrar nombre del archivo seleccionado y estado "Analizando..."
4. Simular análisis (1.5s de delay) → mostrar clasificación sugerida
5. Usuario confirma o ajusta tipo y grupo funcional
6. Simular guardado → agregar registro al listado sin recargar página
7. Toast de éxito con nombre del archivo

#### Componentes nuevos necesarios:
- `UploadTemplateModal.jsx` (dentro de `Biblioteca/`)

---

### 2.2 Flujo "Crear Documento" en Documentos

**Trigger:** Botón "Crear documento"

**Pasos del flujo:**
1. Modal paso 1: seleccionar plantilla de la biblioteca
2. Modal paso 2: llenar título, tipo, grupo funcional
3. Simular generación del documento (800ms)
4. Redirigir automáticamente al Editor con el nuevo documento

#### Componentes nuevos necesarios:
- `CreateDocumentModal.jsx` (dentro de `Documentos/`)

---

### 2.3 Flujo "Enviar Correo" en Correos

**Mejora del flujo actual:**
1. Al adjuntar documento, el campo muestra nombre real del archivo
2. Al enviar: simular delay → agregar el correo al historial local (estado local de React)
3. El historial se actualiza en tiempo real sin recargar la página
4. Toast de éxito con nombre del destinatario

---

### 2.4 Flujo del Editor — Acciones reales simuladas

**Mejorar el editor con estado real:**
- `cloudStatus` cambia a "synced" al hacer clic en "Subir a nube"
- `emailStatus` cambia a "sent" al hacer clic en "Enviar"
- Panel lateral muestra los cambios de estado en tiempo real
- Botón "Guardar" cambia a "✓ Guardado" por 2 segundos tras guardar

---

### 2.5 Estados de error amigables

Crear un set de mensajes de error estándar para el sistema:

| Situación | Mensaje |
|---|---|
| Archivo inválido | "El archivo debe estar en formato .docx" |
| Archivo demasiado grande | "El archivo supera el tamaño máximo de 10 MB" |
| Sesión expirada | "Tu sesión ha expirado. Inicia sesión nuevamente." |
| Sin conexión a MS365 | "No hay conexión con Microsoft 365" |
| Sin permisos | "No tienes permisos para realizar esta acción" |
| Error genérico | "Ocurrió un error. Intenta de nuevo." |

#### [NEW] `src/utils/errorMessages.js`

---

## 1D-III: Permisos, Bitácora y MS365 Readiness

### 3.1 Permisos mock por rol

#### [NEW] `src/utils/permissions.js`
```js
// Tabla de permisos por rol
const PERMISSIONS = {
  'Administrador':            ['*'],   // todo
  'Coordinadora Académica':   ['create', 'edit', 'classify', 'view'],
  'Responsable Documental':   ['upload', 'archive', 'view', 'sort'],
  'Asistente Administrativo': ['create_doc', 'send_email', 'view'],
  'Editor Institucional':     ['edit_doc', 'edit_template', 'view'],
};

export function can(user, action) { ... }
```

#### Hook `usePermissions`
```js
const { can } = usePermissions();
// En componentes:
{can('archive') && <button>Archivar</button>}
```

**Aplicar en:** `RowActionsMenu` en Biblioteca y Documentos — botones ocultos o deshabilitados según rol.

---

### 3.2 Bitácora / Historial de actividad

#### [NEW] `src/pages/Biblioteca/BitacoraTab.jsx` (pestaña en Biblioteca o sección en Dashboard)

Muestra un historial de acciones registradas:

```
[17/04/2026 10:30] Dra. María González — Subió plantilla "Oficio de Jurado"
[17/04/2026 10:45] Dr. Alejandro Martínez — Editó documento "Oficio Asignación..."
[17/04/2026 11:00] Mtra. Ana López — Envió correo a usuario@institucion.edu.mx
```

#### [NEW] `src/data/mockAuditLog.json`
- Historial de acciones mock con: `userId`, `userName`, `userRole`, `action`, `target`, `timestamp`

#### [NEW] `src/services/auditService.js`
```js
getAuditLog(filters)
logAction(userId, action, target)  // se llamará desde los servicios
```

---

### 3.3 Panel MS365 Readiness en Configuración

En la pestaña "Integraciones" de Configuración, expandir las tarjetas de MS365 para mostrar:

- Estado actual de cada integración
- Lista de funciones que habilitará cada conexión
- Botón de acción contextual ("Configurar", "Reconectar", "Ver documentación")

**Integraciones a documentar visualmente:**
- Outlook Mail (envío de correos)
- OneDrive (almacenamiento de documentos)
- SharePoint (repositorio institucional)
- Microsoft Entra ID (autenticación institucional)
- Graph API (acceso unificado)

---

## 1D-IV: QA Final y Documentación Cerrada

### 4.1 Checklist de auditoría visual

Revisión manual de cada pantalla y estado:

**Login**
- [ ] Modo claro — contraste de inputs
- [ ] Modo oscuro — contraste de inputs
- [ ] Error de credenciales incorrectas
- [ ] Carga (estado de "Iniciando sesión...")

**Sidebar**
- [ ] Expandido en desktop
- [ ] Colapsado en desktop (avatar centrado)
- [ ] Panel móvil + overlay

**Dashboard**
- [ ] Escritorio (1280px+)
- [ ] Tablet (768px)
- [ ] Móvil (375px)

**Biblioteca**
- [ ] Vista tabla — desktop y móvil
- [ ] Vista tarjetas — desktop y móvil
- [ ] Filtros activos
- [ ] Búsqueda sin resultados (EmptyState)
- [ ] Modal de detalle
- [ ] ConfirmDialog archivar
- [ ] Toast de éxito
- [ ] Flujo subir plantilla completo

**Documentos**
- [ ] Lista con trazabilidad correcta
- [ ] Flujo crear documento
- [ ] RowActionsMenu en móvil

**Editor**
- [ ] Guardar con Toast
- [ ] Subir a nube — cambio de estado
- [ ] Enviar — cambio de estado
- [ ] Responsive (layout de 1 columna en móvil)

**Correos**
- [ ] Envío con Toast
- [ ] Registro en historial en tiempo real
- [ ] Validación de campos vacíos

**Configuración**
- [ ] Tabs funcionales
- [ ] Toggle de tema
- [ ] Panel MS365 Readiness

**Ayuda**
- [ ] Accordion FAQ
- [ ] Chat simulado

**Global**
- [ ] Toast en esquina superior derecha — móvil y desktop
- [ ] EmptyState en todas las listas vacías
- [ ] Dark mode sin elementos con colores hardcoded
- [ ] No quedan `alert()` en ningún archivo

---

### 4.2 Actualizar documentación del proyecto

#### [MODIFY] `documentacion_proyecto.md`
- Corregir `SGDI_WED` → `SGDI_WEB`
- Actualizar estado a Fase 1D
- Agregar sección de permisos por rol
- Agregar sección de contratos de datos
- Agregar sección de capa de servicios
- Agregar bitácora al listado de módulos

---

## Prioridad de Ejecución

```
SEMANA 1
├── 1D-I-1: Corrección nomenclatura (30 min)
├── 1D-I-2: Crear capa de servicios (4-6h)
└── 1D-I-3: Contratos de datos documentados (1-2h)

SEMANA 1-2
├── 1D-II-1: Flujo "Subir plantilla" (3-4h)
├── 1D-II-2: Flujo "Crear documento" (3-4h)
├── 1D-II-3: Flujo "Enviar correo" mejorado (1-2h)
├── 1D-II-4: Editor con estados reales (1-2h)
└── 1D-II-5: Estados de error amigables (1h)

SEMANA 2
├── 1D-III-1: Permisos mock por rol (2-3h)
├── 1D-III-2: Bitácora / historial (3-4h)
└── 1D-III-3: Panel MS365 Readiness (1-2h)

SEMANA 2-3
├── 1D-IV-1: Checklist QA visual completo
└── 1D-IV-2: Documentación final cerrada
```

---

## Resultado Esperado

Al terminar la Fase 1D, el sistema cumple esto:

- ✅ Flujo completo de trabajo funciona end-to-end en mock
- ✅ Las páginas no leen JSON directamente — usan servicios
- ✅ Los servicios están listos para reemplazarse con llamadas HTTP reales
- ✅ Los contratos de datos documentan la forma exacta que el backend debe respetar
- ✅ Los permisos mock están listos para conectarse a roles reales del backend
- ✅ La bitácora tiene estructura lista para alimentarse desde la base de datos
- ✅ El QA visual garantiza que no hay inconsistencias antes de publicar
- ✅ La documentación refleja el estado real del proyecto

**Después de la Fase 1D, el backend puede construirse con total claridad.**

---

## Open Questions

> [!IMPORTANT]
> Antes de ejecutar, confirma estas decisiones:

1. **¿El flujo de "Subir plantilla" debe simular clasificación con IA?** (sugerir tipo y grupo automáticamente basado en el nombre del archivo, o quieres que el usuario lo llene siempre manualmente)

2. **¿La bitácora es una sección propia en el menú principal, o una pestaña dentro de Biblioteca/Dashboard?**

3. **¿Los permisos deben ocultar botones o mostrarlos deshabilitados con tooltip "Sin permisos"?** (Ocultar es más limpio visualmente; mostrar deshabilitado es más informativo)

4. **¿El flujo "Crear documento" es un modal paso a paso o una página nueva?** (Modal es más fluido; página nueva permite más espacio para elegir plantilla)

5. **¿El nombre correcto del proyecto es `SGDI_WEB` o `SGDI Web`?** (para corregir de forma consistente en todos los archivos)
