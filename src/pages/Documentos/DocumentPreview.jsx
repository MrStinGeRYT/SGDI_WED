// ============================================================
// SGDI Web — DocumentPreview.jsx
// Contenedor de la vista previa institucional.
// Selecciona el layout correcto según el tipo documental.
// ============================================================

import React from 'react';
import { FileText } from 'lucide-react';
import OficioLayout from './layouts/OficioLayout';
import './DocumentPreview.css';

// ── Registro de layouts implementados ──
// Para agregar un tipo nuevo: importar el componente y añadir aquí.
const LAYOUTS = {
  oficio: OficioLayout,
  // constancia:  ConstanciaLayout,   // Fase E-next
  // memorandum:  MemoLayout,         // Fase E-next
  // acta:        ActaLayout,         // Fase E-next
  // informe:     InformeLayout,      // Fase E-next
};

const TYPE_LABELS = {
  oficio:     'Oficio',
  constancia: 'Constancia',
  memorandum: 'Memorándum',
  acta:       'Acta',
  informe:    'Informe',
};

// ── Componente principal ──────────────────────────────────────

export default function DocumentPreview({ docType, values }) {
  const Layout = LAYOUTS[docType];

  return (
    <div className="doc-preview">

      {/* Etiqueta superior */}
      <div className="doc-preview__label">
        <FileText size={13} />
        Vista previa — {TYPE_LABELS[docType] || docType}
      </div>

      {/* Hoja */}
      <div className="doc-preview__paper">
        {Layout ? (
          <Layout values={values} />
        ) : (
          <UnsupportedLayout docType={docType} />
        )}
      </div>

    </div>
  );
}

// ── Fallback para tipos sin layout implementado ──
function UnsupportedLayout({ docType }) {
  const pendingTypes = Object.keys(LAYOUTS)
    .filter((k) => !LAYOUTS[k])
    .concat(['constancia', 'memorandum', 'acta', 'informe'].filter((t) => t !== docType));

  return (
    <div className="doc-preview__unsupported">
      <FileText size={36} strokeWidth={1.5} />
      <p>
        La vista previa institucional para <strong>{TYPE_LABELS[docType] || docType}</strong>{' '}
        está disponible a partir de la <strong>Fase E-next</strong>.
      </p>
      <p style={{ fontSize: 'var(--font-size-xs)' }}>
        Por ahora, el editor de campos está disponible. Los valores se guardan correctamente
        y estarán listos cuando el layout se implemente.
      </p>
      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
        Vista previa implementada: <strong>Oficio</strong>
      </p>
    </div>
  );
}
