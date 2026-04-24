// ============================================================
// SGDI Web — institutionalAssets.js
// Identidad institucional: nombre, membrete, logo SVG placeholder.
// Para producción: reemplazar LOGO_SVG con el SVG real de la institución
// y actualizar los campos de INSTITUTION con los datos reales.
// ============================================================

export const INSTITUTION = {
  name:       'Universidad Institucional de México',
  acronym:    'UIM',
  faculty:    'Facultad de Ciencias de la Información',
  department: 'Coordinación de Posgrado e Investigación',
  city:       'Ciudad Universitaria, CDMX',
  address:    'Av. Universidad 3000, Col. Copilco Universidad, Alcaldía Coyoacán, C.P. 04360, Ciudad de México',
  phone:      'Tel. (55) 5622-0000  |  Ext. 50000',
  web:        'www.uim.edu.mx',
  email:      'posgrado@fci.uim.edu.mx',
  motto:      'Por el conocimiento hacia el futuro',
};

// ── Logo principal (escudo institucional SVG placeholder) ──
// Dimensiones de diseño: 80 × 96 px, colores: azul #1b3a6b / dorado #d4a843
export const LOGO_PRIMARY_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 96" width="62" height="74" role="img" aria-label="Escudo institucional">
  <!-- Escudo base -->
  <path d="M40,4 L76,16 L76,57 C76,79 40,92 40,92 C40,92 4,79 4,57 L4,16 Z" fill="#1b3a6b"/>
  <!-- Borde dorado exterior -->
  <path d="M40,4 L76,16 L76,57 C76,79 40,92 40,92 C40,92 4,79 4,57 L4,16 Z" fill="none" stroke="#d4a843" stroke-width="2.5"/>
  <!-- Borde dorado interior -->
  <path d="M40,11 L69,21 L69,56 C69,74 40,85 40,85 C40,85 11,74 11,56 L11,21 Z" fill="none" stroke="#d4a843" stroke-width="1"/>
  <!-- Libro abierto izquierdo -->
  <path d="M40,37 L40,57 Q30,55 22,59 L22,39 Q30,35 40,37 Z" fill="white" opacity="0.88"/>
  <!-- Libro abierto derecho -->
  <path d="M40,37 L40,57 Q50,55 58,59 L58,39 Q50,35 40,37 Z" fill="white" opacity="0.72"/>
  <!-- Lomo del libro -->
  <line x1="40" y1="37" x2="40" y2="57" stroke="#d4a843" stroke-width="1.5"/>
  <!-- Estrellas decorativas -->
  <text x="40" y="32" text-anchor="middle" fill="#d4a843" font-size="8" font-family="serif">✦ ✦ ✦</text>
  <!-- Acrónimo -->
  <text x="40" y="78" text-anchor="middle" fill="#d4a843" font-size="10" font-family="Georgia, serif" font-weight="bold" letter-spacing="3">UIM</text>
</svg>`;

// ── Logo de facultad (variante secundaria) ──
export const LOGO_FACULTY_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 96" width="56" height="67" role="img" aria-label="Logo Facultad de Ciencias de la Información">
  <!-- Escudo base -->
  <path d="M40,4 L76,16 L76,57 C76,79 40,92 40,92 C40,92 4,79 4,57 L4,16 Z" fill="#2c5282"/>
  <path d="M40,4 L76,16 L76,57 C76,79 40,92 40,92 C40,92 4,79 4,57 L4,16 Z" fill="none" stroke="#d4a843" stroke-width="2.5"/>
  <path d="M40,11 L69,21 L69,56 C69,74 40,85 40,85 C40,85 11,74 11,56 L11,21 Z" fill="none" stroke="#d4a843" stroke-width="1"/>
  <!-- Ícono circuito/información -->
  <circle cx="40" cy="47" r="12" fill="none" stroke="white" stroke-width="1.5" opacity="0.85"/>
  <circle cx="40" cy="47" r="5"  fill="white" opacity="0.85"/>
  <line x1="40" y1="35" x2="40" y2="39" stroke="white" stroke-width="1.5" opacity="0.85"/>
  <line x1="40" y1="55" x2="40" y2="59" stroke="white" stroke-width="1.5" opacity="0.85"/>
  <line x1="28" y1="47" x2="32" y2="47" stroke="white" stroke-width="1.5" opacity="0.85"/>
  <line x1="48" y1="47" x2="52" y2="47" stroke="white" stroke-width="1.5" opacity="0.85"/>
  <!-- Estrellas -->
  <text x="40" y="30" text-anchor="middle" fill="#d4a843" font-size="8" font-family="serif">✦ ✦ ✦</text>
  <!-- Acrónimo -->
  <text x="40" y="78" text-anchor="middle" fill="#d4a843" font-size="9" font-family="Georgia, serif" font-weight="bold" letter-spacing="2">FCI</text>
</svg>`;
