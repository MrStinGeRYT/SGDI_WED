# SGDI Web — Documentación Técnica del Proyecto

**Sistema de Gestión de Documentos Institucionales**
Versión: 1.0.0 | Estado: **Fase 1D Completada** — Frontend Mock Arquitecturalmente Listo para Backend

---

## 1. Descripción General

**SGDI Web** (`SGDI_WEB`) es una aplicación web institucional para centralizar la creación, clasificación, almacenamiento y distribución de documentos formales dentro de una institución educativa o de investigación.

- **Nombre visible para usuarios:** `SGDI Web`
- **Nombre técnico de carpeta / proyecto:** `SGDI_WEB`

### Propósito

Las instituciones generan un volumen alto de documentos formales: oficios, constancias, memorándums, actas, informes. Esos procesos suelen ser manuales, dispersos y difíciles de rastrear. SGDI Web resuelve esto mediante:

- **Biblioteca centralizada** de plantillas documentales institucionales
- Flujo de **creación de documentos** a partir de plantillas con asistente de clasificación
- **Envío institucional** de documentos vía Microsoft 365 / Outlook
- **Trazabilidad completa** por persona y rol: quién creó, editó y distribuyó cada documento
- **Bitácora de actividad** con historial de todas las acciones del sistema
- Futura integración con **IA** para clasificación y análisis documental

### Estado actual

El frontend está **completamente construido en modo mock**. Toda la lógica de datos pasa por una **capa de servicios frontend** que actúa como fachada. Cuando el backend esté listo, solo se reemplazan las implementaciones de los servicios — la UI no cambia.

---

## 2. Módulos del Sistema

### 2.1 Login (`/login`)

- Formulario de usuario y contraseña con validación
- Panel visual animado con partículas (canvas, efecto de red institucional)
- Soporte completo para modo claro y oscuro
- Validación de credenciales contra `mockUsers.json` vía `authService`
- Redirige al Dashboard tras autenticación exitosa
- **Mock:** Autenticación local sin backend real

### 2.2 Dashboard (`/dashboard`)

- Métricas clave: documentos totales, plantillas activas, correos enviados, pendientes
- Estado de integraciones (IA modo local, Microsoft 365 no configurado, servidor online)
- Accesos rápidos a las secciones principales
- Botón "Conectar Microsoft 365" conectado al servicio mock con feedback Toast
- **Mock:** Datos de `mockDashboard.json`

### 2.3 Biblioteca de Plantillas (`/biblioteca`)

- Búsqueda en tiempo real por título o etiquetas
- Filtros por tipo documental y grupo funcional (desde `documentTypes.json`)
- Vista alternativa: tabla o cuadrícula de tarjetas
- Acciones por plantilla: Ver detalle, Editar, Analizar, Clasificar, Archivar, Eliminar
- **Control de permisos:** botones deshabilitados con tooltip según rol del usuario
- **Modal subir plantilla:** arrastra o selecciona `.docx` → clasificación asistida automática (palabras clave) → revisión editable → guardado
- Modal de detalle con metadatos y trazabilidad (nombre + rol del uploader)
- Confirmación antes de archivar (`ConfirmDialog`) y notificación (`Toast`)
- En móvil: menú kebab (`RowActionsMenu`) con todas las acciones
- **Mock:** Datos vía `templateService` → `mockTemplates.json`

### 2.4 Gestión de Documentos (`/documentos`)

- Búsqueda por título de documento
- Indicadores de integración: estado nube (`cloudStatus`) y correo (`emailStatus`)
- Estado del documento: Borrador, Enviado, Archivado
- Trazabilidad: nombre y rol del creador
- **Modal crear documento (4 pasos):** Elegir plantilla → Datos básicos → Revisar resumen → Generando
- Acciones: Previsualizar, Editar (navega al editor), Descargar, Enviar, Archivar
- **Control de permisos** por rol en todas las acciones
- **Mock:** Datos vía `documentService` → `mockDocuments.json`

### 2.5 Editor de Documento (`/documentos/:id`)

