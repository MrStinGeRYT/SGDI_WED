// ============================================================
// SGDI Web — BibliotecaPage  (Fase 1D)
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, Upload, Search, Filter, Eye, Edit,
  Archive, Trash, LayoutGrid, List, FileSearch, Star,
} from 'lucide-react';
import Card          from '../../components/ui/Card';
import Button        from '../../components/ui/Button';
import Badge         from '../../components/ui/Badge';
import Table         from '../../components/ui/Table';
import RowActionsMenu from '../../components/ui/RowActionsMenu';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Modal         from '../../components/ui/Modal';
import EmptyState    from '../../components/ui/EmptyState';
import UploadTemplateModal from './UploadTemplateModal';
import { useToast }  from '../../context/ToastContext';
import { usePermissions } from '../../hooks/usePermissions';
import { getTemplates, archiveTemplate, deleteTemplate } from '../../services/templateService';
import { documentTypes, functionalGroups } from '../../data/documentTypes.json';
import './Biblioteca.css';
import './UploadTemplateModal.css';

export default function BibliotecaPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterType, setFilterType]   = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [viewMode, setViewMode]   = useState('table');

  const [previewTemplate, setPreviewTemplate]   = useState(null);
  const [archiveTarget, setArchiveTarget]       = useState(null);
  const [deleteTarget, setDeleteTarget]         = useState(null);
  const [isProcessing, setIsProcessing]         = useState(false);
  const [showUpload, setShowUpload]             = useState(false);

  const { showToast }   = useToast();
  const { can, noPermissionMsg } = usePermissions();

  // ── Carga de datos via servicio ──
  const loadTemplates = useCallback(async () => {
    setLoading(true);
    const data = await getTemplates({ search, type: filterType, group: filterGroup });
    setTemplates(data);
    setLoading(false);
  }, [search, filterType, filterGroup]);

  useEffect(() => { loadTemplates(); }, [loadTemplates]);

  // ── Columnas de la tabla ──
  const columns = [
    {
      header: 'Plantilla',
      accessor: 'title',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text)' }}>{row.title}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {row.uploadedByName} · {row.uploadedByRole}
          </div>
        </div>
      ),
    },
    {
      header: 'Tipo',
      accessor: 'type',
      cell: (row) => {
        const name = documentTypes.find((t) => t.id === row.type)?.name || row.type;
        return <Badge variant="neutral">{name}</Badge>;
      },
    },
    {
      header: 'Grupo Funcional',
      accessor: 'functionalGroup',
      cell: (row) => functionalGroups.find((g) => g.id === row.functionalGroup)?.name || row.functionalGroup,
    },
    { header: 'Versión', accessor: 'version', align: 'center' },
    {
      header: 'Estado',
      accessor: 'status',
      align: 'center',
      cell: (row) => (
        <Badge variant={row.status?.toUpperCase() === 'ACTIVE' ? 'success' : 'neutral'} dot>
          {row.status?.toUpperCase() === 'ACTIVE' ? 'Activo' : 'Archivado'}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      align: 'right',
      cell: (row) => (
        <RowActionsMenu
          actions={[
            {
              label: 'Ver detalle',
              icon: <Eye size={16} />,
              onClick: (e) => { e.stopPropagation(); setPreviewTemplate(row); },
            },
            {
              label: 'Editar',
              icon: <Edit size={16} />,
              onClick: () => showToast('Editor de plantilla no disponible en esta fase', 'info'),
              disabled: !can('template.edit'),
              tooltip: !can('template.edit') ? noPermissionMsg : undefined,
            },
            {
              label: 'Analizar',
              icon: <FileSearch size={16} />,
              onClick: () => showToast('Análisis no disponible en esta fase', 'info'),
            },
            {
              label: 'Clasificar',
              icon: <Star size={16} />,
              onClick: () => showToast('Clasificación no disponible en esta fase', 'info'),
              disabled: !can('template.classify'),
              tooltip: !can('template.classify') ? noPermissionMsg : undefined,
            },
            {
              label: 'Archivar',
              icon: <Archive size={16} />,
              onClick: (e) => { e.stopPropagation(); setArchiveTarget(row); },
              disabled: !can('template.archive'),
              tooltip: !can('template.archive') ? noPermissionMsg : undefined,
            },
            {
              label: 'Eliminar',
              icon: <Trash size={16} />,
              onClick: (e) => { e.stopPropagation(); setDeleteTarget(row); },
              danger: true,
              disabled: !can('template.delete'),
              tooltip: !can('template.delete') ? noPermissionMsg : undefined,
            },
          ]}
        />
      ),
    },
  ];

  const handleArchive = async () => {
    setIsProcessing(true);
    try {
      await archiveTemplate(archiveTarget.id);
      showToast(`Plantilla "${archiveTarget.title}" archivada.`, 'success');
    } catch {
      showToast('Error al archivar la plantilla.', 'error');
    } finally {
      setIsProcessing(false);
      setArchiveTarget(null);
      loadTemplates();
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await deleteTemplate(deleteTarget.id);
      showToast(`Plantilla "${deleteTarget.title}" eliminada.`, 'success');
    } catch {
      showToast('Error al eliminar la plantilla.', 'error');
    } finally {
      setIsProcessing(false);
      setDeleteTarget(null);
      loadTemplates();
    }
  };

  return (
    <div className="biblioteca-page">

      {/* Encabezado */}
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1 className="page-header__title">Biblioteca de Plantillas</h1>
            <p className="page-header__subtitle">Gestión y clasificación de plantillas documentales institucionales</p>
          </div>
          <div className="btn-group">
            <Button
              variant="primary"
              id="btn-subir-plantilla"
              leftIcon={<Upload size={16} />}
              onClick={() => setShowUpload(true)}
              disabled={!can('template.upload')}
              title={!can('template.upload') ? 'No tienes permisos para subir plantillas' : undefined}
            >
              Subir plantilla
            </Button>
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
              placeholder="Buscar plantillas o etiquetas..."
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              {documentTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="form-input-wrap">
            <select
              className="form-select"
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
            >
              <option value="">Todos los grupos</option>
              {functionalGroups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="toolbar__view-toggle">
            <button
              className={`btn btn--icon btn--sm ${viewMode === 'table' ? 'btn--secondary' : 'btn--ghost'}`}
              onClick={() => setViewMode('table')}
              title="Vista de tabla"
            >
              <List size={18} />
            </button>
            <button
              className={`btn btn--icon btn--sm ${viewMode === 'grid' ? 'btn--secondary' : 'btn--ghost'}`}
              onClick={() => setViewMode('grid')}
              title="Vista de tarjetas"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <Card style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Cargando plantillas…</span>
        </Card>
      ) : templates.length === 0 ? (
        <Card style={{ minHeight: '300px' }}>
          <EmptyState
            icon={BookOpen}
            title="No se encontraron plantillas"
            description="Intenta ajustar los filtros o el término de búsqueda."
          />
        </Card>
      ) : viewMode === 'table' ? (
        <Card>
          <Table columns={columns} data={templates} onRowClick={(row) => setPreviewTemplate(row)} />
        </Card>
      ) : (
        <div className="templates-grid">
          {templates.map((tpl) => (
            <Card key={tpl.id} className="template-card">
              <Card.Body>
                <div className="template-card__header">
                  <Badge variant={tpl.status?.toUpperCase() === 'ACTIVE' ? 'success' : 'neutral'} dot>
                    {tpl.status?.toUpperCase() === 'ACTIVE' ? 'Activo' : 'Archivado'}
                  </Badge>
                  <div className="template-card__actions">
                    <button className="btn btn--icon btn--ghost btn--sm" onClick={() => setPreviewTemplate(tpl)}>
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn btn--icon btn--ghost btn--sm"
                      onClick={() => setArchiveTarget(tpl)}
                      disabled={!can('template.archive')}
                      title={!can('template.archive') ? noPermissionMsg : 'Archivar'}
                    >
                      <Archive size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="template-card__title">{tpl.title}</h3>
                <p className="template-card__desc">{tpl.description}</p>
                <div className="template-card__meta">
                  <div className="meta-item">
                    <span className="meta-label">Tipo:</span>
                    <span className="meta-value">{documentTypes.find((t) => t.id === tpl.type)?.name || tpl.type}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Versión:</span>
                    <span className="meta-value">{tpl.version}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Subido por:</span>
                    <span className="meta-value">{tpl.uploadedByName}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Rol:</span>
                    <span className="meta-value" style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{tpl.uploadedByRole}</span>
                  </div>
                </div>
                <div className="template-card__tags">
                  {(tpl.tags || []).map((tag) => (
                    <span key={tag} className="tag-chip">#{tag}</span>
                  ))}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      <Modal
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        title="Detalles de Plantilla"
        size="md"
        footer={
          <Button
            variant="primary"
            onClick={() => {
              showToast('Editor no disponible en esta fase', 'info');
              setPreviewTemplate(null);
            }}
          >
            Editar Plantilla
          </Button>
        }
      >
        {previewTemplate && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', margin: 0 }}>{previewTemplate.title}</h2>
            <p style={{ color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
              {previewTemplate.description}
            </p>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-4)', padding: 'var(--space-4)',
              background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)',
            }}>
              {[
                ['Tipo', documentTypes.find((t) => t.id === previewTemplate.type)?.name],
                ['Grupo Funcional', documentTypes.find((t) => t.id === previewTemplate.functionalGroup)?.name],
                ['Subido por', previewTemplate.uploadedByName],
                ['Versión', previewTemplate.version],
              ].map(([label, value]) => (
                <div key={label}>
                  <strong style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{label}</strong>
                  <span style={{ fontSize: 'var(--font-size-sm)' }}>{value}</span>
                  {label === 'Subido por' && (
                    <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      {previewTemplate.uploadedByRole}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm archivar */}
      <ConfirmDialog
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchive}
        title="Archivar Plantilla"
        message={`¿Estás seguro de que deseas archivar "${archiveTarget?.title}"? Ya no estará disponible para nuevos documentos.`}
        confirmText="Archivar"
        confirmVariant="warning"
        isLoading={isProcessing}
      />

      {/* Confirm eliminar */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar Plantilla"
        message={`¿Estás seguro de que deseas eliminar permanentemente "${deleteTarget?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        confirmVariant="danger"
        isLoading={isProcessing}
      />

      {/* Modal subir plantilla */}
      <UploadTemplateModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={(tpl) => {
          showToast(`Plantilla "${tpl.title}" guardada correctamente.`, 'success');
          loadTemplates();
        }}
      />

    </div>
  );
}
