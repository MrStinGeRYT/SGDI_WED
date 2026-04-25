// ============================================================
// SGDI Web — institutionalAssets.js
// Identidad institucional: nombre, membrete, logo SVG placeholder.
// Para producción: reemplazar LOGO_SVG con el SVG real de la institución
// y actualizar los campos de INSTITUTION con los datos reales.
// ============================================================

export const INSTITUTION = {
  name: 'Universidad Autónoma del Carmen',
  acronym: 'UNACAR',
  faculty: 'Facultad de Ciencias de la Información',
  department: 'Coordinación de Posgrado e Investigación',
  city: 'Ciudad del Carmen, Campeche',
  address: 'Edificio del Campus I. Av. 56 Esquina Av. Concordia Número 4, Colonia Benito Juárez, C.P. 24180, Cd. del Carmen, Campeche.',
  phone: 'Tel. (55) 5622-0000  |  Ext. 50000',
  web: 'www.unacar.mx',
  email: 'posgrado@fci.uim.edu.mx',
  motto: 'Por la Grandeza de México',
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
