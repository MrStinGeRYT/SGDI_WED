// ============================================================
// SGDI Web — InformeLayout.jsx
// Vista previa institucional del tipo documental "Informe".
// Estructura: portada implícita → secciones numeradas → firma.
// ============================================================

import React from 'react';
import { INSTITUTION } from '../../../data/institutionalAssets';
import MembreteBase, { Field } from './MembreteBase';
import './InformeLayout.css';

export default function InformeLayout({ values = {} }) {
  const sections = [
    { num: 'I.',   id: 'introduccion',    label: 'INTRODUCCIÓN'     },
    { num: 'II.',  id: 'desarrollo',      label: 'DESARROLLO'       },
    { num: 'III.', id: 'conclusiones',    label: 'CONCLUSIONES'     },
    { num: 'IV.',  id: 'recomendaciones', label: 'RECOMENDACIONES'  },
  ];

  return (
    <div className="informe-layout">

      <MembreteBase areaEmisora={values.area_emisora} />

      {/* ── Título del informe ── */}
      <div className="informe-layout__title-block">
        <div className="informe-layout__doc-type">INFORME</div>
        <div className="informe-layout__titulo">
          <Field value={values.titulo} placeholder="Título del informe" />
        </div>
      </div>

      {/* ── Ficha técnica ── */}
      <div className="informe-layout__ficha">
        <div className="informe-layout__ficha-item">
          <span className="informe-layout__ficha-label">Periodo:</span>
          <Field value={values.periodo} placeholder="Enero – Junio 2026" />
        </div>
        <div className="informe-layout__ficha-item">
          <span className="informe-layout__ficha-label">Responsable:</span>
          <span>
            <Field value={values.responsable} placeholder="[Nombre]" className="informe-layout__bold" />
            {(values.cargo_responsable || '').trim() && (
              <em className="informe-layout__ficha-sub">&ensp;—&ensp;{values.cargo_responsable}</em>
            )}
          </span>
        </div>
      </div>

      <hr className="informe-layout__separator" />

      {/* ── Secciones numeradas ── */}
      {sections.map(({ num, id, label }) => {
        const content = (values[id] || '').trim();
        // Recomendaciones es opcional — solo se muestra si tiene contenido
        if (id === 'recomendaciones' && !content) return null;
        return (
          <div key={id} className="informe-layout__section">
            <div className="informe-layout__section-header">
              <span className="informe-layout__section-num">{num}</span>
              <span className="informe-layout__section-title">{label}</span>
            </div>
            <div className="informe-layout__section-body">
              <Field
                value={values[id]}
                placeholder={`Redacta aquí la sección de ${label.toLowerCase()}…`}
              />
            </div>
          </div>
        );
      })}

      {/* ── Firma ── */}
      <div className="informe-layout__firma-block">
        {values.firma_imagen ? (
          <img
            src={values.firma_imagen}
            alt="Firma digital"
            className="informe-layout__firma-img"
          />
        ) : values.firma_texto ? (
          <div className="informe-layout__firma-texto">{values.firma_texto}</div>
        ) : null}
        <div className="informe-layout__firma-nombre">
          <Field value={values.responsable}       placeholder="Nombre del responsable" />
        </div>
        <div className="informe-layout__firma-cargo">
          <Field value={values.cargo_responsable} placeholder="Cargo" />
        </div>
      </div>

      {/* ── Pie institucional ── */}
      <footer className="informe-layout__footer">
        {INSTITUTION.address}&nbsp;&nbsp;|&nbsp;&nbsp;{INSTITUTION.phone}&nbsp;&nbsp;|&nbsp;&nbsp;{INSTITUTION.web}
      </footer>

    </div>
  );
}
