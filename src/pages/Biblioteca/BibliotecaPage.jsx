// ============================================================
// SGDI Web — BibliotecaPage
// ============================================================

import React, { useState, useMemo } from 'react';
import { BookOpen, Upload, Search, Filter, Eye, Edit, Archive, Trash, LayoutGrid, List, FileSearch, Star } from 'lucide-react';
import Card   from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge  from '../../components/ui/Badge';
import Table  from '../../components/ui/Table';
import RowActionsMenu from '../../components/ui/RowActionsMenu';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Modal  from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { useToast } from '../../context/ToastContext';
import './Biblioteca.css';

import mockTemplates from '../../data/mockTemplates.json';
import { documentTypes, functionalGroups } from '../../data/documentTypes.json';

export default function BibliotecaPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modals state
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [archiveTemplate, setArchiveTemplate] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { showToast } = useToast();

  // Filtrado de datos
  const filteredTemplates = useMemo(() => {
    return mockTemplates.filter(tpl => {
      const matchSearch = tpl.title.toLowerCase().includes(search.toLowerCase()) ||
                          tpl.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      const matchType = filterType ? tpl.type === filterType : true;
      const matchGroup = filterGroup ? tpl.functionalGroup === filterGroup : true;
      return matchSearch && matchType && matchGroup;
    });
  }, [search, filterType, filterGroup]);

  // Columnas para la tabla
  const columns = [
    {
      header: 'Título',
      accessor: 'title',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text)' }}>{row.title}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {row.uploadedByName} &middot; {row.uploadedByRole}
          </div>
        </div>
      ),
    },
    {
      header: 'Tipo',
      accessor: 'type',
      cell: (row) => {
        const typeName = documentTypes.find(t => t.id === row.type)?.name || row.type;
        return <Badge variant="neutral">{typeName}</Badge>;
      },
    },
    {
      header: 'Grupo Funcional',
      accessor: 'functionalGroup',
      cell: (row) => documentTypes.find(t => t.id === row.functionalGroup)?.name || row.functionalGroup,
    },
    {
      header: 'Versión',
      accessor: 'version',
      align: 'center',
    },
    {
      header: 'Estado',
      accessor: 'status',
      align: 'center',
      cell: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'neutral'} dot>
          {row.status === 'active' ? 'Activo' : 'Archivado'}
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
              onClick: () => {},
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
            },
            {
              label: 'Archivar',
              icon: <Archive size={16} />,
              onClick: (e) => { e.stopPropagation(); setArchiveTemplate(row); },
            },
            {
              label: 'Eliminar',
              icon: <Trash size={16} />,
              onClick: () => showToast('Eliminar no disponible en esta fase', 'info'),
              danger: true,
            },
          ]}
        />
      ),
    },
  ];

  const handleArchive = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setArchiveTemplate(null);
      showToast(`Plantilla "${archiveTemplate?.title}" archivada.`, 'success');
    }, 800);
  };

  return (
    <div className="biblioteca-page">

      {/* ── Encabezado ── */}
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1 className="page-header__title">Biblioteca de Plantillas</h1>
            <p className="page-header__subtitle">Gestión y clasificación de plantillas documentales institucionales</p>
          </div>
          <div className="btn-group">
            <Button variant="primary" id="btn-subir-plantilla" leftIcon={<Upload size={16} />}>
              Subir plantilla
            </Button>
          </div>
        </div>
      </div>

      {/* ── Barra de herramientas ── */}
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
              {documentTypes.map(t => (
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
              {functionalGroups.map(g => (
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

      {/* ── Contenido principal ── */}
      {filteredTemplates.length === 0 ? (
        /* Estado vacío — aplica tanto a tabla como a grid */
        <Card style={{ minHeight: '300px' }}>
          <EmptyState
            icon={BookOpen}
            title="No se encontraron plantillas"
            description="Intenta ajustar los filtros o el término de búsqueda para encontrar lo que necesitas."
          />
        </Card>
      ) : viewMode === 'table' ? (
        /* Vista tabla */
        <Card>
          <Table
            columns={columns}
            data={filteredTemplates}
            onRowClick={(row) => setPreviewTemplate(row)}
          />
        </Card>
      ) : (
        /* Vista cuadrícula */
        <div className="templates-grid">
          {filteredTemplates.map(tpl => (
            <Card key={tpl.id} className="template-card">
              <Card.Body>
                <div className="template-card__header">
                  <Badge variant={tpl.status === 'active' ? 'success' : 'neutral'} dot>
                    {tpl.status === 'active' ? 'Activo' : 'Archivado'}
                  </Badge>
                  <div className="template-card__actions">
                    <button
                      className="btn btn--icon btn--ghost btn--sm"
                      onClick={() => setPreviewTemplate(tpl)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn btn--icon btn--ghost btn--sm"
                      onClick={() => setArchiveTemplate(tpl)}
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
                    <span className="meta-value">
                      {documentTypes.find(t => t.id === tpl.type)?.name || tpl.type}
                    </span>
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
                  {tpl.tags.map(tag => (
                    <span key={tag} className="tag-chip">#{tag}</span>
                  ))}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* ── Modales ── */}

      {/* Preview de plantilla */}
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
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-4)',
              padding: 'var(--space-4)',
              background: 'var(--color-surface-alt)',
              borderRadius: 'var(--radius-md)',
            }}>
              <div>
                <strong style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Tipo</strong>
                {documentTypes.find(t => t.id === previewTemplate.type)?.name}
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Grupo Funcional</strong>
                {documentTypes.find(t => t.id === previewTemplate.functionalGroup)?.name}
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Subido por</strong>
                {previewTemplate.uploadedByName}
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginTop: '2px' }}>
                  {previewTemplate.uploadedByRole}
                </span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Versión</strong>
                {previewTemplate.version}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmación de archivo */}
      <ConfirmDialog
        isOpen={!!archiveTemplate}
        onClose={() => setArchiveTemplate(null)}
        onConfirm={handleArchive}
        title="Archivar Plantilla"
        message={`¿Estás seguro de que deseas archivar la plantilla "${archiveTemplate?.title}"? Ya no estará disponible para nuevos documentos.`}
        confirmText="Archivar"
        confirmVariant="warning"
        isLoading={isProcessing}
      />

    </div>
  );
}
