// ============================================================
// SGDI Web — DocumentPreview.jsx
// Contenedor de la vista previa institucional.
// Selecciona el layout correcto según el tipo documental.
// ============================================================

import React from 'react';
import { FileText } from 'lucide-react';
import OficioLayout     from './layouts/OficioLayout';
import ConstanciaLayout from './layouts/ConstanciaLayout';
import MemorandumLayout from './layouts/MemorandumLayout';
import ActaLayout       from './layouts/ActaLayout';
import InformeLayout    from './layouts/InformeLayout';
import './DocumentPreview.css';

// ── Registro de layouts por tipo documental ──────────────────
// Para agregar un tipo nuevo: importar el componente y registrar aquí.
const LAYOUTS = {
  oficio:     OficioLayout,
  constancia: ConstanciaLayout,
  memorandum: MemorandumLayout,
  acta:       ActaLayout,
  informe:    InformeLayout,
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
  const label  = TYPE_LABELS[docType] || docType;

  return (
    <div className="doc-preview">

      {/* Etiqueta superior */}
      <div className="doc-preview__label">
        <FileText size={13} />
        Vista previa — {label}
      </div>

      {/* Hoja A4 */}
      <div className="doc-preview__paper">
        {Layout
          ? <Layout values={values} />
          : <UnsupportedLayout docType={label} />
        }
      </div>

    </div>
  );
}

// ── Fallback para tipos futuros no implementados ──────────────
function UnsupportedLayout({ docType }) {
  return (
    <div className="doc-preview__unsupported">
      <FileText size={36} strokeWidth={1.5} />
      <p>
        La vista previa para <strong>{docType}</strong>{' '}
        no está implementada todavía.
      </p>
    </div>
  );
}
