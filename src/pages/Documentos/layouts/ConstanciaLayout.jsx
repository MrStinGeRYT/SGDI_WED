// ============================================================
// SGDI Web — ConstanciaLayout.jsx
// Vista previa institucional del tipo documental "Constancia".
// Estructura de certificado: texto en primera persona del firmante.
// ============================================================

import React from 'react';
import { INSTITUTION } from '../../../data/institutionalAssets';
import MembreteBase, { Field, formatFecha } from './MembreteBase';
import './ConstanciaLayout.css';

export default function ConstanciaLayout({ values = {} }) {
  const fecha    = formatFecha(values.fecha);
  const fechaExp = fecha ? `${INSTITUTION.city}, a ${fecha}` : null;

  return (
    <div className="constancia-layout">

      <MembreteBase areaEmisora={values.area_emisora} />

      {/* ── Título ── */}
      <div className="constancia-layout__title">CONSTANCIA</div>

      {/* ── Intro del firmante ── */}
      <p className="constancia-layout__intro">
        El que suscribe,{' '}
        <Field value={values.firmante}       placeholder="[Nombre del firmante]"  className="constancia-layout__bold" />,{' '}
        <Field value={values.cargo_firmante} placeholder="[Cargo del firmante]" />,
        {' '}de la <strong>{INSTITUTION.faculty}</strong> de la{' '}
        <strong>{INSTITUTION.name}</strong>:
      </p>

      {/* ── Hace constar ── */}
      <div className="constancia-layout__hace-constar">HACE CONSTAR</div>

      {/* ── Cuerpo certificatorio ── */}
      <p className="constancia-layout__certificado">
        Que{' '}
        <Field value={values.beneficiario}       placeholder="[Nombre del beneficiario]"  className="constancia-layout__bold" />
        {(values.cargo_beneficiario || '').trim() && (
          <>,{' '}<Field value={values.cargo_beneficiario} placeholder="" /></>
        )}
        {', '}
        <Field value={values.tipo_constancia} placeholder="[ha participado activamente en...]" />.
      </p>

      {/* ── Periodo ── */}
      {(values.periodo || '').trim() && (
        <p className="constancia-layout__periodo">
          Periodo: <strong>{values.periodo}</strong>
        </p>
      )}

      {/* ── Descripción adicional ── */}
      {(values.descripcion || '').trim() && (
        <div className="constancia-layout__descripcion">{values.descripcion}</div>
      )}

      {/* ── Expedición ── */}
      <p className="constancia-layout__expedicion">
        Se expide la presente constancia a petición del interesado,{' '}
        <Field value={fechaExp} placeholder={`${INSTITUTION.city}, a ___ de ______________ de 20__`} />.
      </p>

      {/* ── Firma ── */}
      <div className="constancia-layout__firma-block">
        <div className="constancia-layout__atentamente">Atentamente</div>
        <div className="constancia-layout__firma-nombre">
          <Field value={values.firmante}       placeholder="Nombre del firmante" />
        </div>
        <div className="constancia-layout__firma-cargo">
          <Field value={values.cargo_firmante} placeholder="Cargo del firmante"  />
        </div>
      </div>

      {/* ── Pie institucional ── */}
      <footer className="constancia-layout__footer">
        {INSTITUTION.address}&nbsp;&nbsp;|&nbsp;&nbsp;{INSTITUTION.phone}&nbsp;&nbsp;|&nbsp;&nbsp;{INSTITUTION.web}
      </footer>

    </div>
  );
}
