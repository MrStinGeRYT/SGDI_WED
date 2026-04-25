// ============================================================
// SGDI Web — DocumentPreviewModal.jsx
// Modal de vista previa institucional — solo lectura.
// Reutiliza DocumentPreview (mismo componente del editor).
// ============================================================

import React, { useEffect } from 'react';
import { X, Edit, Download, Eye, FileText } from 'lucide-react';
import DocumentPreview from './DocumentPreview';
import './DocumentPreviewModal.css';

const TYPE_LABELS = {
  oficio:     'Oficio',
  constancia: 'Constancia',
  memorandum: 'Memorándum',
  acta:       'Acta',
  informe:    'Informe',
};

export default function DocumentPreviewModal({
  isOpen,
  doc,
  onClose,
  onEdit,
  onDownload,
}) {
  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !doc) return null;

  const typeLabel = TYPE_LABELS[doc.type] || doc.type;
  const updatedAt = doc.updatedAt
    ? new Date(doc.updatedAt).toLocaleDateString('es-MX', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '—';

  return (
    <div
      className="preview-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Vista previa: ${doc.title}`}
    >
      {/* ── Header ── */}
      <header className="preview-modal__header">
        <div className="preview-modal__header-left">
          <span className="preview-modal__badge">
            <Eye size={10} /> Solo lectura
          </span>
          <span className="preview-modal__title" title={doc.title}>
            {doc.title}
          </span>
        </div>

        <div className="preview-modal__header-right">
          {/* Descargar */}
          <button
            className="btn btn--outline btn--sm"
            onClick={() => onDownload(doc)}
            title="Descargar documento"
          >
            <Download size={15} /> Descargar
          </button>

          {/* Editar */}
          <button
            className="btn btn--secondary btn--sm"
            onClick={() => onEdit(doc.id)}
            title="Abrir en el editor"
          >
            <Edit size={15} /> Editar
          </button>

          {/* Cerrar */}
          <button
            className="btn btn--ghost btn--icon"
            onClick={onClose}
            aria-label="Cerrar vista previa"
            title="Cerrar (Esc)"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* ── Cuerpo: DocumentPreview en modo solo lectura ── */}
      <div className="preview-modal__body">
        <DocumentPreview
          docType={doc.type}
          values={doc.fields || {}}
        />
      </div>

      {/* ── Footer con metadatos ── */}
      <footer className="preview-modal__footer">
        <div className="preview-modal__footer-info">
          <span><FileText size={12} style={{ verticalAlign: 'middle' }} /> {typeLabel}</span>
          <div className="preview-modal__footer-sep" />
          <span>Actualizado: {updatedAt}</span>
          {doc.createdByName && (
            <>
              <div className="preview-modal__footer-sep" />
              <span>Por: {doc.createdByName}</span>
            </>
          )}
        </div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          Presiona <kbd style={{ padding: '1px 5px', borderRadius: '3px', border: '1px solid var(--color-border)', fontSize: '10px' }}>Esc</kbd> para cerrar
        </div>
      </footer>
    </div>
  );
}
