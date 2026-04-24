// ============================================================
// SGDI Web — ConfiguracionPage (Fase 1D)
// Panel MS365 Readiness integrado con ms365Service
// ============================================================

import React, { useState } from 'react';
import {
  Settings, Link, FileText, Layout, Moon, Monitor,
  Mail, Cloud, Database, Shield, CheckCircle, Clock, AlertCircle,
} from 'lucide-react';
import Card      from '../../components/ui/Card';
import Button    from '../../components/ui/Button';
import Badge     from '../../components/ui/Badge';
import Tabs      from '../../components/ui/Tabs';
import EmptyState from '../../components/ui/EmptyState';
import { AiStatusIndicator, Ms365StatusIndicator } from '../../components/ui/StatusIndicator';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { connectMs365, MS365_INTEGRATIONS } from '../../services/ms365Service';
import { documentTypes, functionalGroups } from '../../data/documentTypes.json';
import './Configuracion.css';

// ── Icono por integración ──
const INTEGRATION_ICONS = {
  outlook:   <Mail    size={24} />,
  onedrive:  <Cloud   size={24} />,
  sharepoint:<Database size={24} />,
  entra:     <Shield  size={24} />,
};

// ── Tarjeta de integración MS365 ──
function IntegrationCard({ integration }) {
  return (
    <Card className="ms365-integration-card">
      <Card.Body>
        <div className="ms365-integration-card__header">
          <div className="ms365-integration-card__icon">
            {INTEGRATION_ICONS[integration.id] || <Settings size={24} />}
          </div>
          <div className="ms365-integration-card__title-wrap">
            <h3 className="ms365-integration-card__name">{integration.name}</h3>
            <Badge variant="neutral">Pendiente de configuración</Badge>
          </div>
        </div>

        <p className="ms365-integration-card__desc">{integration.description}</p>

        <ul className="ms365-integration-card__features">
          {integration.features.map((f, i) => (
            <li key={i} className="ms365-integration-card__feature">
              <CheckCircle size={13} style={{ color: 'var(--color-primary-400)', flexShrink: 0 }} />
              {f}
            </li>
          ))}
        </ul>

        <div className="ms365-integration-card__footer">
          <div className="ms365-readiness-badge">
            <Clock size={13} />
            Disponible en Fase 2
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

// ── Render de la pestaña Integraciones ──
function TabIntegraciones({ systemStatus }) {
  const { showToast } = useToast();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    const result = await connectMs365();
    setConnecting(false);
    showToast(result.message, 'warning');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>

      {/* Estado del sistema */}
      <Card>
        <Card.Header>
          <Card.Title>Estado del sistema</Card.Title>
        </Card.Header>
        <Card.Body>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
            <div>
              <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-2)' }}>Inteligencia Artificial</p>
              <AiStatusIndicator status={systemStatus.ai} />
            </div>
            <div>
              <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-2)' }}>Microsoft 365</p>
              <Ms365StatusIndicator status={systemStatus.ms365} />
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Panel de Readiness */}
      <div>
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>
            Microsoft 365 Readiness
          </h2>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
            Integraciones preparadas para conectar en la Fase 2. El frontend ya está listo para recibir tokens reales.
          </p>
        </div>

        {/* Botón de conexión institucional */}
        <Card style={{ marginBottom: 'var(--space-6)', borderLeft: '3px solid var(--color-primary-500)' }}>
          <Card.Body>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                  Conectar cuenta institucional
                </h3>
                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                  Autentica con tu cuenta Microsoft Entra ID para habilitar todas las integraciones de la lista a continuación.
                  En esta fase la conexión es simulada (mock).
                </p>
              </div>
              <Button
                variant="primary"
                id="btn-config-ms365"
                leftIcon={<Link size={16} />}
                onClick={handleConnect}
                disabled={connecting}
              >
                {connecting ? 'Conectando…' : 'Conectar Microsoft 365'}
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Tarjetas de cada integración */}
        <div className="ms365-integrations-grid">
          {MS365_INTEGRATIONS.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Render de la pestaña Documental ──
function TabDocumental() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
      <Card>
        <Card.Header>
          <Card.Title subtitle="Oficios, constancias, memorándums…">Tipos documentales</Card.Title>
        </Card.Header>
        <Card.Body>
          {documentTypes.length === 0 ? (
            <EmptyState icon={Settings} title="Sin configurar" description="No hay tipos documentales configurados." />
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {documentTypes.map((t) => (
                <li key={t.id} style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{t.name}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>{t.description}</span>
                </li>
              ))}
            </ul>
          )}
          <Button variant="outline" size="sm" style={{ marginTop: 'var(--space-4)' }} fullWidth>Gestionar tipos</Button>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title subtitle="Comités, tesis, eventos…">Grupos funcionales</Card.Title>
        </Card.Header>
        <Card.Body>
          {functionalGroups.length === 0 ? (
            <EmptyState icon={Settings} title="Sin configurar" description="No hay grupos funcionales configurados." />
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {functionalGroups.map((g) => (
                <li key={g.id} style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{g.name}</span>
                </li>
              ))}
            </ul>
          )}
          <Button variant="outline" size="sm" style={{ marginTop: 'var(--space-4)' }} fullWidth>Gestionar grupos</Button>
        </Card.Body>
      </Card>
    </div>
  );
}

// ── Render de la pestaña Preferencias ──
function TabPreferencias({ theme, toggleTheme }) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Preferencias de Interfaz</Card.Title>
      </Card.Header>
      <Card.Body>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {theme === 'dark' ? <Moon size={24} /> : <Monitor size={24} />}
            <div>
              <div style={{ fontWeight: 'var(--font-weight-medium)' }}>Modo Oscuro</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Cambia la apariencia del sistema</div>
            </div>
          </div>
          <Button variant={theme === 'dark' ? 'primary' : 'outline'} onClick={toggleTheme}>
            {theme === 'dark' ? 'Desactivar' : 'Activar'} Modo Oscuro
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

// ── Página principal ──
export default function ConfiguracionPage() {
  const { systemStatus, theme, toggleTheme } = useApp();

  const tabItems = [
    {
      label: 'Integraciones',
      icon: <Settings size={16} />,
      content: <TabIntegraciones systemStatus={systemStatus} />,
    },
    {
      label: 'Configuración Documental',
      icon: <FileText size={16} />,
      content: <TabDocumental />,
    },
    {
      label: 'Preferencias',
      icon: <Layout size={16} />,
      content: <TabPreferencias theme={theme} toggleTheme={toggleTheme} />,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">Configuración</h1>
        <p className="page-header__subtitle">Administración del sistema, integraciones y preferencias</p>
      </div>

      <Tabs tabs={tabItems} />
    </div>
  );
}
