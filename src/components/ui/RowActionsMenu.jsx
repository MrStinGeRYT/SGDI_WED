// ============================================================
// SGDI Web — RowActionsMenu
// Acciones de fila: botones inline en escritorio,
// menú desplegable (kebab) en móvil.
// Uso:
//   <RowActionsMenu actions={[
//     { label: 'Ver detalle', icon: <Eye size={16} />, onClick: () => {} },
//     { label: 'Archivar',   icon: <Archive size={16} />, onClick: () => {}, danger: true },
//   ]} />
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical } from 'lucide-react';
import './RowActionsMenu.css';

export default function RowActionsMenu({ actions = [] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Cerrar al hacer clic fuera del menú
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <div className="ram" ref={containerRef}>

      {/* ── Escritorio: botones inline ── */}
      <div className="ram__desktop">
        {actions.map((action, i) => (
          <button
            key={i}
            className={`btn btn--icon btn--ghost btn--sm ${action.danger ? 'ram__btn--danger' : ''}`}
            title={action.label}
            disabled={action.disabled}
            onClick={(e) => { e.stopPropagation(); action.onClick(e); }}
          >
            {action.icon}
          </button>
        ))}
      </div>

      {/* ── Móvil: kebab + dropdown ── */}
      <div className="ram__mobile">
        <button
          className="btn btn--icon btn--ghost btn--sm"
          aria-label="Abrir acciones"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        >
          <MoreVertical size={18} />
        </button>

        {open && (
          <div className="ram__dropdown" role="menu">
            {actions.map((action, i) => (
              <button
                key={i}
                className={`ram__dropdown-item ${action.danger ? 'ram__dropdown-item--danger' : ''} ${action.disabled ? 'ram__dropdown-item--disabled' : ''}`}
                role="menuitem"
                disabled={action.disabled}
                aria-disabled={action.disabled}
                title={action.tooltip || undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!action.disabled) {
                    action.onClick(e);
                    setOpen(false);
                  }
                }}
              >
                <span className="ram__dropdown-icon">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
