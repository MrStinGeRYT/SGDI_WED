# SGDI Web — Documentación Técnica del Proyecto

**Sistema de Gestión de Documentos Institucionales**
Versión: 1.0.0 | Estado: Fase 1C (Frontend Mock Completo)

---

## 1. Descripción General

**SGDI Web** es una aplicación web institucional diseñada para centralizar y estandarizar la creación, clasificación, almacenamiento y distribución de documentos oficiales dentro de una institución educativa o de investigación.

### Propósito

Las instituciones generan un volumen alto de documentos formales: oficios, constancias, memorándums, actas, informes. Esos procesos suelen ser manuales, dispersos y difíciles de rastrear. SGDI Web busca resolverlo mediante:

- Una **biblioteca centralizada** de plantillas documentales institucionales
- Un flujo de **creación y generación de documentos** a partir de esas plantillas
- **Envío institucional** de documentos vía Microsoft 365 / Outlook
- **Trazabilidad completa**: quién creó, editó y distribuyó cada documento
- Futura integración con **IA** para clasificación y análisis documental

### Estado actual

El sistema se encuentra en su fase de construcción del frontend. Toda la lógica de datos es **simulada (mock)**. La interfaz está completamente construida y lista para conectarse a servicios reales en fases posteriores.

---

## 2. Módulos del Sistema

### 2.1 Login (`/login`)

- Formulario de usuario y contraseña con validación
- Panel visual animado con partículas (estética tecnológica institucional)
- Soporte completo para modo claro y oscuro
- Validación de credenciales contra `mockUsers.json`
- Redirige al Dashboard tras autenticación exitosa
- **Mock:** La autenticación es local, sin backend real

### 2.2 Dashboard (`/dashboard`)

- Métricas clave: documentos totales, plantillas activas, correos enviados
- Estado de integraciones (IA, Microsoft 365, servidor)
- Accesos directos a las secciones principales
- **Mock:** Los datos estadísticos provienen de `mockDashboard.json`

### 2.3 Biblioteca de Plantillas (`/biblioteca`)

- Búsqueda en tiempo real por título o etiquetas
- Filtros por tipo documental y grupo funcional
- Vista alternativa: tabla o cuadrícula de tarjetas
- Acciones por plantilla: Ver detalle, Editar, Analizar, Clasificar, Archivar, Eliminar
- Modal de detalle con metadatos y trazabilidad (nombre + rol del uploader)
- Confirmación antes de archivar (`ConfirmDialog`) y notificación de éxito (`Toast`)
- Estado vacío cuando no hay resultados (`EmptyState`)
- En móvil: menú kebab con todas las acciones (`RowActionsMenu`)
- **Mock:** Datos de `mockTemplates.json`

### 2.4 Gestión de Documentos (`/documentos`)

- Búsqueda por título de documento
- Indicadores de integración: sincronización con nube y estado de envío
- Estado del documento: Borrador, Enviado, Archivado
- Trazabilidad: quién creó y con qué rol
- Acciones: Previsualizar, Editar, Descargar, Enviar, Archivar
- **Mock:** Datos de `mockDocuments.json`

### 2.5 Editor de Documento (`/documentos/:id`)

- Layout de dos paneles: área de edición central + panel de metadatos lateral
- Área de texto estilizada que simula una hoja de papel (sin librerías externas)
- Barra de acciones: Guardar, Subir a nube, Enviar — con feedback mediante `Toast`
- **Mock:** No persiste datos; simula retardo de 800ms

### 2.6 Correos Institucionales (`/correos`)

- Formulario de redacción: Para, CC, Asunto, Adjunto, Mensaje
- Historial de envíos en tabla con estado de entrega
- Validación con Toast de error; confirmación con Toast de éxito
- **Mock:** Datos de `mockEmails.json`. No envía correos realmente

### 2.7 Configuración (`/configuracion`)

Organizada en 3 pestañas mediante el componente `Tabs`:

1. **Integraciones y Estado:** Indicadores visuales de IA y MS365
2. **Configuración Documental:** Tipos documentales y grupos funcionales
3. **Preferencias:** Toggle de modo oscuro

### 2.8 Ayuda y Asistente (`/ayuda`)

- Tarjetas de acceso rápido a guías del sistema
- FAQ expandible con el componente `Accordion`
- Panel de chat simulado (asistente IA en modo demo)

