// ============================================================
// SGDI Web — EmptyState Component
// ============================================================

import React from 'react';
import './EmptyState.css';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = ""
}) {
  return (
    <div className={`empty-state-global ${className}`}>
      {Icon && (
        <div className="empty-state-global__icon-wrapper">
          <Icon size={48} className="empty-state-global__icon" />
        </div>
      )}
      <h3 className="empty-state-global__title">{title}</h3>
      {description && <p className="empty-state-global__desc">{description}</p>}
      {action && <div className="empty-state-global__action">{action}</div>}
    </div>
  );
}
