// ============================================================
// SGDI Web — CorreosPage
// ============================================================

import React, { useState } from 'react';
import { Mail, Send, Paperclip, CheckCircle, Clock } from 'lucide-react';
import Card   from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge  from '../../components/ui/Badge';
import Table  from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import { useToast } from '../../context/ToastContext';
import './Correos.css';

import mockEmails from '../../data/mockEmails.json';

export default function CorreosPage() {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { showToast } = useToast();

  const handleSend = (e) => {
    e.preventDefault();
    if (!to || !subject || !body) {
      showToast("Por favor completa los campos requeridos.", "error");
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      showToast("Correo institucional enviado exitosamente.", "success");
      setTo(''); setCc(''); setSubject(''); setBody('');
    }, 1000);
  };

  const columns = [
    {
      header: 'Asunto',
      accessor: 'subject',
      width: '35%',
      cell: (row) => <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{row.subject}</div>
    },
    {
      header: 'Para',
      accessor: 'to'
    },
    {
      header: 'Fecha',
      accessor: 'date',
      cell: (row) => new Date(row.date).toLocaleString()
    },
    {
      header: 'Adjunto',
      accessor: 'attachment',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-size-xs)' }}>
          <Paperclip size={14} /> {row.attachment}
        </div>
      )
    },
    {
      header: 'Estado',
      accessor: 'status',
      align: 'center',
      cell: (row) => (
        <Badge variant={row.status === 'delivered' ? 'success' : 'warning'} dot>
          {row.status === 'delivered' ? 'Entregado' : 'Pendiente'}
        </Badge>
      )
    }
  ];

  return (
    <div className="correos-page">
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1 className="page-header__title">Correos Institucionales</h1>
            <p className="page-header__subtitle">Envío de correos oficiales mediante Microsoft 365</p>
          </div>
          <div className="btn-group">
            <Button variant="outline" id="btn-estado-ms365" leftIcon={<CheckCircle size={16} />}>
              MS365 Conectado
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

                <div className="form-group">
                  <label className="form-label">Adjuntar Documento</label>
                  <select className="form-select">
                    <option value="">Seleccionar documento de SGDI Web...</option>
                    <option value="doc_101">Oficio Asignación Jurado - Juan Pérez</option>
                    <option value="doc_103">Memorándum Convocatoria Semana de la Ciencia</option>
                  </select>
                </div>

                <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label className="form-label form-label--required">Mensaje</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Escribe tu mensaje aquí..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    style={{ flex: 1, minHeight: '150px' }}
                    required
                  />
                </div>

                <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="primary" type="submit" disabled={isSending} leftIcon={<Send size={16} />}>
                    {isSending ? 'Enviando...' : 'Enviar Correo Institucional'}
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
              {mockEmails.length === 0 ? (
                <EmptyState 
                  icon={Clock} 
                  title="No hay correos enviados" 
                  description="El historial de correos enviados a través del sistema aparecerá aquí."
                />
              ) : (
                <Table 
                  columns={columns} 
                  data={mockEmails} 
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
