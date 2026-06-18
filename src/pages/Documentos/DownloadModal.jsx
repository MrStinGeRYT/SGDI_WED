// ============================================================
// SGDI Web — DownloadModal.jsx
// Modal selector de formato de descarga: Word (.docx) / PDF.
// Fase actual: preview informativo (exportación no disponible).
// Fase E5: conectar exportService real con generación de archivo.
// ============================================================

import React, { useEffect } from 'react';
import { X, Download, Info, Clock } from 'lucide-react';
import './DownloadModal.css';

// ── Formatos disponibles ─────────────────────────────────────
const FORMATS = [
  {
    id:    'docx',
    name:  'Word',
    ext:   '.docx',
    emoji: 'W',
    desc:  'Editable en Microsoft Word',
  },
  {
    id:    'pdf',
    name:  'PDF',
    ext:   '.pdf',
    emoji: 'PDF',
    desc:  'Para impresión o envío formal',
  },
];

// ── Componente principal ─────────────────────────────────────

export default function DownloadModal({ isOpen, doc, onClose }) {
  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !doc) return null;

  return (
    <div
      className="download-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Descargar documento"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="download-modal__panel">

        {/* ── Header ── */}
        <div className="download-modal__header">
          <div className="download-modal__header-content">
            <div className="download-modal__title">Descargar documento</div>
            <div className="download-modal__subtitle" title={doc.title}>{doc.title}</div>
          </div>
          <button
            className="btn btn--ghost btn--icon"
            onClick={onClose}
            aria-label="Cerrar"
            title="Cerrar (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Cuerpo ── */}
        <div className="download-modal__body">

          {/* Banner de aviso prominente */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '12px',
            padding: '14px 16px',
            background: 'var(--color-warning-50, rgba(234,179,8,0.08))',
            border: '1px solid var(--color-warning-300, rgba(234,179,8,0.4))',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
          }}>
            <Clock size={18} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: '1px' }} />
            <div>
              <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)', color: 'var(--color-warning-700, var(--color-warning))' }}>
                Exportación no disponible aún
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                La generación de archivos .docx y .pdf estará disponible en la Fase E5.
                Los botones se habilitarán automáticamente cuando el servicio esté activo.
              </div>
            </div>
          </div>

          {/* Selector de formato — deshabilitado visualmente */}
          <div className="download-modal__formats">
            {FORMATS.map((fmt) => (
              <div
                key={fmt.id}
                className="download-modal__format-card"
                style={{ opacity: 0.45, cursor: 'not-allowed', pointerEvents: 'none' }}
                aria-disabled="true"
              >
                {/* Ícono */}
                <div className={`download-modal__format-icon download-modal__format-icon--${fmt.id}`}>
                  {fmt.emoji}
                </div>

                {/* Info */}
                <div className="download-modal__format-info">
                  <div className="download-modal__format-name">{fmt.name}</div>
                  <div className="download-modal__format-ext">{fmt.ext} — {fmt.desc}</div>
                </div>

                {/* Badge de estado */}
                <span style={{
                  marginLeft: 'auto', flexShrink: 0,
                  fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em',
                  padding: '2px 8px', borderRadius: '999px',
                  background: 'var(--color-surface-alt)',
                  color: 'var(--color-text-muted)',
                  border: '1px solid var(--color-border)',
                }}>
                  Próximamente
                </span>
              </div>
            ))}
          </div>

          {/* Nota secundaria */}
          <div className="download-modal__note" style={{ marginTop: '16px' }}>
            <Info size={13} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>
              Mientras tanto, puedes usar el botón <strong>Editar</strong> para revisar
              el contenido del documento en el editor institucional.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

