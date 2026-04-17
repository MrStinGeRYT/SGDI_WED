// ============================================================
// SGDI Web — Formatters
// Utilidades de formato para fechas, tamaños y texto
// ============================================================

/**
 * Formatea una fecha ISO a formato legible en español.
 * @param {string} isoString - Fecha ISO 8601
 * @param {object} options   - Opciones de Intl.DateTimeFormat
 */
export function formatDate(isoString, options = {}) {
  if (!isoString) return '—';
  const defaults = {
    day:   '2-digit',
    month: 'long',
    year:  'numeric',
  };
  return new Intl.DateTimeFormat('es-MX', { ...defaults, ...options }).format(
    new Date(isoString)
  );
}

/**
 * Formatea una fecha con hora.
 */
export function formatDateTime(isoString) {
  if (!isoString) return '—';
  return new Intl.DateTimeFormat('es-MX', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));
}

/**
 * Devuelve tiempo relativo ("hace 5 minutos").
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return '—';
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours   = Math.floor(diff / 3600000);
  const days    = Math.floor(diff / 86400000);

  if (minutes < 1)  return 'Ahora mismo';
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours   < 24) return `Hace ${hours} h`;
  if (days    < 7)  return `Hace ${days} d`;
  return formatDate(isoString);
}

/**
 * Formatea tamaño de archivo en bytes a unidad legible.
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Trunca un texto a maxLength caracteres.
 */
export function truncateText(text, maxLength = 50) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

/**
 * Obtiene las iniciales de un nombre completo.
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

/**
 * Formatea un número con separadores de miles.
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('es-MX').format(num);
}