- Carga el documento real vía `documentService.getDocumentById(id)`
- Layout de dos paneles: área de edición central (hoja estilizada) + panel lateral de metadatos
- **Topbar:** título editable, estado reactivo, botones con spinner
- **Guardar** → `documentService.updateDocument()` → Toast
- **Subir a nube** → `documentService.uploadToCloud()` → estado "Sincronizado" en verde → botón se deshabilita
- **Enviar** → `documentService.sendDocumentByEmail()` → estado "Enviado" en verde → botón se deshabilita
- **Panel lateral:** selects de Tipo y Grupo desde `documentTypes.json`, trazabilidad (createdByName/Role, updatedByName/Role), timestamps de creación y modificación, estado de integración reactivo
- **Mock:** Opera sobre datos en memoria del servicio; no persiste al recargar

### 2.6 Correos Institucionales (`/correos`)

- Formulario: Para, CC, Asunto, **Adjuntar documento** (cargado dinámicamente desde `documentService`), Mensaje
- El selector de adjuntos muestra todos los documentos reales del sistema — no opciones hardcoded
- El correo enviado registra `documentId`, `attachment` y `sentByName` para trazabilidad
- Historial de envíos en tabla con columnas: Asunto, Para, Fecha, Documento adjunto, Enviado por, Estado
- **Mock:** Datos vía `emailService` → `mockEmails.json`. No envía correos realmente

### 2.7 Bitácora de Actividad (`/bitacora`)

- Módulo dedicado con entrada en el sidebar
- Historial completo de todas las acciones del sistema (upload, create, edit, archive, send, etc.)
- Buscador por usuario, acción o documento
- Filtro por módulo (Biblioteca, Documentos, Correos, Configuración, Sistema)
- Métricas rápidas: registros totales, usuarios activos, acciones por módulo
- Cada entrada muestra: avatar con iniciales, nombre, rol, acción (badge con color), objetivo, módulo, timestamp
- **Fuente:** `auditService` — acumulador en memoria que registra automáticamente cada operación de los servicios

### 2.8 Configuración (`/configuracion`)

Organizada en 3 pestañas:

1. **Integraciones:** Estado del sistema (IA + MS365). Panel MS365 Readiness con 4 tarjetas:
   - **Outlook Mail** — envío de correos institucionales
   - **OneDrive** — almacenamiento y sincronización
   - **SharePoint** — repositorio compartido
   - **Microsoft Entra ID** — autenticación institucional
   Cada tarjeta incluye descripción, lista de características y badge "Disponible en Fase 2". Botón "Conectar Microsoft 365" con feedback Toast.
2. **Configuración Documental:** Tipos documentales y grupos funcionales de `documentTypes.json`
3. **Preferencias:** Toggle de modo claro/oscuro (persiste en `localStorage`)

### 2.9 Ayuda y Asistente (`/ayuda`)

- Tarjetas de acceso rápido a guías del sistema
- FAQ expandible con componente `Accordion`
- Panel de chat simulado (asistente IA en modo demo)

---

## 3. Arquitectura — Capa de Servicios Frontend

### 3.1 Patrón

La UI **nunca accede directamente a los JSON mock**. Todo pasa por servicios en `src/services/`:

```
UI Component
    ↓
Service (templateService / documentService / emailService / …)
    ↓
Mock data (JSON en memoria)    ← se reemplazará por HTTP/API en Fase 2
```

### 3.2 Servicios implementados

| Servicio | Archivo | Responsabilidad |
|---|---|---|
| `templateService` | `templateService.js` | CRUD de plantillas, clasificador local por palabras clave (`suggestClassification`) |
| `documentService` | `documentService.js` | CRUD de documentos, subida a nube, envío por correo |
| `emailService` | `emailService.js` | Envío y consulta de historial de correos |
| `dashboardService` | `dashboardService.js` | Métricas del sistema y actividad reciente |
| `auditService` | `auditService.js` | Registro automático de todas las acciones (bitácora) |
| `userService` | `userService.js` | Consulta del usuario en sesión |
| `ms365Service` | `ms365Service.js` | Estado y conexión mock con Microsoft 365, lista de integraciones |
| `authService` | `authService.js` | Login, logout, recuperación de sesión (localStorage) |

