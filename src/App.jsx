// ============================================================
// SGDI Web — App.jsx
// Enrutador principal con rutas protegidas
// ============================================================

import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// Contextos
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider }           from './context/AppContext';
import { ToastProvider }         from './context/ToastContext';

// Layout
import AppLayout from './components/layout/AppLayout';

// Páginas
import LoginPage         from './pages/Login/LoginPage';
import DashboardPage     from './pages/Dashboard/DashboardPage';
import BibliotecaPage    from './pages/Biblioteca/BibliotecaPage';
import DocumentosPage    from './pages/Documentos/DocumentosPage';
import DocumentoEditPage from './pages/Documentos/DocumentoEditPage';
import CorreosPage       from './pages/Correos/CorreosPage';
import ConfiguracionPage from './pages/Configuracion/ConfiguracionPage';
import AyudaPage         from './pages/Ayuda/AyudaPage';

import { ROUTES } from './utils/constants';

// ── Ruta protegida: redirige a /login si no hay sesión ──
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Pantalla de carga mínima mientras se verifica la sesión
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        color: 'var(--color-text-muted)',
        fontSize: 'var(--font-size-base)',
        gap: '12px',
      }}>
        <div style={{
          width: '20px', height: '20px',
          border: '2px solid var(--color-border)',
          borderTopColor: 'var(--color-primary-500)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        Cargando SGDI Web…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}

// ── Router interno (necesita acceso a useAuth) ──
function AppRouter() {
  return (
    <Routes>
      {/* Pública */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* Protegidas bajo AppLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index                         element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path={ROUTES.DASHBOARD}       element={<DashboardPage />} />
        <Route path={ROUTES.BIBLIOTECA}      element={<BibliotecaPage />} />
        <Route path={ROUTES.DOCUMENTOS}      element={<DocumentosPage />} />
        <Route path={ROUTES.DOCUMENTO_EDIT}  element={<DocumentoEditPage />} />
        <Route path={ROUTES.CORREOS}         element={<CorreosPage />} />
        <Route path={ROUTES.CONFIGURACION}   element={<ConfiguracionPage />} />
        <Route path={ROUTES.AYUDA}           element={<AyudaPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}

// ── App principal con providers ──
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <ToastProvider>
            <AppRouter />
          </ToastProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
