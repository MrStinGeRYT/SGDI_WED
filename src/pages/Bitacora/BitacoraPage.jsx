// ============================================================
// SGDI Web — BitacoraPage
// Historial de actividad institucional del sistema
// ============================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ClipboardList, Search, Filter, User, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { auditService } from '../../services/auditService';
import './Bitacora.css';

const MODULE_OPTIONS = ['Todos', 'Biblioteca', 'Documentos', 'Correos', 'Configuración', 'Sistema'];

const ACTION_BADGE = {
  upload_template:  'info',
  edit_template:    'neutral',
  archive_template: 'warning',
  delete_template:  'danger',
  classify_template:'info',
  create_document:  'success',
  edit_document:    'neutral',
  archive_document: 'warning',
  upload_cloud:     'info',
  send_email:       'success',
  login:            'neutral',
  logout:           'neutral',
};

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

export default function BitacoraPage() {
  const [log, setLog]           = useState([]);
  const [search, setSearch]     = useState('');
  const [filterModule, setFilterModule] = useState('Todos');
  const [loading, setLoading]   = useState(true);

  const fetchLog = useCallback(async () => {
    setLoading(true);
    const data = await auditService.getLog();
    setLog(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLog(); }, [fetchLog]);

  const filtered = useMemo(() => {
    let result = [...log];
    if (filterModule !== 'Todos') {
      result = result.filter((e) => e.module === filterModule);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.userName.toLowerCase().includes(q) ||
          e.target.toLowerCase().includes(q) ||
          e.actionLabel.toLowerCase().includes(q),
      );
    }
    return result;
  }, [log, search, filterModule]);

  return (
    <div className="bitacora-page">

      {/* Encabezado */}
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1 className="page-header__title">Bitácora de Actividad</h1>
            <p className="page-header__subtitle">
              Historial completo de acciones realizadas en el sistema por todos los usuarios
            </p>
          </div>
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="toolbar">
        <div className="toolbar__search">
          <div className="search-bar">
            <Search size={18} className="search-bar__icon" />
            <input
              type="text"
              className="search-bar__input"
              placeholder="Buscar por usuario, acción o documento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="toolbar__filters">
          <div className="form-input-wrap">
            <Filter size={16} className="form-icon" />
            <select
              className="form-select form-input--with-icon"
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
            >
              {MODULE_OPTIONS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="bitacora-stats">
        <div className="bitacora-stat-card">
          <span className="bitacora-stat-value">{log.length}</span>
          <span className="bitacora-stat-label">Registros totales</span>
        </div>
        <div className="bitacora-stat-card">
          <span className="bitacora-stat-value">
            {new Set(log.map((e) => e.userId)).size}
          </span>
          <span className="bitacora-stat-label">Usuarios activos</span>
        </div>
        <div className="bitacora-stat-card">
          <span className="bitacora-stat-value">
            {log.filter((e) => e.module === 'Biblioteca').length}
          </span>
          <span className="bitacora-stat-label">Acciones en Biblioteca</span>
        </div>
        <div className="bitacora-stat-card">
          <span className="bitacora-stat-value">
            {log.filter((e) => e.module === 'Correos').length}
          </span>
          <span className="bitacora-stat-label">Correos enviados</span>
        </div>
      </div>

      {/* Lista de eventos */}
      {loading ? (
        <Card>
          <EmptyState icon={ClipboardList} title="Cargando bitácora…" description="Consultando el historial de actividad." />
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={ClipboardList}
            title="No hay registros"
            description="No se encontraron entradas en la bitácora con los filtros actuales."
          />
        </Card>
      ) : (
        <Card>
          <div className="bitacora-list">
            {filtered.map((entry) => (
              <div key={entry.id} className="bitacora-entry">

                {/* Avatar */}
                <div className="bitacora-entry__avatar" aria-hidden="true">
                  {getInitials(entry.userName)}
                </div>

                {/* Contenido principal */}
                <div className="bitacora-entry__body">
                  <div className="bitacora-entry__header">
                    <span className="bitacora-entry__user">{entry.userName}</span>
                    <Badge variant="neutral" className="bitacora-entry__role">
                      {entry.userRole}
                    </Badge>
                  </div>

                  <div className="bitacora-entry__action">
                    <Badge variant={ACTION_BADGE[entry.action] || 'neutral'}>
                      {entry.actionLabel}
                    </Badge>
                    <span className="bitacora-entry__target">
                      {entry.target}
                    </span>
                  </div>

                  <div className="bitacora-entry__meta">
                    <span className="bitacora-entry__module">{entry.module}</span>
                    <span className="bitacora-entry__sep">·</span>
                    <Calendar size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                    <span className="bitacora-entry__time"> {formatDateTime(entry.timestamp)}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </Card>
      )}

    </div>
  );
}