---

## 3. Estructura del Proyecto

```
SGDI_WED/
├── public/
├── src/
│   ├── App.jsx              # Router principal y providers anidados
│   ├── main.jsx             # Punto de entrada de React
│   ├── index.css            # CSS global de entrada
│   │
│   ├── components/
│   │   ├── layout/          # AppLayout, Sidebar, Header, Breadcrumb
│   │   ├── login/           # ParticleBackground (efecto visual login)
│   │   └── ui/              # Componentes reutilizables de interfaz
│   │
│   ├── context/
│   │   ├── AppContext.jsx   # Tema, sidebar, estado del sistema
│   │   ├── AuthContext.jsx  # Autenticación del usuario
│   │   ├── ToastContext.jsx # Sistema global de notificaciones
│   │   └── Toast.css
│   │
│   ├── data/                # Archivos JSON con datos mock
│   │
│   ├── pages/               # Una carpeta por módulo/ruta
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── Biblioteca/
│   │   ├── Documentos/
│   │   ├── Correos/
│   │   ├── Configuracion/
│   │   └── Ayuda/
│   │
│   ├── services/
│   │   └── authService.js   # Lógica de autenticación mock
│   │
│   ├── styles/
│   │   ├── base/            # reset.css, variables.css, typography.css
│   │   ├── components/      # buttons.css, cards.css, forms.css, badges.css
│   │   ├── layout/          # sidebar.css, header.css, layout.css
│   │   └── responsive/      # breakpoints.css
│   │
│   └── utils/
│       ├── constants.js     # Rutas, estados del sistema, constantes
│       └── formatters.js    # Funciones de formato de fechas y textos
│
├── package.json
└── vite.config.js
```

---

## 4. Componentes Reutilizables

Todos usan variables CSS del design system. Soporte automático de modo claro/oscuro.

| Componente | Descripción |
|---|---|
| `Button` | Variantes: primary, secondary, outline, ghost, danger. Soporta íconos y loading. |
| `Card` | Contenedor con sub-componentes `Card.Header`, `Card.Body`, `Card.Title`. |
| `Badge` | Etiqueta de estado con variantes de color y punto indicador opcional. |
| `Table` | Columnas configurables, cabeceras sticky, scroll horizontal en móvil. |
| `Modal` | Overlay con soporte de footer y tamaños (sm/md/lg). Cierre con Escape. |
| `ConfirmDialog` | Modal para confirmar acciones irreversibles. Construido sobre `Modal`. |
| `RowActionsMenu` | Desktop: botones inline. Móvil (<768px): menú kebab desplegable. |
| `EmptyState` | Pantalla unificada para listas vacías o búsquedas sin resultados. |
| `Tabs` | Navegación por pestañas. Usado en Configuración. |
| `Accordion` | Lista expandible. Usado en FAQ de Ayuda. |
| `StatusIndicator` | Indicador visual del estado de IA y MS365. |

---

## 5. Tecnologías Usadas

| Tecnología | Versión | Propósito |
|---|---|---|
| React | 19 | Framework principal. Componentes funcionales con Hooks. |
| Vite | 8 | Servidor de desarrollo y bundler. Inicio instantáneo. |
| React Router DOM | 7 | Navegación con rutas declarativas y protección de rutas privadas. |
| Context API | (React nativo) | Estado global: autenticación, tema, sidebar, notificaciones. |
| CSS modular | — | Estilos en capas: base → componentes → layout → responsive. |
| CSS Custom Properties | — | Design system de tokens para colores, espaciado, tipografía. |
| Lucide React | 1.8 | Íconos SVG ligeros y consistentes. |
| JSON estático | — | Mock data que simula respuestas de API. |
| localStorage | (Web API) | Persistencia del tema entre sesiones del navegador. |

> **¿Por qué CSS puro y no Tailwind?** Se eligió CSS modular con variables para mantener control total del design system institucional, simplificar el dark mode y hacer el código legible sin conocimiento previo de Tailwind.

---

## 6. Modo Claro / Oscuro y Responsive

### Modo Claro / Oscuro

El sistema aplica el atributo `data-theme` al elemento `<html>`:

```css
:root[data-theme="light"] { --color-bg: #f8fafc; ... }
:root[data-theme="dark"]  { --color-bg: #0f172a; ... }
```

