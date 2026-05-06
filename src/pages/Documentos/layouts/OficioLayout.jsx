// ============================================================
// SGDI Web — OficioLayout.jsx
// Vista previa institucional del tipo documental "Oficio".
// Usa MembreteBase como encabezado compartido.
// ============================================================

import React from 'react';
import { INSTITUTION } from '../../../data/institutionalAssets';
import MembreteBase, { Field, formatFecha } from './MembreteBase';
import './OficioLayout.css';

export default function OficioLayout({ values = {} }) {
  const fecha    = formatFecha(values.lugar_fecha);
  const fechaStr = fecha ? `${INSTITUTION.city}, ${fecha}.` : null;

  return (
    <div className="oficio-layout">

      {/* ── Membrete compartido ── */}
      <MembreteBase areaEmisora={values.area_emisora} />

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
        <Field value={values.destinatario}       placeholder="Nombre del destinatario" className="oficio-layout__dest-nombre" />
        <Field value={values.cargo_destinatario} placeholder="Cargo del destinatario"  className="oficio-layout__dest-cargo"  />
        <span className="oficio-layout__dest-presente">PRESENTE</span>
      </div>

      {/* ── Asunto ── */}
      <div className="oficio-layout__asunto">
        <span className="oficio-layout__asunto-label">Asunto:&nbsp;</span>
        <Field value={values.asunto} placeholder="Descripción del asunto del oficio" />
      </div>

      {/* ── Cuerpo ── */}
      <div className="oficio-layout__cuerpo">
        <Field
          value={values.cuerpo}
          placeholder="Por medio del presente, y en atención a las funciones que me confiere el Reglamento de esta institución, me permito comunicar a usted lo siguiente…"
        />
      </div>

      {/* ── Cierre ── */}
      <div className="oficio-layout__cierre">Sin otro particular, quedo de usted.</div>

      {/* ── Firma ── */}
      <div className="oficio-layout__firma-block">
        <div className="oficio-layout__atentamente">Atentamente</div>
        {values.firma_imagen ? (
          <img
            src={values.firma_imagen}
            alt="Firma digital"
            className="oficio-layout__firma-img"
          />
        ) : values.firma_texto ? (
          <div className="oficio-layout__firma-texto">{values.firma_texto}</div>
        ) : null}
        <div className="oficio-layout__firma-nombre">
          <Field value={values.firmante}       placeholder="Nombre del firmante" />
        </div>
        <div className="oficio-layout__firma-cargo">
          <Field value={values.cargo_firmante} placeholder="Cargo del firmante"  />
        </div>
      </div>

      {/* ── c.c.p. y Anexos ── */}
      <div className="oficio-layout__footer-fields">
        {(values.copia  || '').trim() && (
          <div className="oficio-layout__ccp">
            <span className="oficio-layout__ccp-label">c.c.p. </span>{values.copia}
          </div>
        )}
        {(values.anexos || '').trim() && (
          <div className="oficio-layout__anexos">
            <span className="oficio-layout__anexos-label">Anexos: </span>{values.anexos}
          </div>
        )}
      </div>

      {/* ── Pie institucional ── */}
      <footer className="oficio-layout__page-footer">
        {INSTITUTION.address}&nbsp;&nbsp;|&nbsp;&nbsp;{INSTITUTION.phone}&nbsp;&nbsp;|&nbsp;&nbsp;{INSTITUTION.web}
      </footer>

    </div>
  );
}
