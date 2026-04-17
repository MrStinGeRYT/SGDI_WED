// ============================================================
// SGDI Web — Sidebar Component
// Sidebar institucional colapsable con navegación principal
// ============================================================

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, FileText, Mail,
  Settings, HelpCircle, ChevronLeft, ChevronRight,
  LogOut,
} from 'lucide-react';
import { useApp }  from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, APP_NAME, APP_FULL_NAME } from '../../utils/constants';

const NAV_ITEMS = [
  {
    label:   'Dashboard',
    icon:    LayoutDashboard,
    to:      ROUTES.DASHBOARD,
    tooltip: 'Dashboard',
  },
  {
    label:   'Biblioteca',
    icon:    BookOpen,
    to:      ROUTES.BIBLIOTECA,
    tooltip: 'Biblioteca de plantillas',
  },
  {
    label:   'Documentos',
    icon:    FileText,
    to:      ROUTES.DOCUMENTOS,
    tooltip: 'Gestión de documentos',
  },
  {
    label:   'Correos',
    icon:    Mail,
    to:      ROUTES.CORREOS,
    tooltip: 'Envío de correos',
  },
];

const BOTTOM_ITEMS = [
  {
    label:   'Configuración',
    icon:    Settings,
    to:      ROUTES.CONFIGURACION,
    tooltip: 'Configuración del sistema',
  },
  {
    label:   'Ayuda',
    icon:    HelpCircle,
    to:      ROUTES.AYUDA,
    tooltip: 'Ayuda y asistente',
  },
];

export default function Sidebar() {
  const { sidebarCollapsed, sidebarMobileOpen, toggleSidebarCollapsed, closeSidebarMobile } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(ROUTES.LOGIN);
  }

  function handleNavClick() {
    // En móvil cierra el sidebar al navegar
    if (window.innerWidth <= 1024) {
      closeSidebarMobile();
    }
  }

  const sidebarClasses = [
    'sidebar',
    sidebarCollapsed   ? 'collapsed'    : '',
    sidebarMobileOpen  ? 'mobile-open'  : '',
  ].filter(Boolean).join(' ');

  return (
    <aside className={sidebarClasses}>
      {/* ── Brand ── */}
      <NavLink to={ROUTES.DASHBOARD} className="sidebar__brand" onClick={handleNavClick}>
        <div className="sidebar__logo" aria-label="SGDI Web logo">
          SGDI
        </div>
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">{APP_NAME}</span>
          <span className="sidebar__brand-tagline">Gestión Documental</span>
        </div>
      </NavLink>

      {/* ── Navegación principal ── */}
      <nav className="sidebar__nav" aria-label="Navegación principal">
        <div className="sidebar__section-label">Menú principal</div>

        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <item.icon className="nav-item__icon" size={20} />
            <span className="nav-item__label">{item.label}</span>
            <span className="nav-tooltip">{item.tooltip}</span>
          </NavLink>
        ))}

        <div className="sidebar__section-label">Sistema</div>

        {BOTTOM_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <item.icon className="nav-item__icon" size={20} />
            <span className="nav-item__label">{item.label}</span>
            <span className="nav-tooltip">{item.tooltip}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Toggle colapso (solo desktop) ── */}
      <button
        className="sidebar__toggle"
        onClick={toggleSidebarCollapsed}
        aria-label={sidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        title={sidebarCollapsed ? 'Expandir' : 'Colapsar'}
      >
        {sidebarCollapsed
          ? <ChevronRight size={18} />
          : <ChevronLeft  size={18} />}
      </button>

      {/* ── Footer: usuario y logout ── */}
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar" aria-hidden="true">
            {user?.initials || 'U'}
          </div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">{user?.name || 'Usuario'}</div>
            <div className="sidebar__user-role">{user?.role || 'Sin rol'}</div>
          </div>
        </div>

        <button
          className="nav-item sidebar__logout-btn"
          onClick={handleLogout}
          style={{ marginTop: '4px', color: '#f87171' }}
          aria-label="Cerrar sesión"
        >
          <LogOut className="nav-item__icon" size={20} />
          <span className="nav-item__label">Cerrar sesión</span>
          <span className="nav-tooltip">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
