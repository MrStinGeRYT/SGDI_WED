// ============================================================
// SGDI Web — DashboardPage
// Panel principal con métricas, accesos rápidos y actividad
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, BookOpen, Mail, Clock,
  Upload, Send, Tag, FilePlus, Cloud,
  TrendingUp, CheckCircle, AlertTriangle,
  Cpu, Link, Server,
} from 'lucide-react';
import Card     from '../../components/ui/Card';
import Badge    from '../../components/ui/Badge';
import Button   from '../../components/ui/Button';
import { AiStatusIndicator, Ms365StatusIndicator } from '../../components/ui/StatusIndicator';
import { useAuth } from '../../context/AuthContext';
import { useApp  } from '../../context/AppContext';
import { ROUTES  } from '../../utils/constants';
import { formatRelativeTime, formatNumber } from '../../utils/formatters';
import mockDashboard from '../../data/mockDashboard.json';
import './Dashboard.css';

// ── Configuración de tarjetas de métricas ──
const STAT_CARDS = [
  {
    id:      'total-docs',
    label:   'Documentos totales',
    key:     'totalDocuments',
    icon:    FileText,
    variant: 'primary',
    trend:   '+8 este mes',
    trendUp: true,
  },
  {
    id:      'active-templates',
    label:   'Plantillas activas',
    key:     'activeTemplates',
    icon:    BookOpen,
    variant: 'success',
    trend:   '+3 este mes',
    trendUp: true,
  },
  {
    id:      'emails-sent',
    label:   'Correos enviados',
    key:     'emailsSent',
    icon:    Mail,
    variant: 'info',
    trend:   'Este mes',
    trendUp: null,
  },
  {
    id:      'pending-docs',
    label:   'Pendientes',
    key:     'pendingDocuments',
    icon:    Clock,
    variant: 'warning',
    trend:   'Requieren acción',
    trendUp: false,
  },
];

// ── Accesos rápidos ──
const QUICK_ACCESS = [
  {
    id:    'qa-biblioteca',
    icon:  BookOpen,
    title: 'Biblioteca de plantillas',
    desc:  'Administra y consulta las plantillas',
    to:    ROUTES.BIBLIOTECA,
  },
  {
    id:    'qa-documentos',
    icon:  FilePlus,
    title: 'Crear documento',
    desc:  'Genera un nuevo documento institucional',
    to:    ROUTES.DOCUMENTOS,
  },
  {
    id:    'qa-correos',
    icon:  Send,
    title: 'Enviar correo',
    desc:  'Envía un correo institucional',
    to:    ROUTES.CORREOS,
  },
  {
    id:    'qa-clasificar',
    icon:  Tag,
    title: 'Clasificar documentos',
    desc:  'Organiza y clasifica documentos pendientes',
    to:    ROUTES.BIBLIOTECA,
  },
  {
    id:    'qa-cloud',
    icon:  Cloud,
    title: 'Subir a la nube',
    desc:  'Sube documentos a OneDrive institucional',
    to:    ROUTES.DOCUMENTOS,
  },
  {
    id:    'qa-config',
    icon:  Upload,
    title: 'Subir plantilla',
    desc:  'Agrega una nueva plantilla al sistema',
    to:    ROUTES.BIBLIOTECA,
  },
];

// ── Íconos de tipo de actividad ──
const ACTIVITY_ICONS = {
  upload:   { icon: Upload,   cls: 'upload'   },
  email:    { icon: Send,     cls: 'email'    },
  classify: { icon: Tag,      cls: 'classify' },
  create:   { icon: FilePlus, cls: 'create'   },
  cloud:    { icon: Cloud,    cls: 'cloud'    },
};

const ACTIVITY_STATUS_BADGE = {
  completed: { variant: 'success', label: 'Completado' },
  pending:   { variant: 'warning', label: 'Pendiente'  },
};

