// ============================================================
// SGDI Web — OficioLayout.jsx
// Vista previa institucional del tipo documental "Oficio".
// Renderiza el documento en tiempo real a partir de los valores
// de los campos editados en el panel derecho.
// ============================================================

import React from 'react';
import { INSTITUTION, LOGO_PRIMARY_SVG, LOGO_FACULTY_SVG } from '../../../data/institutionalAssets';
import './OficioLayout.css';

// ── Helpers ─────────────────────────────────────────────────

function formatFecha(isoDate) {
  if (!isoDate) return null;
  const d = new Date(isoDate + 'T12:00:00');
  return d.toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

// Muestra texto real o un placeholder gris si el campo está vacío
function Field({ value, placeholder, className = '' }) {
  if (value && value.trim()) {
    return <span className={className}>{value}</span>;
  }
  return <span className={`oficio-layout__placeholder ${className}`}>{placeholder}</span>;
}

// ── Componente principal ─────────────────────────────────────

export default function OficioLayout({ values = {} }) {
  const fecha    = formatFecha(values.lugar_fecha);
  const fechaStr = fecha
    ? `${INSTITUTION.city}, ${fecha}.`
    : null;

  return (
    <div className="oficio-layout">

      {/* ── Membrete ── */}
      <header className="oficio-layout__header">
        <div
          className="oficio-layout__logo-left"
          dangerouslySetInnerHTML={{ __html: LOGO_PRIMARY_SVG }}
        />
        <div className="oficio-layout__institution">
          <div className="oficio-layout__inst-name">{INSTITUTION.name}</div>
          <div className="oficio-layout__inst-faculty">{INSTITUTION.faculty}</div>
          <div className="oficio-layout__inst-dept">{INSTITUTION.department}</div>
        </div>
        <div
          className="oficio-layout__logo-right"
          dangerouslySetInnerHTML={{ __html: LOGO_FACULTY_SVG }}
        />
      </header>

      <hr className="oficio-layout__divider" />
      <hr className="oficio-layout__divider-thin" />

      {/* ── Folio ── */}
      <div className="oficio-layout__folio-row">
        <span className="oficio-layout__folio">
          Oficio Núm.&nbsp;
          <Field
            value={values.numero_oficio}
            placeholder="XXXX-XXXX-2026"
            className="oficio-layout__folio-num"
          />
        </span>
      </div>

      {/* ── Fecha ── */}
      <div className="oficio-layout__fecha-row">
        <Field
          value={fechaStr}
          placeholder={`${INSTITUTION.city}, ___ de ______________ de 20__.`}
          className="oficio-layout__fecha"
        />
      </div>

      {/* ── Destinatario ── */}
      <div className="oficio-layout__destinatario">
        <Field
          value={values.destinatario}
          placeholder="Nombre del destinatario"
          className="oficio-layout__dest-nombre"
        />
        <Field
          value={values.cargo_destinatario}
          placeholder="Cargo del destinatario"
          className="oficio-layout__dest-cargo"
        />
        <span className="oficio-layout__dest-presente">PRESENTE</span>
      </div>

      {/* ── Asunto ── */}
      <div className="oficio-layout__asunto">
        <span className="oficio-layout__asunto-label">Asunto:&nbsp;</span>
        <Field value={values.asunto} placeholder="Descripción del asunto del oficio" />
      </div>

      {/* ── Cuerpo ── */}
      <div className="oficio-layout__cuerpo">
        {values.cuerpo && values.cuerpo.trim()
          ? values.cuerpo
          : (
            <span className="oficio-layout__placeholder">
              Por medio del presente, y en atención a las funciones que me confiere el Reglamento de esta institución, me permito comunicar a usted lo siguiente…
            </span>
          )
        }
      </div>

      {/* ── Cierre ── */}
      <div className="oficio-layout__cierre">Sin otro particular, quedo de usted.</div>

      {/* ── Firma ── */}
      <div className="oficio-layout__firma-block">
        <div style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '10.5pt', marginBottom: '28px', color: '#4a5568' }}>
          Atentamente
        </div>
        <div className="oficio-layout__firma-nombre">
          <Field value={values.firmante} placeholder="Nombre del firmante" />
        </div>
        <div className="oficio-layout__firma-cargo">
          <Field value={values.cargo_firmante} placeholder="Cargo del firmante" />
        </div>
      </div>

      {/* ── c.c.p. y Anexos ── */}
      <div className="oficio-layout__footer-fields">
        {(values.copia || '').trim() && (
          <div className="oficio-layout__ccp">
            <span className="oficio-layout__ccp-label">c.c.p. </span>
            {values.copia}
          </div>
        )}
        {(values.anexos || '').trim() && (
          <div className="oficio-layout__anexos">
            <span className="oficio-layout__anexos-label">Anexos: </span>
            {values.anexos}
          </div>
        )}
      </div>

      {/* ── Pie de página institucional ── */}
      <footer className="oficio-layout__page-footer">
        {INSTITUTION.address}&nbsp;&nbsp;|&nbsp;&nbsp;{INSTITUTION.phone}&nbsp;&nbsp;|&nbsp;&nbsp;{INSTITUTION.web}
      </footer>

    </div>
  );
}
