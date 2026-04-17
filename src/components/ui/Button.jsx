// ============================================================
// SGDI Web — Button Component
// ============================================================

import React from 'react';

/**
 * Botón reutilizable.
 * @param {'primary'|'secondary'|'ghost'|'danger'|'success'|'warning'|'outline'} variant
 * @param {'xs'|'sm'|'md'|'lg'} size
 * @param {boolean} fullWidth
 * @param {boolean} iconOnly
 * @param {React.ReactNode} leftIcon
 * @param {React.ReactNode} rightIcon
 */
export default function Button({
  children,
  variant   = 'secondary',
  size      = 'md',
  fullWidth = false,
  iconOnly  = false,
  leftIcon  = null,
  rightIcon = null,
  className = '',
  type      = 'button',
  ...props
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth  ? 'btn--full' : '',
    iconOnly   ? 'btn--icon' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type={type} className={classes} {...props}>
      {leftIcon && <span className="btn-icon">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="btn-icon">{rightIcon}</span>}
    </button>
  );
}
