# Rediseño del Editor Institucional — SGDI Web

## A. Diagnóstico del editor actual

### Qué problema tiene hoy

El editor actual (`DocumentoEditPage.jsx`) es un **textarea libre dentro de una hoja simulada**. Funciona como bloc de notas estilizado:

```
[ Hoja blanca ]
  <textarea>
    Escribe aquí lo que quieras...
  </textarea>
```

**Problemas concretos:**

1. **Sin estructura documental.** El usuario puede escribir cualquier cosa en cualquier orden. No hay encabezado, número de oficio, destinatario definido, ni firma.
2. **Sin plantilla real.** El campo `templateSource` en el documento existe pero el editor lo ignora. La plantilla seleccionada en el paso 1 del `CreateDocumentModal` no influye en nada que el usuario vea en el editor.
3. **Sin vista previa fiel.** La hoja se parece visualmente a un papel, pero el contenido no se parece a un documento institucional real.
4. **Sin campos controlados.** Todo es texto libre; no hay fecha, número de oficio, cargo del firmante, destinatario estructurado.
5. **Sin imágenes institucionales.** No hay membrete, no hay logo, no hay pie de página.
6. **Sin exportación.** El botón "Guardar" persiste en memoria mock, pero no produce ningún archivo.

### Por qué no satisface el caso institucional

Un oficio institucional real tiene esta estructura obligatoria:

```
[LOGO]  [NOMBRE INSTITUCIÓN]   [LOGO FACULTAD]
        [NOMBRE DEPARTAMENTO]

        Num. Oficio: FCI-DAC-2026-042
        Lugar, fecha

        [DESTINATARIO]
        [CARGO DESTINATARIO]
        [PRESENTE]

        ASUNTO: [ASUNTO]

        [CUERPO DEL DOCUMENTO]

        Atentamente
        [FIRMA]
        [NOMBRE FIRMANTE]
        [CARGO FIRMANTE]

        c.c.p. [COPIAS]
```

Ninguno de esos campos existe como campo controlado en el editor actual.

### Qué expectativas falsas evitar

> ❌ "El sistema leerá el `.docx` y lo mostrará idéntico dentro del navegador"
> ❌ "El usuario podrá editar el Word como en Word"
> ❌ "El formato del archivo original se preservará al 100%"
> ❌ "Podrás insertar tablas, imágenes complejas, estilos personalizados libremente"

Lo que sí es realista y valioso:

> ✅ "El sistema te guía para generar un oficio correcto según el formato institucional"
> ✅ "Llenas los campos y el sistema construye el documento bien formado"
> ✅ "El resultado final se exporta como `.docx` listo para firma"

---

## B. Filosofía del nuevo modelo

> **El editor no es Word dentro del navegador.**
> **Es un formulario inteligente que produce documentos institucionales formateados.**

El modelo de trabajo es:

```
Plantilla institucional (schema)
    ↓
Define qué campos tiene (fecha, destinatario, cuerpo, firmante…)
    ↓
El usuario llena esos campos (panel derecho)
    ↓
Vista previa en tiempo real (hoja izquierda)
    ↓
Exportación como .docx o PDF
```

---

## C. Nueva arquitectura de datos propuesta

### Problema actual del schema de plantilla

Hoy `mockTemplates.json` solo tiene metadatos generales. No sabe qué campos tiene cada tipo documental:

```json
// Hoy: solo metadatos
{ "id": "tpl_001", "type": "oficio", "title": "...", "fileName": "..." }
```

### Lo que necesitamos agregar

Cada plantilla (o tipo documental base) necesita definir su **schema de campos**:

