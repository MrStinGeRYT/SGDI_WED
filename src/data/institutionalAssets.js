// ============================================================
// SGDI Web — institutionalAssets.js
// Identidad institucional fija: nombre, ciudad, dirección, logos.
// El área emisora (coordinación/departamento) NO va aquí —
// se captura por documento como campo dinámico (area_emisora).
// ============================================================

export const INSTITUTION = {
  name:    'Universidad Autónoma del Carmen',
  acronym: 'UNACAR',
  faculty: 'Facultad de Ciencias de la Información',
  city:    'Ciudad del Carmen, Campeche',
  address: 'Edificio del Campus I. Av. 56 Esquina Av. Concordia Número 4, Colonia Benito Juárez, C.P. 24180, Cd. del Carmen, Campeche.',
  phone:   'Tel. (938) 382-0600',
  web:     'www.unacar.mx',
  email:   'posgrado@fci.unacar.mx',
  motto:   'Por la Grandeza de México',
  // NOTA: 'department' eliminado intencionalmente.
  // El área emisora se captura por documento en el campo 'area_emisora'.
};

// ── Logo principal (escudo UNACAR) ──
// Imagen real servida desde /public/assets/
export const LOGO_PRIMARY_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 96" width="62" height="74" role="img" aria-label="Escudo institucional UNACAR">
  <image
    href="/assets/logos/escudo-unacar.png"
    x="0"
    y="0"
    width="80"
    height="96"
    preserveAspectRatio="xMidYMid meet"
  />
</svg>`;

// ── Logo de facultad (FCI - Logo 1 nuevo) ──
// Imagen real servida desde /public/assets/
export const LOGO_FACULTY_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 96" width="56" height="67" role="img" aria-label="Logo Facultad de Ciencias de la Información">
  <image
    href="/assets/logos/logo-fci.png"
    x="0"
    y="0"
    width="80"
    height="96"
    preserveAspectRatio="xMidYMid meet"
  />
</svg>`;
