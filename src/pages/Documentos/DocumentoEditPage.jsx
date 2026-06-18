// ============================================================
// SGDI Web — DocumentoEditPage.jsx (Rediseño E1-E2-E3)
// Editor institucional basado en plantillas y campos controlados.
// Vista previa en tiempo real. Sin textarea libre.
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Save, Send, Cloud,
  Download, Loader, AlertCircle,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { ROUTES }   from '../../utils/constants';
import {
  getDocumentById, updateDocument,
  uploadToCloud,   sendDocumentByEmail,
} from '../../services/documentService';
import { getTemplateSchema } from '../../services/templateService';
import DocumentPreview from './DocumentPreview';
import FieldsPanel     from './FieldsPanel';
import './DocumentoEdit.css';

export default function DocumentoEditPage() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { showToast } = useToast();

  // ── Estado principal ──
  const [doc,        setDoc]        = useState(null);
  const [title,      setTitle]      = useState('');
  const [fieldValues, setFieldValues] = useState({});
  const [schema,     setSchema]     = useState(null);
  const [loading,    setLoading]    = useState(true);

  // ── Estados de integración ──
  const [cloudStatus, setCloudStatus] = useState('none');
  const [emailStatus, setEmailStatus] = useState('none');

  // ── Estados de acción ──
  const [isSaving,    setIsSaving]    = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending,   setIsSending]   = useState(false);

  const anyBusy = isSaving || isUploading || isSending;

  // ── Carga inicial ──
  const loadDoc = useCallback(async () => {
    setLoading(true);
    const data = await getDocumentById(id);
    if (data) {
      setDoc(data);
      setTitle(data.title || '');
      // Si el backend guarda firmaImgUrl en el raíz del doc (fuera de fields),
      // inyectarla en fieldValues para que SignatureField la muestre al recargar.
      const baseFields = data.fields || {};
      const merged = data.firmaImgUrl && !baseFields.firma_imagen
        ? { ...baseFields, firma_imagen: data.firmaImgUrl }
        : baseFields;
      setFieldValues(merged);
      setCloudStatus(data.cloudStatus || 'none');
      setEmailStatus(data.emailStatus || 'none');
      // Cargar schema del tipo documental
      const s = await getTemplateSchema(data.type);
      setSchema(s);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { loadDoc(); }, [loadDoc]);

  // ── Cambio de campo → actualiza preview en tiempo real ──
  const handleFieldChange = (fieldId, value) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  // ── Guardar ──
  const handleSave = async () => {
    if (!doc) return;
    setIsSaving(true);
    await updateDocument(id, { title, fields: fieldValues });
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

  // ── Enviar ──
  const handleSend = async () => {
    if (!doc) return;
    setIsSending(true);
    setEmailStatus('sending');
    await sendDocumentByEmail(id);
    setEmailStatus('sent');
    setIsSending(false);
    showToast('Documento enviado correctamente.', 'success');
  };

  // ── Guardar como plantilla ──
  const handleSaveAsTemplate = () => {
    showToast('Función "Guardar como plantilla" disponible en una próxima fase.', 'info');
  };

  // ── Exportar ──
  const handleExport = () => {
    showToast('La exportación a .docx estará disponible en Fase E5.', 'info');
  };

  // ── Estados de pantalla ──
  if (loading) {
    return (
      <div className="doc-edit-page">
        <div className="doc-edit__loading">
          <Loader size={22} className="spin" />
          Cargando documento…
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="doc-edit-page">
        <div className="doc-edit__not-found">
          <AlertCircle size={40} />
          <p>Documento no encontrado.</p>
          <button className="btn btn--primary btn--sm" onClick={() => navigate(ROUTES.DOCUMENTOS)}>
            Volver a Documentos
          </button>
        </div>
      </div>
    );
  }

  const statusText = isSaving    ? 'Guardando…'
                   : isUploading ? 'Subiendo…'
                   : isSending   ? 'Enviando…'
                   : 'Listo';

  return (
    <div className="doc-edit-page">

      {/* ── Topbar ── */}
      <header className="doc-edit__header">
        <div className="doc-edit__header-left">
          <button
            className="btn btn--ghost btn--icon"
            onClick={() => navigate(ROUTES.DOCUMENTOS)}
            title="Volver a Documentos"
            aria-label="Volver"
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
            <span className="doc-edit__status">{statusText}</span>
          </div>
        </div>

        <div className="doc-edit__header-right">
          {/* Exportar */}
          <button
            className="btn btn--ghost btn--sm"
            onClick={handleExport}
            title="Exportar a .docx (disponible en Fase E5)"
          >
            <Download size={16} /> Exportar
          </button>

          {/* Subir a nube */}
          <button
            className="btn btn--outline btn--sm"
            onClick={handleCloud}
            disabled={anyBusy || cloudStatus === 'synced'}
            title={cloudStatus === 'synced' ? 'Ya sincronizado' : 'Subir a nube institucional'}
          >
            {isUploading ? <Loader size={16} className="spin" /> : <Cloud size={16} />}
            {isUploading ? 'Subiendo…' : 'Nube'}
          </button>

          {/* Enviar */}
          <button
            className="btn btn--secondary btn--sm"
            onClick={handleSend}
            disabled={anyBusy || emailStatus === 'sent'}
            title={emailStatus === 'sent' ? 'Ya enviado' : 'Enviar por correo institucional'}
          >
            {isSending ? <Loader size={16} className="spin" /> : <Send size={16} />}
            {isSending ? 'Enviando…' : 'Enviar'}
          </button>

          {/* Guardar */}
          <button
            className="btn btn--primary btn--sm"
            onClick={handleSave}
            disabled={anyBusy}
          >
            {isSaving ? <Loader size={16} className="spin" /> : <Save size={16} />}
            {isSaving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </header>

      {/* ── Área de trabajo ── */}
      <div className="doc-edit__workspace">

        {/* Vista previa del documento (izquierda) */}
        <DocumentPreview
          docType={doc.type}
          values={fieldValues}
        />

        {/* Panel de campos (derecha) */}
        <aside className="doc-edit__sidebar">
          <FieldsPanel
            schemaFields={schema?.fields || []}
            fieldValues={fieldValues}
            onFieldChange={handleFieldChange}
            docType={doc.type}
            doc={doc}
            cloudStatus={cloudStatus}
            emailStatus={emailStatus}
            disabled={anyBusy}
            onSaveAsTemplate={handleSaveAsTemplate}
          />
        </aside>

      </div>
    </div>
  );
}