### 3.3 Contratos de datos

#### Plantilla (`mockTemplates.json`)
```json
{
  "id": "tpl_001",
  "title": "Plantilla Oficio Asignación",
  "description": "...",
  "fileName": "oficio_asignacion.docx",
  "type": "oficio",
  "functionalGroup": "jurados",
  "status": "active",
  "version": "1.0",
  "tags": ["oficio", "jurado"],
  "uploadedById": "usr-001",
  "uploadedByName": "Dr. Alejandro Martínez",
  "uploadedByRole": "Administrador",
  "lastUpdated": "2026-04-01T10:00:00Z"
}
```

#### Documento (`mockDocuments.json`)
```json
{
  "id": "doc_101",
  "title": "Oficio Asignación Jurado - Juan Pérez",
  "type": "oficio",
  "functionalGroup": "jurados",
  "status": "enviado",
  "content": "",
  "createdAt": "2026-04-16T10:00:00Z",
  "updatedAt": "2026-04-16T10:45:00Z",
  "createdById": "usr-002",
  "createdByName": "Dra. María González",
  "createdByRole": "Coordinadora Académica",
  "updatedById": "usr-001",
  "updatedByName": "Dr. Alejandro Martínez",
  "updatedByRole": "Administrador",
  "templateSource": "tpl_001",
  "cloudStatus": "synced",
  "emailStatus": "sent"
}
```

#### Entrada de Bitácora (generada por `auditService`)
```json
{
  "id": "evt_1714000000000",
  "action": "create_document",
  "actionLabel": "Documento creado",
  "target": "Oficio Asignación Jurado",
  "targetId": "doc_101",
  "module": "Documentos",
  "userId": "usr-001",
  "userName": "Dr. Alejandro Martínez",
  "userRole": "Administrador",
  "timestamp": "2026-04-25T10:00:00Z"
}
```

---

## 4. Control de Acceso por Rol

### 4.1 Principio

Los botones sin permiso se muestran **deshabilitados con tooltip** — nunca ocultos. Esto es deliberado: el usuario sabe que la función existe pero que su rol no la habilita.

### 4.2 Tabla de permisos por rol

| Permiso | Administrador | Coordinadora Académica | Responsable Documental | Asistente Administrativo | Editor Institucional |
|---|:---:|:---:|:---:|:---:|:---:|
| `template.upload` | ✅ | ✅ | ✅ | — | — |
| `template.edit` | ✅ | ✅ | — | — | ✅ |
| `template.archive` | ✅ | — | ✅ | — | — |
| `template.delete` | ✅ | — | — | — | — |
| `template.classify` | ✅ | ✅ | ✅ | — | — |
| `template.view` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `document.create` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `document.edit` | ✅ | ✅ | — | — | ✅ |
| `document.archive` | ✅ | — | ✅ | — | — |
| `document.delete` | ✅ | — | — | — | — |
| `document.send` | ✅ | ✅ | — | ✅ | — |
| `document.upload_cloud` | ✅ | ✅ | — | — | — |
| `email.send` | ✅ | ✅ | — | ✅ | — |
| `audit.view` | ✅ | ✅ | ✅ | — | — |
| `config.edit` | ✅ | — | — | — | — |

### 4.3 Implementación

```js
// hooks/usePermissions.js
const { can, noPermissionMsg } = usePermissions();

// En cualquier componente:
<Button
  disabled={!can('template.upload')}
  title={!can('template.upload') ? noPermissionMsg : undefined}
>
  Subir plantilla
</Button>
```

---

## 5. Estructura del Proyecto