```json
{
  "id": "tpl_001",
  "type": "oficio",
  "title": "Oficio de Asignación de Jurado",
  "fields": [
    { "id": "numero_oficio",    "label": "Número de oficio",    "type": "text",     "required": true,  "placeholder": "FCI-DAC-2026-001" },
    { "id": "lugar_fecha",      "label": "Lugar y fecha",       "type": "date",     "required": true  },
    { "id": "destinatario",     "label": "Destinatario",        "type": "text",     "required": true,  "placeholder": "Dr. Juan Pérez García" },
    { "id": "cargo_dest",       "label": "Cargo del destinatario", "type": "text",  "required": true,  "placeholder": "Director de Posgrado" },
    { "id": "asunto",           "label": "Asunto",              "type": "text",     "required": true  },
    { "id": "cuerpo",           "label": "Cuerpo del documento","type": "textarea", "required": true  },
    { "id": "firmante",         "label": "Firmante",            "type": "text",     "required": true  },
    { "id": "cargo_firmante",   "label": "Cargo del firmante",  "type": "text",     "required": true  },
    { "id": "copia",            "label": "c.c.p.",              "type": "text",     "required": false, "placeholder": "Archivo, Interesado..." },
    { "id": "anexos",           "label": "Anexos",              "type": "text",     "required": false }
  ],
  "layout": "oficio"
}
```

Este schema permite:
- Renderizar automáticamente el panel de campos
- Construir la vista previa en tiempo real
- Definir qué campos son obligatorios
- En el futuro, mapear a marcadores `{{campo}}` en un `.docx` real

### Schemas por tipo documental base

| Tipo | Layout | Campos clave |
|---|---|---|
| `oficio` | Oficio formal | número, fecha, destinatario, cargo, asunto, cuerpo, firmante, cargo firmante, copia |
| `constancia` | Constancia | beneficiario, cargo, asunto de constancia, periodo, cuerpo, firmante |
| `memorandum` | Memo interno | para, de, fecha, asunto, cuerpo, firma |
| `acta` | Acta de reunión | fecha, lugar, asistentes, orden del día, acuerdos, cierre |
| `informe` | Informe | título, periodo, área, introducción, desarrollo, conclusiones, responsable |

---

