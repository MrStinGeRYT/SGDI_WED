// ============================================================
// SGDI Web — DownloadModal.jsx
// Modal selector de formato de descarga: Word (.docx) / PDF.
// Fase actual: mock (exportService stub).
// Fase E5: reemplazar exportService con llamada real a API.
// ============================================================

import React, { useState, useEffect } from 'react';
import { X, Loader, Info } from 'lucide-react';
import { exportDocument } from '../../services/exportService';
import { useToast } from '../../context/ToastContext';
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
  const [loadingFormat, setLoadingFormat] = useState(null); // 'docx' | 'pdf' | null
  const { showToast } = useToast();

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape' && !loadingFormat) onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, loadingFormat]);

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !doc) return null;

  const handleDownload = async (format) => {
    if (loadingFormat) return; // evitar doble clic
    setLoadingFormat(format);
    try {
      const result = await exportDocument(doc.id, format);
      if (result.success) {
        // FASE E5: aquí se dispara triggerDownload(blob, filename)
        showToast(`Documento preparado como ${result.label}.`, 'success');
        onClose();
      } else {
        showToast('No se pudo preparar el documento.', 'error');
      }
    } catch {
      showToast('Error al procesar la descarga.', 'error');
    } finally {
      setLoadingFormat(null);
    }
  };

  return (
    <div
      className="download-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Seleccionar formato de descarga"
      onClick={(e) => { if (e.target === e.currentTarget && !loadingFormat) onClose(); }}
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
            disabled={!!loadingFormat}
            aria-label="Cerrar"
            title="Cerrar (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Cuerpo ── */}
        <div className="download-modal__body">

          {/* Selector de formato */}
          <div className="download-modal__formats">
            {FORMATS.map((fmt) => {
              const isLoading = loadingFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  className={`download-modal__format-card${isLoading ? ' loading' : ''}`}
                  onClick={() => handleDownload(fmt.id)}
                  disabled={!!loadingFormat}
                  aria-label={`Descargar como ${fmt.name} (${fmt.ext})`}
                >
                  {/* Ícono */}
                  <div className={`download-modal__format-icon download-modal__format-icon--${fmt.id}`}>
                    {isLoading
                      ? <Loader size={22} className="spin" />
                      : fmt.emoji
                    }
                  </div>

                  {/* Info */}
                  <div className="download-modal__format-info">
                    <div className="download-modal__format-name">{fmt.name}</div>
                    <div className="download-modal__format-ext">{fmt.ext} — {fmt.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Nota informativa */}
          <div className="download-modal__note">
            <Info size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>
              La generación real de archivos estará disponible en la Fase E5 (backend de exportación).
              Por ahora la descarga queda registrada y lista para cuando el servicio esté activo.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
