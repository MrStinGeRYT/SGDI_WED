// ============================================================
// SGDI Web — Breadcrumb Component
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * @param {Array<{ label: string, to?: string }>} items
 */
export default function Breadcrumb({ items = [] }) {
  const navigate = useNavigate();

  return (
    <nav className="breadcrumb" aria-label="Ruta de navegación">
      <div className="breadcrumb__item">
        <Home size={13} aria-hidden="true" />
      </div>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="breadcrumb__item">
            <ChevronRight size={13} className="breadcrumb__separator" aria-hidden="true" />
            {isLast || !item.to ? (
              <span className="breadcrumb__current">{item.label}</span>
            ) : (
              <span
                className="breadcrumb__link"
                onClick={() => navigate(item.to)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(item.to)}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
