// ============================================================
// SGDI Web — ActaLayout.jsx
// Vista previa institucional del tipo documental "Acta".
// Estructura: sesión → asistentes → orden del día → acuerdos.
// ============================================================

import React from 'react';
import { INSTITUTION } from '../../../data/institutionalAssets';
import MembreteBase, { Field, formatFecha } from './MembreteBase';
import './ActaLayout.css';

export default function ActaLayout({ values = {} }) {
  const fecha = formatFecha(values.fecha);

  return (
    <div className="acta-layout">

      <MembreteBase areaEmisora={values.area_emisora} />

      {/* ── Encabezado de sesión ── */}
      <div className="acta-layout__session-header">
        <div className="acta-layout__title">
          Acta de{' '}
          <Field value={values.tipo_reunion} placeholder="[Tipo de reunión]" />
        </div>
        {(values.numero_acta || '').trim() && (
          <div className="acta-layout__num">Núm. {values.numero_acta}</div>
        )}
      </div>

      {/* ── Metadatos de sesión ── */}
      <div className="acta-layout__meta-row-group">
        <div className="acta-layout__meta-item">
          <span className="acta-layout__meta-label">Fecha:</span>
          <Field value={fecha} placeholder="__ de __________ de 20__" />
        </div>
        {(values.hora || '').trim() && (
          <div className="acta-layout__meta-item">
            <span className="acta-layout__meta-label">Hora:</span>
            <span>{values.hora}</span>
          </div>
        )}
        <div className="acta-layout__meta-item">
          <span className="acta-layout__meta-label">Lugar:</span>
          <Field value={values.lugar} placeholder="[Lugar de la reunión]" />
        </div>
      </div>

      <hr className="acta-layout__separator" />

      {/* ── Asistentes ── */}
      <div className="acta-layout__section">
        <div className="acta-layout__section-title">ASISTENTES</div>
        <div className="acta-layout__section-body">
          <Field value={values.asistentes} placeholder="1. Nombre — Cargo&#10;2. Nombre — Cargo" />
        </div>
      </div>

      {/* ── Orden del día ── */}
      <div className="acta-layout__section">
        <div className="acta-layout__section-title">ORDEN DEL DÍA</div>
        <div className="acta-layout__section-body">
          <Field value={values.orden_del_dia} placeholder="1. Lista de asistencia&#10;2. ..." />
        </div>
      </div>

      {/* ── Acuerdos ── */}
      <div className="acta-layout__section">
        <div className="acta-layout__section-title">ACUERDOS</div>
        <div className="acta-layout__section-body">
          <Field value={values.acuerdos} placeholder="Acuerdo 1: ...&#10;Acuerdo 2: ..." />
        </div>
      </div>

      {/* ── Próxima reunión ── */}
      {(values.proxima_reunion || '').trim() && (
        <div className="acta-layout__proxima">
          <span className="acta-layout__meta-label">Próxima reunión:</span>{' '}
          {values.proxima_reunion}
        </div>
      )}

      {/* ── Cierre y firma ── */}
      <p className="acta-layout__cierre">
        Sin más asuntos que tratar, se da por concluida la presente sesión.
      </p>

      <div className="acta-layout__firma-block">
        <div className="acta-layout__firma-nombre">
          <Field value={values.responsable}       placeholder="Nombre del responsable" />
        </div>
        <div className="acta-layout__firma-cargo">
          <Field value={values.cargo_responsable} placeholder="Cargo" />
        </div>
      </div>

      {/* ── Pie institucional ── */}
      <footer className="acta-layout__footer">
        {INSTITUTION.address}&nbsp;&nbsp;|&nbsp;&nbsp;{INSTITUTION.phone}&nbsp;&nbsp;|&nbsp;&nbsp;{INSTITUTION.web}
      </footer>

    </div>
  );
}