```
SGDI_WEB/
├── public/
├── src/
│   ├── App.jsx                  # Router principal, ProtectedRoute, providers anidados
│   ├── main.jsx                 # Punto de entrada React
│   ├── index.css                # CSS global de entrada
│   │
│   ├── components/
│   │   ├── layout/              # AppLayout, Sidebar, Header, Breadcrumb
│   │   ├── login/               # ParticleBackground (efecto canvas login)
│   │   └── ui/                  # Componentes reutilizables de interfaz
│   │
│   ├── context/
│   │   ├── AppContext.jsx        # Tema, sidebar, estado del sistema
│   │   ├── AuthContext.jsx       # Autenticación del usuario
│   │   ├── ToastContext.jsx      # Sistema global de notificaciones
│   │   └── Toast.css
│   │
│   ├── data/                    # Archivos JSON con datos mock
│   │   ├── mockUsers.json
│   │   ├── mockTemplates.json
│   │   ├── mockDocuments.json
│   │   ├── mockEmails.json
│   │   ├── mockDashboard.json
│   │   └── documentTypes.json
│   │
│   ├── hooks/
│   │   └── usePermissions.js    # Hook para verificar permisos del usuario en sesión
│   │
│   ├── pages/
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── Biblioteca/          # BibliotecaPage + UploadTemplateModal
│   │   ├── Documentos/          # DocumentosPage + CreateDocumentModal + DocumentoEditPage
│   │   ├── Correos/
│   │   ├── Bitacora/            # BitacoraPage — módulo de historial de actividad
│   │   ├── Configuracion/       # Panel MS365 Readiness
│   │   └── Ayuda/
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── templateService.js   # Incluye suggestClassification()
│   │   ├── documentService.js
│   │   ├── emailService.js
│   │   ├── auditService.js      # Registro de bitácora
│   │   ├── userService.js
│   │   └── ms365Service.js      # MS365_INTEGRATIONS + connectMs365()
│   │
│   ├── styles/
│   │   ├── base/                # reset.css, variables.css, typography.css
│   │   ├── components/          # buttons.css, cards.css, forms.css, badges.css
│   │   ├── layout/              # sidebar.css, header.css, layout.css
│   │   └── responsive/          # breakpoints.css
│   │
│   └── utils/
│       ├── constants.js         # Rutas, estados del sistema, constantes globales
│       ├── permissions.js       # ROLE_PERMISSIONS + can() + getPermissions()
│       ├── formatters.js        # Formato de fechas, números, textos
│       └── errorMessages.js     # Mensajes de error centralizados
│
├── package.json
└── vite.config.js
```

---

## 6. Componentes Reutilizables (`src/components/ui/`)

Todos usan variables CSS del design system. Soporte automático de modo claro/oscuro.

| Componente | Descripción |
|---|---|
| `Button` | Variantes: primary, secondary, outline, ghost, danger. Íconos izq/der, loading, fullWidth. |
| `Card` | Sub-componentes: `Card.Header`, `Card.Body`, `Card.Title`, `Card.Actions`. |
| `Badge` | Etiqueta de estado con variantes y punto indicador opcional. |
| `Table` | Columnas configurables, cabeceras sticky, scroll horizontal en móvil. |
| `Modal` | Overlay con footer y tamaños (sm/md/lg). Cierre con Escape y click fuera. |
| `ConfirmDialog` | Modal para confirmar acciones irreversibles. Construido sobre `Modal`. |
| `RowActionsMenu` | Desktop: botones inline. Móvil (<768px): menú kebab desplegable. Soporta `disabled` + `tooltip`. |
| `EmptyState` | Pantalla unificada para listas vacías o sin resultados. |
| `Tabs` | Navegación por pestañas. Usado en Configuración. |
| `Accordion` | Lista expandible. Usado en FAQ de Ayuda. |
| `StatusIndicator` | Indicadores visuales de estado IA y MS365. |

---

## 7. Tecnologías

| Tecnología | Versión | Propósito |
|---|---|---|
| React | 19 | Framework principal. Componentes funcionales con Hooks. |
| Vite | 8 | Servidor de desarrollo y bundler. |
| React Router DOM | 7 | Rutas declarativas y protección de rutas privadas. |
| Context API | (React nativo) | Estado global: auth, tema, sidebar, toast. |
| CSS modular | — | Capas: base → componentes → layout → responsive. |
| CSS Custom Properties | — | Design system de tokens para colores, espaciado, tipografía. |
| Lucide React | 1.8 | Íconos SVG. |