**Flujo completo:**
1. Al cargar la app, `AppContext` lee la preferencia de `localStorage` (clave `sgdi_theme`)
2. Aplica el atributo inmediatamente — sin parpadeo visible
3. El usuario cambia el tema desde **Configuración → Preferencias**
4. El cambio es instantáneo porque todos los componentes usan variables CSS

### Responsive

| Breakpoint | Ancho | Dispositivo |
|---|---|---|
| Mobile | < 640px | Teléfonos |
| Tablet | 640px – 1024px | Tablets |
| Desktop | 1024px – 1280px | Laptops |
| Wide | > 1280px | Monitores |

- El sidebar se colapsa en tablet y se convierte en panel deslizante con overlay en móvil
- Las tablas hacen scroll horizontal
- Los formularios y tarjetas se apilan verticalmente
- Los modales ocupan pantalla completa en móvil

---

## 7. Datos Mock (`src/data/`)

| Archivo | Contenido | Consumido en |
|---|---|---|
| `mockUsers.json` | 5 usuarios con nombre, rol, email, iniciales | Login, trazabilidad |
| `mockTemplates.json` | 5 plantillas con metadatos y trazabilidad de uploader | Biblioteca |
| `mockDocuments.json` | 5 documentos con estados de integración y trazabilidad | Documentos, Editor |
| `mockEmails.json` | Historial de correos con estado de entrega | Correos |
| `mockDashboard.json` | Métricas de resumen del sistema | Dashboard |
| `documentTypes.json` | Tipos documentales y grupos funcionales | Biblioteca, Documentos, Configuración |

Los datos mock permiten desarrollar y validar la interfaz completa sin necesitar un backend. Cuando el backend esté listo, cada JSON se reemplaza por una llamada a la API correspondiente sin cambiar la UI.

---

## 8. Qué Partes Todavía No Son Reales

| Función | Estado actual | Plan futuro |
|---|---|---|
| Autenticación | JSON local | OAuth institucional o JWT |
| Guardado de documentos | Simula 800ms, no persiste | Backend con base de datos |
| Microsoft 365 | Botón sin acción real | OAuth MS365 + Graph API |
| Envío de correos | Toast de éxito, no envía | Outlook API |
| Almacenamiento en nube | Iconos de estado, sin sync | OneDrive / SharePoint |
| Inteligencia Artificial | Modo "IA Local" (badge), sin procesamiento | Modelo NLP de clasificación |
| Subida de plantillas | Botón presente, sin funcionalidad | Upload de .docx al servidor |
| Clasificación documental | Toast informativo | Clasificación automática con IA |

---

## 9. Extensiones Recomendadas para VS Code

| Extensión | ID | Utilidad |
|---|---|---|
| Prettier | `esbenp.prettier-vscode` | Formatea el código automáticamente al guardar. Mantiene estilo consistente en el equipo. |
| ESLint | `dbaeumer.vscode-eslint` | Detecta errores de lógica y malas prácticas en JavaScript/JSX en tiempo real. |
| Error Lens | `usernamehw.errorlens` | Muestra errores y advertencias directamente en la línea afectada, sin abrir el panel. |
| Auto Rename Tag | `formulahendry.auto-rename-tag` | Al renombrar una etiqueta de apertura en JSX, actualiza automáticamente la de cierre. |
| Path Intellisense | `christian-kohler.path-intellisense` | Autocompletado de rutas de archivos en `import`. Evita errores de ruta manual. |
| ES7+ React Snippets | `dsznajder.es7-react-js-snippets` | Atajos para crear componentes (`rfce`), hooks y exports rápidamente. |
| GitLens | `eamodio.gitlens` | Muestra quién modificó cada línea y cuándo. Esencial para trabajo colaborativo. |
| CSS Variable Autocomplete | `vunguyentuan.vscode-css-variables` | Autocompletado de variables CSS (`--color-primary`, etc.) en archivos `.css` y `.jsx`. |
| Color Highlight | `naumovs.color-highlight` | Visualiza colores hex/rgb como muestra de color directamente en el editor. |

---

## 10. Cómo Correr el Proyecto

### Requisitos previos

