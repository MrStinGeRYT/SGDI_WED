// ============================================================
// SGDI Web — AppContext
// Estado global de la aplicación: UI, sistema, preferencias
// ============================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SIDEBAR_BREAKPOINT, SYSTEM_STATUS } from '../utils/constants';

const AppContext = createContext(null);

const THEME_KEY = 'sgdi_theme';

/** Aplica el atributo data-theme al <html> y persiste en localStorage */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

export function AppProvider({ children }) {
  // ── Sidebar ──
  const [sidebarCollapsed,  setSidebarCollapsed]  = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  // ── Tema claro / oscuro ──
  // Inicializa desde localStorage (lazy initializer evita parpadeo)
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Aplica el tema guardado al montar (sin parpadeo)
  useEffect(() => {
    applyTheme(theme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setThemeState(next);
    applyTheme(next);
  }

  function setTheme(t) {
    setThemeState(t);
    applyTheme(t);
  }

  // ── Estado del sistema (mock) ──
  const [systemStatus, setSystemStatus] = useState({
    ai:     SYSTEM_STATUS.AI.MOCK,
    ms365:  SYSTEM_STATUS.MS365.NOT_CONFIGURED,
    server: SYSTEM_STATUS.SERVER.ONLINE,
  });

  // ── Notificaciones globales ──
  const [notifications, setNotifications] = useState([]);

  // Cierra sidebar móvil al redimensionar a desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > SIDEBAR_BREAKPOINT) {
        setSidebarMobileOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Funciones de sidebar ──
  function toggleSidebarCollapsed() {
    setSidebarCollapsed((prev) => !prev);
  }

  function toggleSidebarMobile() {
    setSidebarMobileOpen((prev) => !prev);
  }

  function closeSidebarMobile() {
    setSidebarMobileOpen(false);
  }

  // ── Funciones de notificación ──
  function addNotification(message, type = 'info') {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 4000);
  }

  function removeNotification(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  const value = {
    // Sidebar
    sidebarCollapsed,
    sidebarMobileOpen,
    toggleSidebarCollapsed,
    toggleSidebarMobile,
    closeSidebarMobile,

    // Tema
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',

    // Sistema
    systemStatus,
    setSystemStatus,

    // Notificaciones
    notifications,
    addNotification,
    removeNotification,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
}
