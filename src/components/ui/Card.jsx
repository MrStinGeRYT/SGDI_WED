// ============================================================
// SGDI Web — Card Component
// Tarjeta contenedora con header, body y footer opcionales
// ============================================================

import React from 'react';

export default function Card({ children, hoverable = false, flat = false, className = '' }) {
  const classes = [
    'card',
    hoverable ? 'card--hoverable' : '',
    flat      ? 'card--flat'      : '',
    className,
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
}

Card.Header = function CardHeader({ children, className = '' }) {
  return <div className={`card__header ${className}`}>{children}</div>;
};

Card.Title = function CardTitle({ children, subtitle, className = '' }) {
  return (
    <div className={className}>
      <div className="card__title">{children}</div>
      {subtitle && <div className="card__subtitle">{subtitle}</div>}
    </div>
  );
};

Card.Actions = function CardActions({ children }) {
  return <div className="card__actions">{children}</div>;
};

Card.Body = function CardBody({ children, sm = false, className = '' }) {
  return (
    <div className={`card__body ${sm ? 'card__body--sm' : ''} ${className}`}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return <div className={`card__footer ${className}`}>{children}</div>;
};
