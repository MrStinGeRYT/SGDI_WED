// ============================================================
// SGDI Web — LoginPage
// Página de inicio de sesión institucional
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, FileText, BookOpen, Mail, AlertCircle, Shield, Layers, Cloud } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, APP_NAME, APP_FULL_NAME } from '../../utils/constants';
import ParticleBackground from '../../components/login/ParticleBackground';
import './Login.css';

const FEATURES = [
  {
    icon:  FileText,
    label: 'Gestión centralizada de documentos',
    desc:  'Organiza y clasifica toda la documentación institucional',
  },
  {
    icon:  BookOpen,
    label: 'Biblioteca de plantillas',
    desc:  'Accede a plantillas oficiales clasificadas por tipo y área',
  },
  {
    icon:  Mail,
    label: 'Correos institucionales',
    desc:  'Envía documentos desde tu cuenta Microsoft 365',
  },
  {
    icon:  Cloud,
    label: 'Nube institucional',
    desc:  'Sincronización con OneDrive y SharePoint',
  },
];

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Por favor ingresa tu usuario y contraseña.');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(username.trim(), password);

    if (result.success) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    } else {
      setError(result.error || 'Credenciales incorrectas.');
    }

    setLoading(false);
  }

  return (
    <div className="login-page">

      {/* ══════════════════════════════════════
          PANEL VISUAL (izquierdo / decorativo)
          ══════════════════════════════════════ */}
      <div className="login-page__panel" aria-hidden="true">

        {/* Fondo de partículas — componente separado, fácil de desactivar */}
        <ParticleBackground />

        {/* Contenido del panel — z-index 1 para estar sobre las partículas */}
        <div className="login-page__panel-content">

          {/* Logo institucional */}
          <div className="login-page__panel-logo">
            <Shield size={28} strokeWidth={1.8} />
          </div>

          {/* Nombre del sistema */}
          <h1 className="login-page__panel-title">{APP_NAME}</h1>
          <p className="login-page__panel-subtitle">
            {APP_FULL_NAME}
          </p>

          {/* Divisor decorativo */}
          <div className="login-page__panel-divider" />

          {/* Características */}
          <ul className="login-page__panel-features" role="list">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <li key={label} className="login-page__feature">
                <div className="login-page__feature-icon">
                  <Icon size={15} strokeWidth={1.8} />
                </div>
                <div className="login-page__feature-text">
                  <span className="login-page__feature-label">{label}</span>
                  <span className="login-page__feature-desc">{desc}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Badge institucional inferior */}
          <div className="login-page__panel-badge">
            <Layers size={13} strokeWidth={1.8} />
            <span>Sistema Institucional Certificado</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          PANEL DE FORMULARIO (derecho)
          ══════════════════════════════════════ */}
      <div className="login-page__form-panel">

        {/* Logo visible solo en móvil (cuando el panel izq. se oculta) */}
        <div className="login-page__mobile-brand">
          <div className="login-page__mobile-logo">
            <Shield size={20} strokeWidth={1.8} />
          </div>
          <span className="login-page__mobile-name">{APP_NAME}</span>
        </div>

        <div className="login-page__form-header">
          <h2 className="login-page__form-title">Iniciar sesión</h2>
          <p className="login-page__form-subtitle">
            Accede con tu cuenta institucional para continuar.
          </p>
        </div>

        {/* Credenciales de demo */}
        <div className="login-demo" role="note">
          <strong>Demo:</strong> usuario <code>admin</code> / contraseña <code>admin123</code>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Formulario de inicio de sesión"
        >
          {/* Mensaje de error */}
          {error && (
            <div className="login-form__error" role="alert" aria-live="polite">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Usuario */}
          <div className="login-form__input-group">
            <label htmlFor="login-username" className="form-label">
              Usuario o correo institucional
            </label>
            <div className="login-form__input-wrap">
              <User className="login-form__input-icon" size={17} aria-hidden="true" />
              <input
                id="login-username"
                type="text"
                className="login-form__input"
                placeholder="Ej. admin o correo@institucion.edu.mx"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                disabled={loading}
                aria-required="true"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="login-form__input-group">
            <label htmlFor="login-password" className="form-label">
              Contraseña
            </label>
            <div className="login-form__input-wrap">
              <Lock className="login-form__input-icon" size={17} aria-hidden="true" />
              <input
                id="login-password"
                type="password"
                className="login-form__input"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
                aria-required="true"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="login-form__submit">
            <button
              type="submit"
              id="btn-login-submit"
              className="btn btn--primary btn--lg btn--full"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner" aria-hidden="true" />
                  Iniciando sesión…
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </div>
        </form>

        {/* Ayuda */}
        <div className="login-page__help">
          ¿Problemas para acceder? Contacta al administrador del sistema
          o al área de soporte técnico institucional.
        </div>

        <div className="login-page__footer">
          {APP_NAME} v1.0 · Uso exclusivo institucional
        </div>
      </div>
    </div>
  );
}
