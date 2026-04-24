// ============================================================
// SGDI Web — DocumentoEditPage (Fase 1D)
// Editor mock que usa documentService correctamente.
// Flujo: cargar → editar → guardar → nube → enviar
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Save, Send, Cloud, FileText,
  CheckCircle, Clock, AlertCircle, Loader,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { ROUTES } from '../../utils/constants';
import {
  getDocumentById,
  updateDocument,
  uploadToCloud,
  sendDocumentByEmail,
} from '../../services/documentService';
import { documentTypes, functionalGroups } from '../../data/documentTypes.json';
import './DocumentoEdit.css';

// ── Helpers ──────────────────────────────────────────────────

function CloudIcon({ status }) {
  if (status === 'synced') return <CheckCircle size={15} color="var(--color-success)" />;
  if (status === 'syncing') return <Loader size={15} color="var(--color-warning)" className="spin" />;
  return <AlertCircle size={15} color="var(--color-text-muted)" />;
}

function EmailIcon({ status }) {
  if (status === 'sent') return <CheckCircle size={15} color="var(--color-success)" />;
  if (status === 'sending') return <Loader size={15} color="var(--color-warning)" className="spin" />;
  return <AlertCircle size={15} color="var(--color-text-muted)" />;
}

function cloudLabel(status) {
  if (status === 'synced')  return 'Sincronizado';
  if (status === 'syncing') return 'Sincronizando…';
  return 'No sincronizado';
}

function emailLabel(status) {
  if (status === 'sent')    return 'Enviado';
  if (status === 'sending') return 'Enviando…';
  return 'No enviado';
}

// ── Componente principal ────────────────────────────────────