## D. Nuevo layout del editor

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Volver   [Título del documento]   Guardar  Nube  Enviar  Exportar │
├────────────────────────────────┬────────────────────────────────┤
│                                │                                │
│    VISTA PREVIA DEL DOCUMENTO  │    PANEL DE CAMPOS             │
│    ┌──────────────────────┐    │    ┌────────────────────────┐  │
│    │  [LOGO]  [INSTITUCIÓN]│    │    │ 📋 Campos del documento │  │
│    │  [MEMBRETE]          │    │    │                        │  │
│    │                      │    │    │ Número de oficio:      │  │
│    │  Núm: FCI-001-2026   │    │    │ [__________________]   │  │
│    │  Lugar, 24 abr 2026  │    │    │                        │  │
│    │                      │    │    │ Fecha:                 │  │
│    │  Dr. Juan Pérez       │    │    │ [24/04/2026        ]   │  │
│    │  Director de Posgrado │    │    │                        │  │
│    │  PRESENTE             │    │    │ Destinatario:          │  │
│    │                      │    │    │ [__________________]   │  │
│    │  ASUNTO: ...         │    │    │                        │  │
│    │                      │    │    │ Cargo:                 │  │
│    │  Por medio...        │    │    │ [__________________]   │  │
│    │                      │    │    │                        │  │
│    │  Atentamente,         │    │    │ Asunto:                │  │
│    │  Dra. María González  │    │    │ [__________________]   │  │
│    │  Coordinadora         │    │    │                        │  │
│    │  [PIE INSTITUCIONAL]  │    │    │ Cuerpo:                │  │
│    └──────────────────────┘    │    │ [                  ]   │  │
│                                │    │ [   textarea       ]   │  │
│                                │    │                        │  │
│                                │    │ 📎 Metadatos           │  │
│                                │    │ 🔗 Estado integración  │  │
│                                │    └────────────────────────┘  │
└────────────────────────────────┴────────────────────────────────┘
```

**Principio clave:** La vista previa es de solo lectura. El usuario edita en el panel derecho. El documento se reconstruye automáticamente con cada cambio.

---

## E. Componentes a crear

### Nuevos (todos en `src/pages/Documentos/`)

| Componente | Propósito |
|---|---|
| `DocumentPreview.jsx` | Renderiza la hoja A4 con el contenido del documento usando los valores de los campos. Recibe `fields`, `values`, `layout`. |
| `DocumentPreview.css` | Estilos de la hoja: membrete, logo, márgenes, tipografía institucional, pie de página |
| `FieldsPanel.jsx` | Panel lateral con los campos editables generados dinámicamente desde el schema. Recibe `fields`, `values`, `onChange`. |
| `FieldsPanel.css` | Estilos del panel de campos |
| `layouts/OficioLayout.jsx` | Template visual HTML del oficio (estructura con placeholders) |
| `layouts/ConstanciaLayout.jsx` | Template visual de constancia |
| `layouts/MemoLayout.jsx` | Template visual de memorándum |
| `layouts/ActaLayout.jsx` | Template visual de acta |
| `layouts/InformeLayout.jsx` | Template visual de informe |

### Datos nuevos

| Archivo | Propósito |
|---|---|
| `src/data/templateSchemas.json` | Schemas de campos por tipo documental |
| `src/data/institutionalAssets.js` | Logos, nombre de institución, datos del membrete (constantes) |

### Servicios a extender

| Servicio | Qué se agrega |
|---|---|
| `templateService.js` | `getTemplateSchema(templateId)` → devuelve el schema de campos |
| `documentService.js` | Guardar `fields` (objeto con valores de cada campo) junto con el documento |

### Archivos existentes que cambian

| Archivo | Qué cambia |
|---|---|
| `DocumentoEditPage.jsx` | Se reescribe completamente. Pasa de `textarea` libre a orquestador de `DocumentPreview` + `FieldsPanel` |
| `DocumentoEdit.css` | Se reescribe el layout para el nuevo diseño de dos paneles |
| `mockDocuments.json` | Se agrega campo `fields: {}` con los valores de cada campo del documento |
| `mockTemplates.json` | Se agrega `fields: []` (schema) y `layout: "oficio"` a cada plantilla |
| `documentService.js` | `updateDocument()` guarda también el objeto `fields` |

### Archivos que NO cambian

- Toda la arquitectura de servicios, contextos, hooks
- `BibliotecaPage`, `DocumentosPage`, `CreateDocumentModal`, `UploadTemplateModal`
- El sistema de permisos, toast, auditService
- El diseño general del sistema (sidebar, header, theme)

---

## F. Plan de implementación por fases

### Fase E1 — Rediseño visual del editor (Layout + Hoja)

**Objetivo:** El editor tiene el nuevo layout de dos paneles. La hoja muestra una estructura de oficio fija (sin campos dinámicos todavía). El `textarea` desaparece.

**Entregables:**
- `DocumentoEdit.css` reescrito
- `DocumentPreview.jsx` + `DocumentPreview.css` con hoja A4, membrete fijo, logo placeholder, pie
- `layouts/OficioLayout.jsx` como primer layout institucional
- `DocumentoEditPage.jsx` usa el nuevo layout

**Resultado visible:** La hoja se ve como un oficio institucional real, con membrete, logo, espaciado y tipografía correctos. El contenido es aún estático/hardcoded.

---

### Fase E2 — Schema de campos y panel dinámico

**Objetivo:** El panel derecho renderiza los campos del documento dinámicamente basados en el tipo de plantilla. Los valores se guardan en estado React.

**Entregables:**
- `src/data/templateSchemas.json` con schemas para los 5 tipos documentales
- `FieldsPanel.jsx` + `FieldsPanel.css`
- `templateService.js` → `getTemplateSchema()`
- `mockTemplates.json` actualizado con `fields[]` y `layout`
- `mockDocuments.json` actualizado con `fields: {}`
- `documentService.js` persiste `fields` al guardar

**Resultado visible:** El usuario ve los campos correctos según el tipo de documento. Al escribir "Destinatario", ese dato aparece en la hoja.

---

### Fase E3 — Vista previa en tiempo real

**Objetivo:** La hoja se actualiza en tiempo real al editar los campos. Todos los layouts institucionales implementados.

**Entregables:**
- `layouts/ConstanciaLayout.jsx`
- `layouts/MemoLayout.jsx`
- `layouts/ActaLayout.jsx`
- `layouts/InformeLayout.jsx`
- `DocumentPreview.jsx` selecciona el layout según `doc.type`
- Preview con logo institucional real (SVG/PNG inline)

**Resultado visible:** Al escribir el nombre del destinatario en el panel derecho, aparece instantáneamente en la posición correcta de la hoja. El documento se ve como un documento institucional real.

---

### Fase E4 — Imágenes institucionales y variables

**Objetivo:** El membrete usa imágenes reales. Se puede cargar firma escaneada o imagen de anexo como campo opcional.

**Entregables:**
- `src/data/institutionalAssets.js` con logo (SVG inline o data URI)
- Campo tipo `image` en el schema para firma/anexo
- Upload local de imagen → se convierte a `data:base64` y se muestra en la hoja

**Resultado visible:** La hoja muestra el logo institucional real. El firmante puede agregar su firma escaneada como imagen.

---

### Fase E5 — Exportación a `.docx`

**Objetivo:** El botón "Exportar" genera un archivo `.docx` descargable con el contenido de los campos.

**Entregables:**
- Integración de `docx` (npm package — única dependencia externa justificada)
- `exportService.js` → `exportToDocx(doc, fields)` usando la biblioteca
- El `.docx` generado usa estilos institucionales predefinidos
- Botón "Exportar .docx" en el topbar funcional

> **Nota:** Esta es la única fase que requiere una dependencia externa. La biblioteca `docx` (o `docxtemplater`) permite generar `.docx` desde JavaScript puro sin Word. Se evalúa en esta fase.

---

## G. Decisiones de diseño que requieren tu aprobación

> [!IMPORTANT]
> **Decisión 1 — Logos e imágenes institucionales**
> En Fase E1 y E3 propongo usar un **logo placeholder SVG inline** dentro del código (sin subir archivos externos). ¿Tienes los logos de la institución como archivos? ¿O prefieres que diseñe un placeholder institucional genérico de alta calidad para esta etapa?

> [!IMPORTANT]
> **Decisión 2 — Nombre de la institución en el membrete**
> El membrete necesita mostrar: nombre de la institución, nombre de la facultad/departamento. ¿Quieres que use datos genéricos de placeholder (ej: "Universidad Institucional / Facultad de Ciencias de la Información") o tienes los datos reales para incluirlos?

> [!IMPORTANT]
> **Decisión 3 — ¿Por dónde empezamos?**
> Las fases E1, E2 y E3 son las más importantes y pueden implementarse sin dependencias externas. ¿Apruebas que empecemos por E1 (rediseño visual del layout) y avancemos fase por fase hasta E3? La exportación (E5) puede dejarse para después.

> [!NOTE]
> **Nota sobre `docx` en Fase E5**
> La única dependencia externa que se agregaría en todo este rediseño es `docx` o `docxtemplater` para la exportación real. Todo lo demás (layout, campos, vista previa) se hace con React + CSS puro. Esto es deliberado: no queremos un editor WYSIWYG de terceros.

---

## H. Impacto en la arquitectura actual

### Qué no rompe nada

- El flujo Biblioteca → Subir plantilla → Crear documento **no cambia**.
- `CreateDocumentModal` sigue funcionando igual.
- La navegación a `/documentos/:id` sigue igual.
- Los servicios existentes se **extienden**, no se reemplazan.
- El sistema de permisos, auditoría y trazabilidad se preserva completo.

### Qué sí cambia

- `DocumentoEditPage.jsx` se reescribe completamente (es el archivo central del cambio).
- `mockDocuments.json` y `mockTemplates.json` se extienden con nuevos campos.
- Se crean nuevos archivos dentro de `src/pages/Documentos/` y `src/data/`.

### Riesgo

Bajo. El editor es una página aislada. No tiene dependencias laterales con otros módulos del sistema.