> **¿Por qué CSS puro?** Control total del design system institucional, dark mode sin dependencias externas, legibilidad sin conocimiento previo de frameworks de CSS.

---

## 8. Modo Claro / Oscuro y Responsive

### Modo Claro / Oscuro

El sistema aplica `data-theme` al elemento `<html>`:

```css
:root[data-theme="light"] { --color-bg: #f8fafc; ... }
:root[data-theme="dark"]  { --color-bg: #0f172a; ... }
```

1. Al cargar, `AppContext` lee la preferencia de `localStorage` (`sgdi_theme`) — sin parpadeo
2. El toggle está en el Header y en Configuración → Preferencias
3. El cambio es instantáneo porque todos los componentes usan variables CSS

### Responsive

| Breakpoint | Ancho | Dispositivo |
|---|---|---|
| Mobile | < 640px | Teléfonos |
| Tablet | 640px – 1024px | Tablets |
| Desktop | 1024px – 1280px | Laptops |
| Wide | > 1280px | Monitores |

- Sidebar: colapsa en tablet, panel deslizante con overlay en móvil
- Tablas: scroll horizontal
- Formularios y tarjetas: se apilan verticalmente
- Modales: pantalla completa en móvil
- Editor: panel lateral pasa a estar debajo del área de texto en tablet/móvil

---

## 9. Datos Mock (`src/data/`)

| Archivo | Contenido | Servicio que lo consume |
|---|---|---|
| `mockUsers.json` | 5 usuarios con nombre, rol, email, iniciales | `authService`, `userService` |
| `mockTemplates.json` | 5 plantillas con metadatos y trazabilidad | `templateService` |
| `mockDocuments.json` | 5 documentos con estados de integración y trazabilidad | `documentService` |
| `mockEmails.json` | Historial de correos institucionales | `emailService` |
| `mockDashboard.json` | Métricas de resumen del sistema | `dashboardService` |
| `documentTypes.json` | Tipos documentales y grupos funcionales | `templateService`, `documentService`, Biblioteca, Documentos, Configuración |

Los JSON son el único punto de contacto con "el backend". Al conectar la API real, se reemplaza la implementación interna del servicio — la UI no cambia.

---

## 10. Usuarios del Sistema (Mock)

| ID | Nombre | Rol | Contraseña | Email |
|---|---|---|---|---|
| usr-001 | Dr. Alejandro Martínez | Administrador | `admin123` | amartinez@institucion.edu.mx |
| usr-002 | Dra. María González | Coordinadora Académica | `pass123` | mgonzalez@institucion.edu.mx |
| usr-003 | Lic. Roberto Torres | Asistente Administrativo | `pass123` | rtorres@institucion.edu.mx |
| usr-004 | Mtra. Ana López | Responsable Documental | `pass123` | alopez@institucion.edu.mx |
| usr-005 | Ing. Juan Ramos | Editor Institucional | `pass123` | jramos@institucion.edu.mx |

---

## 11. Estado Actual — Qué está listo para backend

### ✅ Listo (solo requiere reemplazar la implementación del servicio)

| Función | Contrato definido | Servicio mock | Preparado para API |
|---|:---:|:---:|:---:|
| Autenticación (login/logout) | ✅ | `authService` | ✅ |
| CRUD plantillas | ✅ | `templateService` | ✅ |
| Clasificación asistida de plantillas | ✅ | `suggestClassification()` | ✅ |
| CRUD documentos | ✅ | `documentService` | ✅ |
| Guardar cambios en editor | ✅ | `updateDocument()` | ✅ |
| Subida a nube | ✅ | `uploadToCloud()` | ✅ |
| Envío por correo | ✅ | `sendDocumentByEmail()` | ✅ |
| Historial de correos | ✅ | `emailService` | ✅ |
| Bitácora de actividad | ✅ | `auditService` | ✅ |
| Control de permisos por rol | ✅ | `permissions.js` | ✅ |
| Estado de integraciones MS365 | ✅ | `ms365Service` | ✅ |

