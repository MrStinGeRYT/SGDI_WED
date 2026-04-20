// ============================================================
// SGDI Web — ms365Service.js
// Servicio mock de integración con Microsoft 365.
// Listo para conectar con OAuth / Graph API en fases futuras.
// ============================================================

import { SYSTEM_STATUS } from '../utils/constants';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Estado mock en memoria
let _status = {
  ai:     SYSTEM_STATUS.AI.MOCK,
  ms365:  SYSTEM_STATUS.MS365.NOT_CONFIGURED,
  server: SYSTEM_STATUS.SERVER.ONLINE,
};

export function getConnectionStatus() {
  return { ..._status };
}

export async function connectMs365() {
  await delay(2000); // simula intento OAuth
  // En esta fase siempre devuelve "not_configured" con mensaje
  return {
    success: false,
    message: 'La conexión con Microsoft 365 requiere configuración institucional. Esta función estará disponible en la Fase 2D.',
  };
}

export async function disconnectMs365() {
  await delay(500);
  _status.ms365 = SYSTEM_STATUS.MS365.NOT_CONFIGURED;
  return true;
}

// Metadatos de integraciones disponibles para mostrar en UI
export const MS365_INTEGRATIONS = [
  {
    id:          'outlook',
    name:        'Outlook Mail',
    description: 'Envío de correos institucionales directamente desde SGDI Web',
    icon:        'Mail',
    status:      'pending',
    features:    ['Enviar documentos adjuntos', 'Usar plantillas de correo institucional', 'Registro automático de envíos'],
  },
  {
    id:          'onedrive',
    name:        'OneDrive',
    description: 'Almacenamiento y sincronización de documentos en la nube institucional',
    icon:        'Cloud',
    status:      'pending',
    features:    ['Guardado automático de documentos', 'Control de versiones', 'Acceso desde cualquier dispositivo'],
  },
  {
    id:          'sharepoint',
    name:        'SharePoint',
    description: 'Repositorio institucional compartido para plantillas y documentos',
    icon:        'Database',
    status:      'pending',
    features:    ['Biblioteca compartida por departamento', 'Permisos por rol', 'Búsqueda institucional'],
  },
  {
    id:          'entra',
    name:        'Microsoft Entra ID',
    description: 'Autenticación institucional con cuenta de la organización',
    icon:        'Shield',
    status:      'pending',
    features:    ['Login con cuenta institucional', 'Sin contraseñas separadas', 'Permisos sincronizados con Active Directory'],
  },
];

const ms365Service = { getConnectionStatus, connectMs365, disconnectMs365, MS365_INTEGRATIONS };
export default ms365Service;
