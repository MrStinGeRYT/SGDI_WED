// ============================================================
// SGDI Web — MembreteBase.jsx
// Encabezado institucional compartido entre todos los layouts.
// Exporta también Field y formatFecha para uso en layouts hijos.
// ============================================================

import React from 'react';
import { INSTITUTION, LOGO_PRIMARY_SVG, LOGO_FACULTY_SVG } from '../../../data/institutionalAssets';
import './MembreteBase.css';

// ── Helpers exportados ──────────────────────────────────────

/**
 * Formatea una fecha ISO (YYYY-MM-DD) en español mexicano.
 * Retorna null si no hay valor.
 */
export function formatFecha(isoDate) {
  if (!isoDate) return null;
  const d = new Date(isoDate + 'T12:00:00');
  return d.toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

/**
 * Muestra el valor real o un texto placeholder en gris/itálica si está vacío.
 * La clase `layout__placeholder` está definida en MembreteBase.css.
 */
export function Field({ value, placeholder, className = '' }) {
  const empty = !value || !String(value).trim();
  return (
    <span className={`${className}${empty ? ' layout__placeholder' : ''}`}>
      {empty ? placeholder : value}
    </span>
  );
}

// ── Componente principal ─────────────────────────────────────

/**
 * Membrete institucional con logos, nombre de institución,
 * facultad y área emisora dinámica.
 *
 * @param {string} areaEmisora - Valor del campo area_emisora del documento.
 */
export default function MembreteBase({ areaEmisora }) {
  return (
    <>
      <header className="membrete-base">
        <div
          className="membrete-base__logo"
          dangerouslySetInnerHTML={{ __html: LOGO_PRIMARY_SVG }}
        />
        <div className="membrete-base__institution">
          <div className="membrete-base__name">{INSTITUTION.name}</div>
          <div className="membrete-base__faculty">{INSTITUTION.faculty}</div>
          <Field
            value={areaEmisora}
            placeholder="Área emisora del documento"
            className="membrete-base__dept"
          />
        </div>
        <div
          className="membrete-base__logo"
          dangerouslySetInnerHTML={{ __html: LOGO_FACULTY_SVG }}
        />
      </header>
      <hr className="membrete-base__divider-main" />
      <hr className="membrete-base__divider-thin" />
    </>
  );
}
