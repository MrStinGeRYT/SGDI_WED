// ============================================================
// SGDI Web — Badge Component
// Indicadores de estado y etiquetas
// ============================================================

import React from 'react';

/**
 * Badge de estado.
 * @param {'success'|'warning'|'danger'|'info'|'primary'|'neutral'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} dot       - muestra punto de color
 * @param {boolean} pulse     - anima el punto (estado activo)
 */
export default function Badge({
  children,
  variant = 'neutral',
  size    = 'md',
  dot     = false,
  pulse   = false,
  className = '',
}) {
  const classes = [
    'badge',
    `badge--${variant}`,
    size !== 'md' ? `badge--${size}` : '',
    pulse ? 'badge--pulse' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {dot && <span className="badge__dot" />}
      {children}
    </span>
  );
}
