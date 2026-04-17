// ============================================================
// SGDI Web — StatusIndicator Component
// Indicadores de estado de IA y Microsoft 365 para el header
// ============================================================

import React from 'react';
import Badge from './Badge';
import {
  AI_STATUS_LABELS, AI_STATUS_BADGE,
  MS365_STATUS_LABELS, MS365_STATUS_BADGE,
} from '../../utils/constants';

/**
 * Indicador de estado de IA.
 */
export function AiStatusIndicator({ status, compact = false }) {
  const variant = AI_STATUS_BADGE[status] || 'neutral';
  const label   = AI_STATUS_LABELS[status]  || 'IA Desconocida';
  const pulse   = status === 'active';

  if (compact) {
    return <Badge variant={variant} dot pulse={pulse} size="sm">{label}</Badge>;
  }

  return (
    <div className="status-indicator">
      <Badge variant={variant} dot pulse={pulse}>
        {label}
      </Badge>
    </div>
  );
}

/**
 * Indicador de estado de Microsoft 365.
 */
export function Ms365StatusIndicator({ status, compact = false }) {
  const variant = MS365_STATUS_BADGE[status] || 'neutral';
  const label   = MS365_STATUS_LABELS[status]  || 'MS365 Desconocido';

  if (compact) {
    return <Badge variant={variant} dot size="sm">{label}</Badge>;
  }

  return (
    <div className="status-indicator">
      <Badge variant={variant} dot>
        {label}
      </Badge>
    </div>
  );
}
