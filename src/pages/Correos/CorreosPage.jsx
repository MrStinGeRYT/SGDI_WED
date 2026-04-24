// ============================================================
// SGDI Web — CorreosPage (Fase 1D)
// Correos institucionales con adjuntos dinámicos desde documentService
// ============================================================

import React, { useState, useEffect } from 'react';
import { Mail, Send, Paperclip, CheckCircle, Clock, FileText } from 'lucide-react';
import Card      from '../../components/ui/Card';
import Button    from '../../components/ui/Button';
import Badge     from '../../components/ui/Badge';
import Table     from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import { useToast }  from '../../context/ToastContext';
import { getEmails, sendEmail } from '../../services/emailService';
import { getDocuments } from '../../services/documentService';
import './Correos.css';

export default function CorreosPage() {
  const [to,      setTo]      = useState('');
  const [cc,      setCc]      = useState('');
  const [subject, setSubject] = useState('');
  const [body,    setBody]    = useState('');
  const [attachedDocId, setAttachedDocId] = useState('');

  const [isSending, setIsSending]   = useState(false);
  const [emails,    setEmails]       = useState([]);
  const [documents, setDocuments]    = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  const { showToast } = useToast();

  // ── Cargar historial y documentos disponibles ──
  useEffect(() => {
    getEmails().then(setEmails);
    getDocuments().then((docs) => {
      setDocuments(docs);
      setLoadingDocs(false);
    });
  }, []);

  // ── Enviar correo ──
  const handleSend = async (e) => {
    e.preventDefault();
    if (!to.trim() || !subject.trim() || !body.trim()) {
      showToast('Por favor completa todos los campos requeridos.', 'error');
      return;
    }
    setIsSending(true);
    const attachedDoc = documents.find((d) => d.id === attachedDocId);
    const newEmail = await sendEmail({
      to:         to.trim(),
      cc:         cc.trim(),
      subject:    subject.trim(),
      body:       body.trim(),
      documentId: attachedDocId || null,
      attachment: attachedDoc?.title || null,
    });
    setEmails((prev) => [newEmail, ...prev]);
    setIsSending(false);
    showToast(`Correo enviado a ${to} exitosamente.`, 'success');
    setTo(''); setCc(''); setSubject(''); setBody(''); setAttachedDocId('');
  };

  // ── Columnas del historial ──
  const columns = [
    {
      header: 'Asunto',
      accessor: 'subject',
      width: '35%',
      cell: (row) => <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{row.subject}</div>,
    },
    {
      header: 'Para',
      accessor: 'to',
    },
    {
      header: 'Fecha',
      accessor: 'sentAt',
      cell: (row) => new Date(row.sentAt || row.date).toLocaleString('es-MX'),
    },
    {
      header: 'Documento adjunto',
      accessor: 'attachment',
      cell: (row) => row.attachment ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-size-xs)' }}>
          <Paperclip size={13} />
          <span style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.attachment}
          </span>
        </div>
      ) : (
        <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>Sin adjunto</span>
      ),
    },
    {
      header: 'Enviado por',
      accessor: 'sentByName',
      cell: (row) => (
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          {row.sentByName || '—'}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessor: 'status',
      align: 'center',
      cell: (row) => (
        <Badge variant={row.status === 'delivered' ? 'success' : 'warning'} dot>
          {row.status === 'delivered' ? 'Entregado' : 'Pendiente'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="correos-page">

      {/* Encabezado */}
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1 className="page-header__title">Correos Institucionales</h1>
            <p className="page-header__subtitle">Envío de correos oficiales mediante Microsoft 365</p>
          </div>
          <div className="btn-group">
            <Button variant="outline" id="btn-estado-ms365" leftIcon={<CheckCircle size={16} />}>
              MS365 Conectado (mock)
            </Button>
          </div>
        </div>
      </div>

      <div className="correos-layout">

        {/* Panel izquierdo: Formulario de envío */}
        <div className="correos-form-panel">
          <Card>
            <Card.Header>
              <h2 style={{ fontSize: 'var(--font-size-lg)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={20} color="var(--color-primary-500)" /> Nuevo Correo
              </h2>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSend} className="email-form">

                <div className="form-group">
                  <label className="form-label form-label--required">Para</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="correo@institucion.edu.mx"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CC (Opcional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Separar con comas"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label--required">Asunto</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Asunto del correo"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                {/* Selector dinámico de documentos */}
                <div className="form-group">
                  <label className="form-label">
                    <FileText size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    Adjuntar documento de SGDI Web
                  </label>
                  <select
                    className="form-select"
                    value={attachedDocId}
                    onChange={(e) => setAttachedDocId(e.target.value)}
                    disabled={loadingDocs}
                  >
                    <option value="">
                      {loadingDocs ? 'Cargando documentos…' : 'Sin adjunto'}
                    </option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.title}
                      </option>
                    ))}
                  </select>
                  {attachedDocId && (
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)', marginTop: '4px', display: 'block' }}>
                      ✓ Documento seleccionado
                    </span>
                  )}
                </div>

                <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label className="form-label form-label--required">Mensaje</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Escribe tu mensaje aquí..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    style={{ flex: 1, minHeight: '140px' }}
                    required
                  />
                </div>

                <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="primary" type="submit" disabled={isSending} leftIcon={<Send size={16} />}>
                    {isSending ? 'Enviando…' : 'Enviar Correo Institucional'}
                  </Button>
                </div>

              </form>
            </Card.Body>
          </Card>
        </div>

        {/* Panel derecho: Historial */}
        <div className="correos-history-panel">
          <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Card.Header>
              <h2 style={{ fontSize: 'var(--font-size-lg)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} color="var(--color-primary-500)" /> Historial de Envíos
              </h2>
            </Card.Header>
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {emails.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="No hay correos enviados"
                  description="El historial de correos enviados a través del sistema aparecerá aquí."
                />
              ) : (
                <Table columns={columns} data={emails} />
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