- **Node.js** v18 o superior → [nodejs.org](https://nodejs.org)
- **npm** (incluido con Node.js)
- **Microsoft Edge** u otro navegador moderno

### Pasos

```bash
# 1. Accede al directorio del proyecto
cd C:\Users\aleja\Documents\SGDI_WED

# 2. Instala las dependencias (solo la primera vez)
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

Abre en el navegador: **http://localhost:5173/**

```powershell
# Abre directamente con Microsoft Edge desde PowerShell
start msedge http://localhost:5173/
```

### Credenciales mock

| Usuario | Contraseña |
|---|---|
| `amartinez` | `admin123` |
| `mgonzalez` | `pass123` |
| `rtorres` | `pass123` |

### Comandos disponibles

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Bundle de producción en `/dist` |
| `npm run preview` | Vista previa del build de producción |
| `npm run lint` | Revisión de ESLint sobre todo el código |

### Solución de problemas comunes

- **Puerto ocupado:** Vite sugiere automáticamente el siguiente (5174, 5175…)
- **Módulo no encontrado:** Ejecuta `npm install` de nuevo
- **Vite no reconocido en PowerShell:** Usa `cmd /c npm run dev` para evitar restricciones de política de ejecución de scripts

---

## 11. Buenas Prácticas para el Equipo

### Estructura

- Cada página vive en `src/pages/NombrePagina/` junto con su propio CSS
- Los componentes reutilizables van siempre en `src/components/ui/` — nunca duplicados en páginas
- Los estilos globales van en `src/styles/` — no meter estilos de sistema dentro de un componente de página

### Reutilización

- Antes de crear un componente, revisa si ya existe uno en `ui/` que puedas extender
- Usa `ConfirmDialog` para cualquier acción irreversible (eliminar, archivar)
- Usa `EmptyState` para cualquier lista que pueda estar vacía
- Usa `RowActionsMenu` para acciones en tablas — nunca botones inline sin este componente
- Usa `showToast()` del `ToastContext` para feedback — **nunca uses `alert()`**

### Estilos

- Todos los colores, espaciados y radios deben usar variables CSS de `variables.css`
- No uses valores en duro como `#1e293b` o `16px` directamente; busca la variable correspondiente
- Usa los breakpoints definidos en `styles/responsive/breakpoints.css`, no agregues nuevos puntos de quiebre

### Dark Mode y Responsive

- Prueba siempre en tres anchos: 375px (móvil), 768px (tablet), 1280px (desktop)
- Después de agregar un componente nuevo, activa el modo oscuro desde Configuración y verifica el contraste
- Si agregas un formulario, asegúrate de que funcione correctamente en `dark` antes de marcar como completo

### Dependencias

- **No agregues dependencias sin discutirlo con el equipo.** El proyecto es deliberadamente ligero
- El editor de documentos usa `textarea` estilizado — no instalar editores de texto enriquecido por ahora
- Evita librerías de componentes completas (Material UI, Ant Design) — el proyecto tiene su propio design system

### Control de versiones

- Haz commits pequeños y descriptivos: `feat: agregar modal de detalle en Biblioteca`
- No subas archivos `.env`, credenciales ni rutas absolutas de tu máquina
- Antes de hacer merge, ejecuta `npm run lint` y verifica que no haya errores

---

## Apéndice: Modelo de Trazabilidad de Usuarios

El sistema distingue entre **persona** y **rol** en todos los registros de trazabilidad.

### Campos disponibles

**Plantillas (`mockTemplates.json`):**
```
uploadedById    → ID del usuario
uploadedByName  → Nombre completo (ej: "Dra. María González")
uploadedByRole  → Rol del usuario (ej: "Coordinadora Académica")
```

**Documentos (`mockDocuments.json`):**
```
createdById / createdByName / createdByRole
updatedById / updatedByName / updatedByRole
```

### Usuarios del sistema (mock)

| ID | Nombre | Rol | Email |
|---|---|---|---|
| usr-001 | Dr. Alejandro Martínez | Administrador | amartinez@institucion.edu.mx |
| usr-002 | Dra. María González | Coordinadora Académica | mgonzalez@institucion.edu.mx |
| usr-003 | Lic. Roberto Torres | Asistente Administrativo | rtorres@institucion.edu.mx |
| usr-004 | Mtra. Ana López | Responsable Documental | alopez@institucion.edu.mx |
| usr-005 | Ing. Juan Ramos | Editor Institucional | jramos@institucion.edu.mx |

---

*Documento generado: 17 de abril de 2026 — SGDI Web Fase 1C completada.*
