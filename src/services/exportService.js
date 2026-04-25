// ============================================================
// SGDI Web — exportService.js
// Servicio de exportación de documentos.
// FASE ACTUAL: Mock — simula el proceso sin generar archivo real.
// FASE E5: Reemplazar los stubs con llamadas reales a la API
//           de generación de documentos (Word/PDF).
// ============================================================

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Exporta un documento al formato indicado.
 *
 * @param {string} docId    - ID del documento a exportar
 * @param {'docx'|'pdf'} format - Formato de salida
 * @returns {Promise<{ success: boolean, message: string }>}
 *
 * FASE E5: Reemplazar con:
 *   const blob = await fetch(`/api/documents/${docId}/export?format=${format}`).then(r => r.blob());
 *   triggerDownload(blob, `${docId}.${format}`);
 */
export async function exportDocument(docId, format) {
  // Mock: simula tiempo de procesamiento
  await delay(1200);

  const labels = { docx: 'Word (.docx)', pdf: 'PDF' };

  // En Fase E5: aquí se dispara la descarga real del blob
  // Por ahora retorna un resultado mock exitoso
  return {
    success: true,
    format,
    label: labels[format] || format,
    message: `El documento se exportará como ${labels[format] || format} cuando la exportación real esté disponible en Fase E5.`,
  };
}

const exportService = { exportDocument };
export default exportService;
