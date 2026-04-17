// ============================================================
// SGDI Web — Header Component
// Header fijo superior con estados del sistema, usuario y toggle de tema
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, Sun, Moon } from 'lucide-react';
import { useApp }  from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AiStatusIndicator, Ms365StatusIndicator } from '../ui/StatusIndicator';
import Breadcrumb from './Breadcrumb';
import { ROUTES } from '../../utils/constants';

/**
 * @param {Array<{ label: string, to?: string }>} breadcrumbs
 * @param {string} pageTitle
 */
export default function Header({ breadcrumbs = [], pageTitle = '' }) {
  const { sidebarCollapsed, toggleSidebarMobile, systemStatus, toggleTheme, isDark } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(ROUTES.LOGIN);
  }

  const headerClasses = [
    'header',
    sidebarCollapsed ? 'sidebar-collapsed' : '',
  ].filter(Boolean).join(' ');

  const initials = user?.initials || user?.name?.slice(0, 2).toUpperCase() || 'U';

  return (
    <header className={headerClasses} role="banner">
      {/* ── Izquierda: hamburguesa + breadcrumb ── */}
      <div className="header__left">
        {/* Botón hamburguesa — solo visible en tablet/móvil */}
        <button
          className="header__menu-btn"
          onClick={toggleSidebarMobile}
          aria-label="Abrir menú de navegación"
          aria-expanded="false"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb */}
        <div className="header__breadcrumb-area">
          {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
          {pageTitle && (
            <span className="font-semibold text-md hide-mobile" style={{ color: 'var(--color-text)' }}>
              {pageTitle}
            </span>
          )}
        </div>
      </div>

      {/* ── Derecha: estados + tema + usuario + logout ── */}
      <div className="header__right">
        {/* Indicadores de estado (ocultos en móvil) */}
        <div className="header__status-group" role="status" aria-label="Estado del sistema">
          <AiStatusIndicator    status={systemStatus.ai}    compact />
          <div className="divider-v" style={{ height: '20px' }} />
          <Ms365StatusIndicator status={systemStatus.ms365} compact />
        </div>

        {/* Toggle de tema claro / oscuro */}
        <button
          id="btn-toggle-theme"
          className="header__theme-toggle"
          onClick={toggleTheme}
          aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={isDark ? 'Modo claro' : 'Modo oscuro'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Usuario */}
        <div className="header__user" role="button" aria-label="Información del usuario">
          <div className="header__avatar" aria-hidden="true">{initials}</div>
          <div className="header__user-info">
            <span className="header__user-name">{user?.name || 'Usuario'}</span>
            <span className="header__user-role">{user?.role || ''}</span>
          </div>
        </div>

        {/* Logout */}
        <button
          className="header__logout"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
