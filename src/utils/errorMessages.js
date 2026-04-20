// ============================================================
// SGDI Web — Error Messages
// Mensajes de error amigables para el usuario final
// ============================================================

export const ERROR_MESSAGES = {
  // Archivos
  FILE_INVALID_TYPE:   'El archivo debe estar en formato .docx',
  FILE_TOO_LARGE:      'El archivo supera el tamaño máximo de 10 MB',
  FILE_REQUIRED:       'Debes seleccionar un archivo para continuar',
  FILE_CORRUPT:        'El archivo parece estar dañado. Intenta con otro archivo',

  // Autenticación
  AUTH_INVALID:        'Usuario o contraseña incorrectos',
  AUTH_SESSION_EXPIRED:'Tu sesión ha expirado. Inicia sesión nuevamente',
  AUTH_NO_PERMISSION:  'No tienes permisos para realizar esta acción',

  // Integraciones
  MS365_NOT_CONNECTED: 'No hay conexión con Microsoft 365',
  MS365_MAIL_FAILED:   'No se pudo enviar el correo. Revisa la conexión con Outlook',
  CLOUD_SYNC_FAILED:   'No se pudo sincronizar con la nube. Intenta de nuevo',

  // Documentos
  DOC_LOAD_FAILED:     'No se pudo cargar el documento',
  DOC_SAVE_FAILED:     'No se pudo guardar el documento. Intenta de nuevo',
  DOC_NOT_FOUND:       'El documento no fue encontrado',

  // Plantillas
  TEMPLATE_LOAD_FAILED:'No se pudo cargar la plantilla',
  TEMPLATE_NOT_FOUND:  'La plantilla no fue encontrada',

  // Formularios
  FORM_REQUIRED_FIELDS:'Por favor completa todos los campos requeridos',
  FORM_INVALID_EMAIL:  'El correo electrónico no es válido',

  // Genérico
  GENERIC:             'Ocurrió un error. Por favor intenta de nuevo',
  NETWORK:             'Sin conexión. Verifica tu red e intenta de nuevo',
};
