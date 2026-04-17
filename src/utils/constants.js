// ============================================================
// SGDI Web — Constants
// Constantes globales de la aplicación
// ============================================================

export const APP_NAME = 'SGDI Web';
export const APP_FULL_NAME = 'Sistema de Gestión de Documentos Institucionales';
export const APP_VERSION = '1.0.0';

// ── Rutas de la aplicación ──
export const ROUTES = {
  LOGIN:          '/login',
  DASHBOARD:      '/dashboard',
  BIBLIOTECA:     '/biblioteca',
  DOCUMENTOS:     '/documentos',
  DOCUMENTO_EDIT: '/documentos/:id',
  CORREOS:        '/correos',
  CONFIGURACION:  '/configuracion',
  AYUDA:          '/ayuda',
};

// ── Estados del sistema ──
export const SYSTEM_STATUS = {
  AI: {
    ACTIVE:      'active',
    MOCK:        'mock',
    DISCONNECTED:'disconnected',
  },
  MS365: {
    CONNECTED:      'connected',
    DISCONNECTED:   'disconnected',
    NOT_CONFIGURED: 'not_configured',
  },
  SERVER: {
    ONLINE:  'online',
    OFFLINE: 'offline',
  },
};

// ── Etiquetas de estado de IA ──
export const AI_STATUS_LABELS = {
  active:       'IA Activa',
  mock:         'IA Modo Local',
  disconnected: 'IA Desconectada',
};

// ── Etiquetas de estado de MS365 ──
export const MS365_STATUS_LABELS = {
  connected:      'Microsoft 365 Conectado',
  disconnected:   'Microsoft 365 Desconectado',
  not_configured: 'MS365 No Configurado',
};

// ── Variantes de badge por estado ──
export const AI_STATUS_BADGE = {
  active:       'success',
  mock:         'warning',
  disconnected: 'danger',
};

export const MS365_STATUS_BADGE = {
  connected:      'success',
  disconnected:   'danger',
  not_configured: 'neutral',
};

// ── Estado del documento ──
export const DOC_STATUS_BADGE = {
  classified: 'info',
  pending:    'warning',
  archived:   'neutral',
  active:     'success',
};

// ── Paginación ──
export const DEFAULT_PAGE_SIZE = 10;

// ── Sidebar ──
export const SIDEBAR_BREAKPOINT = 1024; // px