### ⏳ Pendiente para Fase 2 (Backend Real)

| Función | Descripción |
|---|---|
| **Persistencia real** | La capa de servicios no persiste al recargar; requiere base de datos |
| **Autenticación JWT / OAuth** | Reemplazar `authService` con token real o Microsoft Entra ID |
| **Upload real de `.docx`** | `uploadTemplate` recibe el `File` object; conectar con endpoint `POST /templates` |
| **Microsoft 365 OAuth** | `connectMs365()` devuelve mock; conectar con flujo OAuth + Graph API |
| **Envío real de correos** | `sendEmail()` es mock; conectar con Outlook API |
| **Sincronización OneDrive** | `uploadToCloud()` es mock; conectar con Graph API / OneDrive |
| **IA de clasificación** | `suggestClassification()` usa palabras clave; reemplazar con modelo NLP |
| **Notificaciones en tiempo real** | Websocket o polling para actualizar bitácora y estados de documentos |

---

## 12. Cómo Correr el Proyecto

### Requisitos

- Node.js v18 o superior
- npm (incluido con Node.js)
- Microsoft Edge u otro navegador moderno

### Pasos

```bash
# 1. Accede al directorio del proyecto
cd C:\Users\aleja\Documents\SGDI_WEB

# 2. Instala dependencias (solo la primera vez)
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
# Si PowerShell bloquea el script, usa:
cmd /c npm run dev
```

Abre en el navegador: **http://localhost:5173/**

### Comandos disponibles

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Bundle de producción en `/dist` |
| `npm run preview` | Vista previa del build de producción |
| `npm run lint` | Revisión de ESLint |

---

## 13. Buenas Prácticas para el Equipo

### Reglas de oro

- **Nunca uses `alert()`** — usa siempre `showToast()` del `ToastContext`
- **Nunca accedas a JSON directamente** — siempre a través de los servicios en `src/services/`
- **Antes de crear un componente**, revisa si ya existe en `src/components/ui/`
- **Usa `ConfirmDialog`** para cualquier acción irreversible
- **Usa `RowActionsMenu`** para acciones en filas de tabla — nunca botones sueltos
- **No instales dependencias** sin discutirlo con el equipo
- **Prueba en tres anchos:** 375px (móvil), 768px (tablet), 1280px (desktop)
- **Activa dark mode** después de cualquier cambio visual y verifica contraste

### Nomenclatura

- Inglés para nombres técnicos (archivos, variables, funciones, IDs en JSON)
- Español para textos de interfaz (labels, mensajes, placeholders, tooltips)
- Nombre técnico del proyecto: `SGDI_WEB` | Nombre visible: `SGDI Web`

### Trazabilidad

Todos los registros de creación y modificación deben incluir:
```
_ById   → ID del usuario  (ej: "usr-001")
_ByName → Nombre completo (ej: "Dr. Alejandro Martínez")
_ByRole → Rol del usuario (ej: "Administrador")
```

Los departamentos **no** son autores. La trazabilidad se basa en `persona` + `rol`.

---

## 14. Extensiones Recomendadas para VS Code

| Extensión | ID |
|---|---|
| Prettier | `esbenp.prettier-vscode` |
| ESLint | `dbaeumer.vscode-eslint` |
| Error Lens | `usernamehw.errorlens` |
| Auto Rename Tag | `formulahendry.auto-rename-tag` |
| Path Intellisense | `christian-kohler.path-intellisense` |
| ES7+ React Snippets | `dsznajder.es7-react-js-snippets` |
| CSS Variable Autocomplete | `vunguyentuan.vscode-css-variables` |

---

*Documentación actualizada: 24 de abril de 2026 — **SGDI Web Fase 1D completada.** Frontend mock arquitecturalmente listo para backend.*
