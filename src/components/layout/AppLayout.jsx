// ============================================================
// SGDI Web — AppLayout Component
// Layout principal: sidebar + header + contenido
// ============================================================

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header  from './Header';
import { useApp } from '../../context/AppContext';

/**
 * AppLayout envuelve todas las páginas autenticadas.
 * Recibe breadcrumbs y pageTitle para el header.
 *
 * Uso: Las páginas exportan también sus datos de breadcrumb
 * a través del contexto o props. Para simplificar la Fase 1A,
 * el layout renderiza sin breadcrumbs y cada página los gestiona
 * internamente.
 */
export default function AppLayout() {
  const { sidebarCollapsed, sidebarMobileOpen, closeSidebarMobile } = useApp();

  const mainClasses = [
    'main-content',
    sidebarCollapsed ? 'sidebar-collapsed' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <Sidebar />

      {/* Overlay para móvil */}
      <div
        className={`sidebar-overlay ${sidebarMobileOpen ? 'active' : ''}`}
        onClick={closeSidebarMobile}
        aria-hidden="true"
      />

      {/* Contenido principal */}
      <div className={mainClasses}>
        <Header />
        <main id="main-content" className="page-wrapper" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