export default function DocumentoEditPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { showToast } = useToast();

  // Estado del documento
  const [doc,    setDoc]    = useState(null);
  const [title,  setTitle]  = useState('');
  const [type,   setType]   = useState('');
  const [group,  setGroup]  = useState('');
  const [content, setContent] = useState('');
  const [loadingDoc, setLoadingDoc] = useState(true);

  // Estados de integración (reactivos, separados del doc base)
  const [cloudStatus, setCloudStatus] = useState('none');
  const [emailStatus, setEmailStatus] = useState('none');

  // Estado de acciones
  const [isSaving,    setIsSaving]    = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending,   setIsSending]   = useState(false);

  // ── Cargar documento ──
  const loadDoc = useCallback(async () => {
    setLoadingDoc(true);
    const data = await getDocumentById(id);
    if (data) {
      setDoc(data);
      setTitle(data.title);
      setType(data.type || '');
      setGroup(data.functionalGroup || '');
      setContent(data.content || '');
      setCloudStatus(data.cloudStatus || 'none');
      setEmailStatus(data.emailStatus || 'none');
    }
    setLoadingDoc(false);
  }, [id]);

  useEffect(() => { loadDoc(); }, [loadDoc]);

  // ── Guardar cambios ──
  const handleSave = async () => {
    if (!doc) return;
    setIsSaving(true);
    await updateDocument(id, { title, content, type, functionalGroup: group });
    setIsSaving(false);
    showToast('Documento guardado correctamente.', 'success');
  };

  // ── Subir a nube ──
  const handleCloud = async () => {
    if (!doc) return;
    setIsUploading(true);
    setCloudStatus('syncing');
    await uploadToCloud(id);
    setCloudStatus('synced');
    setIsUploading(false);
    showToast('Documento sincronizado con la nube institucional.', 'success');
  };

  // ── Enviar por correo ──
  const handleSend = async () => {
    if (!doc) return;
    setIsSending(true);
    setEmailStatus('sending');
    await sendDocumentByEmail(id);
    setEmailStatus('sent');
    setIsSending(false);
    showToast('Documento enviado correctamente.', 'success');
  };

  // ── Pantalla de carga ──
  if (loadingDoc) {
    return (
      <div className="doc-edit-page">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: '100%', gap: '12px', color: 'var(--color-text-muted)',
        }}>
          <Loader size={20} className="spin" />
          Cargando documento…
        </div>
      </div>
    );
  }

  // ── Documento no encontrado ──
  if (!doc) {
    return (
      <div className="doc-edit-page">
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100%', gap: '16px',
          color: 'var(--color-text-muted)',
        }}>
          <AlertCircle size={40} />
          <p>Documento no encontrado.</p>
          <button
            className="btn btn--primary btn--sm"
            onClick={() => navigate(ROUTES.DOCUMENTOS)}
          >
            Volver a Documentos
          </button>
        </div>
      </div>
    );
  }

  const anyBusy = isSaving || isUploading || isSending;

  return (
    <div className="doc-edit-page">

      {/* ── Topbar del editor ── */}
      <header className="doc-edit__header">
        <div className="doc-edit__header-left">
          <button
            className="btn btn--ghost btn--icon"
            onClick={() => navigate(ROUTES.DOCUMENTOS)}
            aria-label="Volver a Documentos"
            title="Volver"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="doc-edit__title-wrap">
            <input
              type="text"
              className="doc-edit__title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del documento"
              disabled={anyBusy}
            />
            <span className="doc-edit__status">
              {isSaving    ? 'Guardando…'  :
               isUploading ? 'Subiendo…'   :
               isSending   ? 'Enviando…'   :
               'Listo'}
            </span>
          </div>
        </div>

        <div className="doc-edit__header-right">
          <button
            className="btn btn--outline btn--sm"
            onClick={handleCloud}
            disabled={anyBusy || cloudStatus === 'synced'}
            title={cloudStatus === 'synced' ? 'Ya sincronizado' : 'Subir a nube institucional'}
          >
            {isUploading
              ? <Loader size={16} className="spin" />
              : <Cloud size={16} />}
            {isUploading ? 'Subiendo…' : 'Subir a nube'}
          </button>
          <button
            className="btn btn--secondary btn--sm"
            onClick={handleSend}
            disabled={anyBusy || emailStatus === 'sent'}
            title={emailStatus === 'sent' ? 'Ya enviado' : 'Enviar por correo institucional'}
          >
            {isSending
              ? <Loader size={16} className="spin" />
              : <Send size={16} />}
            {isSending ? 'Enviando…' : 'Enviar'}
          </button>
          <button
            className="btn btn--primary btn--sm"
            onClick={handleSave}
            disabled={anyBusy}
          >
            {isSaving
              ? <Loader size={16} className="spin" />
              : <Save size={16} />}
            {isSaving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </header>

      {/* ── Área de trabajo ── */}
      <div className="doc-edit__workspace">

        {/* Editor principal */}
        <main className="doc-edit__main">
          <div className="doc-edit__paper">
            <textarea
              className="doc-edit__textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comienza a redactar el contenido del documento aquí…"
              disabled={anyBusy}
            />
          </div>
        </main>

        {/* Panel lateral de metadatos */}
        <aside className="doc-edit__sidebar">

          {/* Metadatos del documento */}
          <div className="doc-edit__sidebar-section">
            <h3 className="doc-edit__sidebar-title">Metadatos</h3>

            <div className="form-group">
              <label className="form-label">Tipo documental</label>
              <select
                className="form-select form-select--sm"
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={anyBusy}
              >
                <option value="">Seleccionar tipo…</option>
                {documentTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Grupo funcional</label>
              <select
                className="form-select form-select--sm"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                disabled={anyBusy}
              >
                <option value="">Seleccionar grupo…</option>
                {functionalGroups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            {/* Trazabilidad */}
            <div className="doc-edit__meta-row">
              <span className="doc-edit__meta-label">Creado por</span>
              <span className="doc-edit__meta-value">
                {doc.createdByName || '—'}
                {doc.createdByRole && (
                  <em style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    {doc.createdByRole}
                  </em>
                )}
              </span>
            </div>

            {doc.updatedByName && (
              <div className="doc-edit__meta-row">
                <span className="doc-edit__meta-label">Última edición</span>
                <span className="doc-edit__meta-value">
                  {doc.updatedByName}
                  {doc.updatedByRole && (
                    <em style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {doc.updatedByRole}
                    </em>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Estado de integración */}
          <div className="doc-edit__sidebar-section">
            <h3 className="doc-edit__sidebar-title">Estado de integración</h3>

            <div className="integration-status">
              <CloudIcon status={cloudStatus} />
              <div className="integration-status__info">
                <span className="integration-status__label">Nube institucional</span>
                <span
                  className={`integration-status__value ${
                    cloudStatus === 'synced' ? 'status-synced' :
                    cloudStatus === 'syncing' ? 'status-syncing' :
                    'status-none'
                  }`}
                >
                  {cloudLabel(cloudStatus)}
                </span>
              </div>
            </div>

            <div className="integration-status">
              <EmailIcon status={emailStatus} />
              <div className="integration-status__info">
                <span className="integration-status__label">Correo Microsoft 365</span>
                <span
                  className={`integration-status__value ${
                    emailStatus === 'sent'    ? 'status-synced' :
                    emailStatus === 'sending' ? 'status-syncing' :
                    'status-none'
                  }`}
                >
                  {emailLabel(emailStatus)}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones secundarias */}
          <div className="doc-edit__sidebar-section">
            <button
              className="btn btn--secondary btn--full btn--sm"
              disabled={anyBusy}
              onClick={() => showToast('Función "Guardar como plantilla" disponible en una próxima fase.', 'info')}
            >
              <FileText size={16} /> Guardar como plantilla
            </button>
          </div>

          {/* Historial de tiempos */}
          {(doc.createdAt || doc.updatedAt) && (
            <div className="doc-edit__sidebar-section doc-edit__timestamps">
              {doc.createdAt && (
                <div className="doc-edit__meta-row">
                  <Clock size={12} style={{ color: 'var(--color-text-muted)' }} />
                  <span className="doc-edit__meta-label" style={{ fontSize: 'var(--font-size-xs)' }}>
                    Creado: {new Date(doc.createdAt).toLocaleString('es-MX')}
                  </span>
                </div>
              )}
              {doc.updatedAt && (
                <div className="doc-edit__meta-row">
                  <Clock size={12} style={{ color: 'var(--color-text-muted)' }} />
                  <span className="doc-edit__meta-label" style={{ fontSize: 'var(--font-size-xs)' }}>
                    Modificado: {new Date(doc.updatedAt).toLocaleString('es-MX')}
                  </span>
                </div>
              )}
            </div>
          )}

        </aside>
      </div>
    </div>
  );
}
