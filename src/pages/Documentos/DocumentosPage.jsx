// ============================================================
// SGDI Web — DocumentosPage
// ============================================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, FilePlus, Search, Edit, Eye, Download, Send, Cloud, Archive } from 'lucide-react';
import Card   from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge  from '../../components/ui/Badge';
import Table  from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import RowActionsMenu from '../../components/ui/RowActionsMenu';
import { useToast } from '../../context/ToastContext';
import { ROUTES } from '../../utils/constants';

import mockDocuments from '../../data/mockDocuments.json';
import { documentTypes } from '../../data/documentTypes.json';

export default function DocumentosPage() {
  const [search, setSearch] = useState('');
  const [archiveDoc, setArchiveDoc] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  const filteredDocs = useMemo(() => {
    return mockDocuments.filter(doc => 
      doc.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleEdit = (id) => {
    navigate(ROUTES.DOCUMENTO_EDIT.replace(':id', id));
  };

  const handleCreate = () => {
    navigate(ROUTES.DOCUMENTO_EDIT.replace(':id', 'nuevo'));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'borrador': return <Badge variant="warning" dot>Borrador</Badge>;
      case 'enviado': return <Badge variant="success" dot>Enviado</Badge>;
      case 'archivado': return <Badge variant="neutral" dot>Archivado</Badge>;
      default: return <Badge variant="info" dot>{status}</Badge>;
    }
  };

  const columns = [
    { 
      header: 'Título del documento', 
      accessor: 'title',
      width: '35%',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{row.title}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {row.createdByName} &middot; {row.createdByRole}
          </div>
        </div>
      )
    },
    { 
      header: 'Tipo', 
      accessor: 'type',
      cell: (row) => documentTypes.find(t => t.id === row.type)?.name || row.type
    },
    { 
      header: 'Estado', 
      accessor: 'status',
      cell: (row) => getStatusBadge(row.status)
    },
    {
      header: 'Actualizado',
      accessor: 'updatedAt',
      cell: (row) => new Date(row.updatedAt).toLocaleDateString()
    },
    { 
      header: 'Integración', 
      align: 'center',
      cell: (row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Cloud size={16} color={row.cloudStatus === 'synced' ? 'var(--color-success)' : 'var(--color-text-muted)'} title={`Nube: ${row.cloudStatus}`} />
          <Send size={16} color={row.emailStatus === 'sent' ? 'var(--color-success)' : 'var(--color-text-muted)'} title={`Correo: ${row.emailStatus}`} />
        </div>
      )
    },
    { 
      header: 'Acciones', 
      align: 'right',
      cell: (row) => (
        <RowActionsMenu
          actions={[
            { label: 'Previsualizar', icon: <Eye size={16} />, onClick: () => {} },
            { label: 'Editar',       icon: <Edit size={16} />, onClick: () => handleEdit(row.id) },
            { label: 'Descargar',    icon: <Download size={16} />, onClick: () => showToast('Descargando documento...', 'info') },
            { label: 'Enviar',       icon: <Send size={16} />, onClick: () => showToast('Envío no disponible en esta fase', 'info') },
            { label: 'Archivar',     icon: <Archive size={16} />, onClick: () => setArchiveDoc(row) },
          ]}
        />
      )
    }
  ];

  const handleArchive = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setArchiveDoc(null);
      showToast(`Documento archivado con éxito.`, 'success');
    }, 800);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1 className="page-header__title">Gestión de Documentos</h1>
            <p className="page-header__subtitle">Documentos generados, cargados y pendientes de acción</p>
          </div>
          <div className="btn-group">
            <Button variant="primary" id="btn-crear-documento" leftIcon={<FilePlus size={16} />} onClick={handleCreate}>
              Crear documento
            </Button>
          </div>
        </div>
      </div>

      <div className="toolbar" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="toolbar__search">
          <div className="search-bar">
            <Search size={18} className="search-bar__icon" />
            <input 
              type="text" 
              className="search-bar__input" 
              placeholder="Buscar documentos por título..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        {filteredDocs.length === 0 ? (
          <div style={{ minHeight: '300px' }}>
            <EmptyState 
              icon={FileText}
              title="No hay documentos"
              description="No se encontraron documentos que coincidan con la búsqueda."
            />
          </div>
        ) : (
          <Table 
            columns={columns} 
            data={filteredDocs} 
          />
        )}
      </Card>

      <ConfirmDialog 
        isOpen={!!archiveDoc}
        onClose={() => setArchiveDoc(null)}
        onConfirm={handleArchive}
        title="Archivar Documento"
        message={`¿Deseas archivar el documento "${archiveDoc?.title}"?`}
        confirmText="Archivar"
        confirmVariant="warning"
        isLoading={isProcessing}
      />
    </div>
  );
}
