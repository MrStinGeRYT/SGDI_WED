// ============================================================
// SGDI Web — MemorandumLayout.jsx
// Vista previa institucional del tipo documental "Memorándum".
// Estructura: tabla PARA/DE/FECHA/ASUNTO + cuerpo + firma simple.
// ============================================================

import React from 'react';
import { INSTITUTION } from '../../../data/institutionalAssets';
import MembreteBase, { Field, formatFecha } from './MembreteBase';
import './MemorandumLayout.css';

export default function MemorandumLayout({ values = {} }) {
  const fecha = formatFecha(values.fecha);

  const prioridadClass = {
    urgente:      'memo-layout__badge--urgente',
    informativo:  'memo-layout__badge--informativo',
  }[(values.prioridad || '').toLowerCase()] || 'memo-layout__badge--normal';

  return (
    <div className="memo-layout">

      <MembreteBase areaEmisora={values.area_emisora} />

      {/* ── Título ── */}
      <div className="memo-layout__title">M E M O R Á N D U M</div>

      {/* ── Tabla de metadatos del memo ── */}
      <div className="memo-layout__data-table">
        <div className="memo-layout__row">
          <span className="memo-layout__key">PARA:</span>
          <span className="memo-layout__val">
            <Field value={values.para}       placeholder="[Destinatario]" className="memo-layout__val-bold" />
            {(values.cargo_para || '').trim() && (
              <em className="memo-layout__sub">&ensp;—&ensp;{values.cargo_para}</em>
            )}
          </span>
        </div>
        <div className="memo-layout__row">
          <span className="memo-layout__key">DE:</span>
          <span className="memo-layout__val">
            <Field value={values.de}       placeholder="[Remitente]" className="memo-layout__val-bold" />
            {(values.cargo_de || '').trim() && (
              <em className="memo-layout__sub">&ensp;—&ensp;{values.cargo_de}</em>
            )}
          </span>
        </div>
        <div className="memo-layout__row">
          <span className="memo-layout__key">FECHA:</span>
          <span className="memo-layout__val">
            <Field
              value={fecha ? `${INSTITUTION.city}, ${fecha}` : null}
              placeholder="___ de ______________ de 20__"
            />
          </span>
        </div>
        <div className="memo-layout__row">
          <span className="memo-layout__key">ASUNTO:</span>
          <span className="memo-layout__val memo-layout__val-bold">
            <Field value={values.asunto} placeholder="[Asunto del memorándum]" />
          </span>
        </div>
        {(values.prioridad || '').trim() && (
          <div className="memo-layout__row">
            <span className="memo-layout__key">PRIORIDAD:</span>
            <span className="memo-layout__val">
              <span className={`memo-layout__badge ${prioridadClass}`}>
                {values.prioridad}
              </span>
            </span>
          </div>
        )}
      </div>

      <hr className="memo-layout__separator" />

      {/* ── Cuerpo ── */}
      <div className="memo-layout__cuerpo">
        <Field
          value={values.cuerpo}
          placeholder="Por medio del presente, me permito comunicar a usted lo siguiente…"
        />
      </div>

      {/* ── Firma simple ── */}
      <div className="memo-layout__firma">
        {values.firma_imagen ? (
          <img
            src={values.firma_imagen}
            alt="Firma digital"
            className="memo-layout__firma-img"
          />
        ) : values.firma_texto ? (
          <div className="memo-layout__firma-texto">{values.firma_texto}</div>
        ) : null}
        <div className="memo-layout__firma-nombre">
          <Field value={values.de}       placeholder="Nombre del remitente" />
        </div>
        <div className="memo-layout__firma-cargo">
          <Field value={values.cargo_de} placeholder="Cargo" />
        </div>
      </div>

      {/* ── Pie institucional ── */}
      <footer className="memo-layout__footer">
        {INSTITUTION.address}&nbsp;&nbsp;|&nbsp;&nbsp;{INSTITUTION.phone}&nbsp;&nbsp;|&nbsp;&nbsp;{INSTITUTION.web}
      </footer>

    </div>
  );
}
