# SGDI Web — Fase 1D: Tareas pendientes

## BLOQUE A — Editor conectado a documentService
- [x] Reescribir `DocumentoEditPage.jsx` para usar `documentService`
  - [x] Cargar documento via `getDocumentById(id)`
  - [x] handleSave → `updateDocument()`
  - [x] handleCloud → `uploadToCloud()`
  - [x] handleSend → `sendDocumentByEmail()`
  - [x] Panel lateral reactivo (cloudStatus, emailStatus reales)
  - [x] Selects de tipo y grupo desde `documentTypes.json`
  - [x] Trazabilidad: muestra createdByName/Role en panel lateral
  - [x] Timestamps de creación y modificación
  - [x] Spinner y estados disabled durante operaciones

## BLOQUE B — Correos con adjuntos dinámicos
- [x] Cargar documentos del servicio en `CorreosPage.jsx`
- [x] Select de adjuntos dinámico con documentos reales
- [x] Registrar `documentId` y `attachment` en correo enviado
- [x] Columna `sentByName` en historial de envios

## BLOQUE C — Panel MS365 Readiness
- [x] Integrar `MS365_INTEGRATIONS` en `ConfiguracionPage.jsx`
- [x] Tarjetas de 4 integraciones (Outlook, OneDrive, SharePoint, Entra ID)
- [x] Cada tarjeta con icono, descripción, features y badge de fase
- [x] Botón Conectar llama a `connectMs365()` con feedback toast
- [x] `Configuracion.css` con estilos de tarjetas
- [x] Import correcto del CSS

## BLOQUE D — QA Final
- [x] Verificar que no queden `alert()` nativos: ✅ ninguno encontrado
- [x] Servidor Vite arrancado sin errores
- [x] Edge abierto para verificación manual
- [ ] Revisar dark mode en todas las páginas (manual)
- [ ] Revisar responsive en mobile/tablet (manual)
- [ ] Actualizar documentacion_proyecto.md

