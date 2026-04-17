// ============================================================
// SGDI Web — ConfiguracionPage
// ============================================================

import React from 'react';
import { Settings, Link, FileText, Layout, Moon, Monitor } from 'lucide-react';
import Card   from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Tabs   from '../../components/ui/Tabs';
import EmptyState from '../../components/ui/EmptyState';
import { AiStatusIndicator, Ms365StatusIndicator } from '../../components/ui/StatusIndicator';
import { useApp } from '../../context/AppContext';

import { documentTypes, functionalGroups } from '../../data/documentTypes.json';

export default function ConfiguracionPage() {
  const { systemStatus, theme, toggleTheme } = useApp();

  const renderIntegrations = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
      {/* Estado del sistema */}
      <Card>
        <Card.Header>
          <Card.Title>Estado del sistema</Card.Title>
        </Card.Header>
        <Card.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
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

      {/* Microsoft 365 */}
      <Card>
        <Card.Header>
          <Card.Title subtitle="OneDrive, Outlook, SharePoint">Integración Microsoft 365</Card.Title>
        </Card.Header>
        <Card.Body>
          <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-4)' }}>
            Conecta tu cuenta institucional de Microsoft 365 para habilitar el envío de correos,
            sincronización con OneDrive y acceso a SharePoint.
          </p>
          <Button variant="primary" id="btn-config-ms365" leftIcon={<Link size={16} />} fullWidth>
            Conectar Microsoft 365
          </Button>
        </Card.Body>
      </Card>
    </div>
  );

  const renderDocumental = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
      {/* Tipos documentales */}
      <Card>
        <Card.Header>
          <Card.Title subtitle="Oficios, constancias, memorándums…">Tipos documentales</Card.Title>
        </Card.Header>
        <Card.Body>
          {documentTypes.length === 0 ? (
            <EmptyState 
              icon={Settings} 
              title="Sin configurar" 
              description="No hay tipos documentales configurados." 
              className="py-4"
            />
          ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {documentTypes.map(t => (
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

      {/* Grupos funcionales */}
      <Card>
        <Card.Header>
          <Card.Title subtitle="Comités, tesis, eventos…">Grupos funcionales</Card.Title>
        </Card.Header>
        <Card.Body>
          {functionalGroups.length === 0 ? (
            <EmptyState 
              icon={Settings} 
              title="Sin configurar" 
              description="No hay grupos funcionales configurados." 
            />
          ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {functionalGroups.map(g => (
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

  const renderPreferencias = () => (
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

  const tabItems = [
    { label: 'Integraciones y Estado', icon: <Settings size={16} />, content: renderIntegrations() },
    { label: 'Configuración Documental', icon: <FileText size={16} />, content: renderDocumental() },
    { label: 'Preferencias', icon: <Layout size={16} />, content: renderPreferencias() }
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