export default function DashboardPage() {
  const { user }          = useAuth();
  const { systemStatus }  = useApp();
  const navigate          = useNavigate();
  const { stats, recentActivity } = mockDashboard;

  const greeting = getGreeting();

  return (
    <div>
      {/* ── Bienvenida ── */}
      <div className="dashboard-welcome">
        <div className="dashboard-welcome__text">
          <h1>{greeting}, {user?.name?.split(' ')[0] || 'Usuario'}</h1>
          <p>Aquí está el resumen de actividad del sistema.</p>
        </div>
        <div className="dashboard-welcome__date">
          {new Date().toLocaleDateString('es-MX', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </div>
      </div>

      {/* ── Tarjetas de métricas ── */}
      <section aria-label="Métricas del sistema" className="dashboard-stats">
        {STAT_CARDS.map((card) => (
          <div key={card.id} id={card.id} className="stat-card">
            <div className="stat-card__header">
              <div className={`stat-card__icon-wrap stat-card__icon-wrap--${card.variant}`}>
                <card.icon size={22} />
              </div>
              {card.trendUp === true  && <TrendingUp size={16} style={{ color: 'var(--color-success)' }} />}
              {card.trendUp === false && <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />}
            </div>
            <div className="stat-card__value">{formatNumber(stats[card.key])}</div>
            <div className="stat-card__label">{card.label}</div>
            {card.trend && (
              <div className={`stat-card__trend stat-card__trend--${card.trendUp === true ? 'up' : card.trendUp === false ? 'down' : 'neutral'}`}>
                {card.trend}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* ── Accesos rápidos ── */}
      <Card>
        <Card.Header>
          <Card.Title subtitle="Operaciones frecuentes del sistema">Accesos rápidos</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="dashboard-quickaccess">
            {QUICK_ACCESS.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className="quick-access-card"
                onClick={() => navigate(item.to)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(item.to)}
                aria-label={item.title}
              >
                <div className="quick-access-card__icon">
                  <item.icon size={22} />
                </div>
                <div>
                  <div className="quick-access-card__title">{item.title}</div>
                  <div className="quick-access-card__desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* ── Fila inferior: actividad + estado ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: 'var(--space-6)',
          marginTop: 'var(--space-6)',
        }}
        className="dashboard-bottom-grid"
      >
        {/* Actividad reciente */}
        <Card>
          <Card.Header>
            <Card.Title subtitle="Últimas acciones registradas en el sistema">
              Actividad reciente
            </Card.Title>
            <Card.Actions>
              <Button variant="ghost" size="sm" id="btn-ver-historial">
                Ver historial completo
              </Button>
            </Card.Actions>
          </Card.Header>
          <Card.Body sm>
            <div className="table-responsive">
              <table className="activity-table" aria-label="Actividad reciente">
                <thead>
                  <tr>
                    <th>Acción</th>
                    <th className="hide-mobile">Usuario</th>
                    <th className="hide-mobile">Hace</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((item) => {
                    const typeInfo   = ACTIVITY_ICONS[item.type] || ACTIVITY_ICONS.create;
                    const badgeInfo  = ACTIVITY_STATUS_BADGE[item.status];
                    const IconComp   = typeInfo.icon;

                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="activity-desc">
                            <div className={`activity-type-icon activity-type-icon--${typeInfo.cls}`}>
                              <IconComp size={14} />
                            </div>
                            <span className="activity-desc__text">{item.description}</span>
                          </div>
                        </td>
                        <td className="hide-mobile text-muted text-sm">{item.user}</td>
                        <td className="hide-mobile text-muted text-sm">{formatRelativeTime(item.timestamp)}</td>
                        <td>
                          <Badge variant={badgeInfo.variant} dot size="sm">
                            {badgeInfo.label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>

        {/* Estado del sistema */}
        <Card>
          <Card.Header>
            <Card.Title subtitle="Estado actual de los módulos">Estado del sistema</Card.Title>
          </Card.Header>
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

              {/* IA */}
              <div className="system-status-item">
                <div className="system-status-item__label">
                  <Cpu size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Inteligencia Artificial
                </div>
                <AiStatusIndicator status={systemStatus.ai} />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  Modo local/simulado activo
                </span>
              </div>

              {/* Microsoft 365 */}
              <div className="system-status-item">
                <div className="system-status-item__label">
                  <Link size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Microsoft 365
                </div>
                <Ms365StatusIndicator status={systemStatus.ms365} />
                <Button
                  variant="outline"
                  size="sm"
                  id="btn-conectar-ms365"
                  leftIcon={<Link size={14} />}
                  style={{ marginTop: '4px' }}
                >
                  Conectar Microsoft 365
                </Button>
              </div>

              {/* Servidor */}
              <div className="system-status-item">
                <div className="system-status-item__label">
                  <Server size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Servidor SGDI
                </div>
                <Badge variant="success" dot pulse>
                  <CheckCircle size={12} style={{ marginRight: '4px' }} />
                  En línea
                </Badge>
              </div>

            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Responsive: en pantallas pequeñas el grid de abajo se apila */}
      <style>{`
        @media (max-width: 1024px) {
          .dashboard-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}
