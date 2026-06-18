// ============================================================
// SGDI Web — FieldsPanel.jsx
// Panel lateral de campos editables del documento.
// Renderiza dinámicamente los campos del schema del tipo documental.
// ============================================================

import React, { useState, useRef } from 'react';
import {
  CheckCircle, AlertCircle, Loader,
  Cloud, Mail, FileText, Info,
  Upload, X as XIcon, PenLine,
} from 'lucide-react';
import { uploadFirmaImagen } from '../../services/documentService';
import './FieldsPanel.css';

// ── Helpers de estado ────────────────────────────────────────

function cloudLabel(s) {
  if (s === 'synced')  return 'Sincronizado';
  if (s === 'syncing') return 'Sincronizando…';
  return 'No sincronizado';
}
function emailLabel(s) {
  if (s === 'sent')    return 'Enviado';
  if (s === 'sending') return 'Enviando…';
  return 'No enviado';
}
function statusClass(s, ok) {
  if (s === ok)        return 'status-synced';
  if (s.endsWith('ing')) return 'status-syncing';
  return 'status-none';
}

// ── Campo de firma digital ───────────────────────────────────

const SIGNATURE_MAX_BYTES = 5 * 1024 * 1024; // 5 MB — igual que el backend
const SIGNATURE_ACCEPT    = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

// docId: ID del documento para llamar al endpoint correcto
function SignatureField({ field, value, onChange, disabled, docId }) {
  const inputRef              = useRef(null);
  const [error, setError]     = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!SIGNATURE_ACCEPT.includes(file.type)) {
      setError('Solo se permiten archivos PNG, JPG o WEBP.');
      e.target.value = '';
      return;
    }
    if (file.size > SIGNATURE_MAX_BYTES) {
      setError('El archivo supera el límite de 5 MB.');
      e.target.value = '';
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const result = await uploadFirmaImagen(docId, file);
      // Guardar la URL del servidor — no base64
      onChange(field.id, result.firmaImgUrl);
    } catch (err) {
      setError(err.message || 'Error al subir la firma. Inténtalo de nuevo.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemove = () => {
    setError(null);
    onChange(field.id, '');
  };

  const hasImage = value && (value.startsWith('http') || value.startsWith('data:'));

  return (
    <div className="fields-panel__signature">
      {uploading ? (
        <div className="fields-panel__signature-upload" style={{ cursor: 'default' }}>
          <Loader size={15} className="spin" /> Subiendo firma…
        </div>
      ) : hasImage ? (
        <div className="fields-panel__signature-preview">
          <img src={value} alt="Firma digital" className="fields-panel__signature-img" />
          <button
            type="button"
            className="fields-panel__signature-remove"
            onClick={handleRemove}
            disabled={disabled}
            title="Quitar firma"
          >
            <XIcon size={13} /> Quitar
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="fields-panel__signature-upload"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          <Upload size={15} /> Cargar firma (PNG / JPG / WEBP)
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        style={{ display: 'none' }}
        onChange={handleFile}
        disabled={disabled || uploading}
      />

      {error && (
        <span className="fields-panel__signature-error">
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </div>
  );
}

// ── Renderizador de campo individual ────────────────────────

function Field({ field, value, onChange, disabled, docId }) {
  const handleChange = (e) => onChange(field.id, e.target.value);

  switch (field.type) {
    case 'signature':
      return (
        <SignatureField
          field={field}
          value={value}
          onChange={onChange}
          disabled={disabled}
          docId={docId}
        />
      );
    case 'textarea':
      return (
        <textarea
          id={`field-${field.id}`}
          className="fields-panel__textarea"
          value={value || ''}
          onChange={handleChange}
          placeholder={field.placeholder || ''}
          disabled={disabled}
          rows={5}
        />
      );
    case 'date':
      return (
        <input
          id={`field-${field.id}`}
          type="date"
          className="fields-panel__input"
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
        />
      );
    default:
      return (
        <input
          id={`field-${field.id}`}
          type="text"
          className="fields-panel__input"
          value={value || ''}
          onChange={handleChange}
          placeholder={field.placeholder || ''}
          disabled={disabled}
        />
      );
  }
}

// ── Componente principal ─────────────────────────────────────

const TABS = [
  { id: 'fields', label: 'Campos' },
  { id: 'meta',   label: 'Metadatos' },
  { id: 'status', label: 'Estado' },
];

export default function FieldsPanel({
  schemaFields = [],
  fieldValues  = {},
  onFieldChange,
  docType,
  doc,
  cloudStatus,
  emailStatus,
  disabled,
  onSaveAsTemplate,
}) {
  const [activeTab, setActiveTab] = useState('fields');
  const docId = doc?.id;

  return (
    <div className="fields-panel">

      {/* ── Tabs ── */}
      <div className="fields-panel__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`fields-panel__tab ${activeTab === tab.id ? 'fields-panel__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Contenido ── */}
      <div className="fields-panel__content">

        {/* Tab: Campos del documento */}
        {activeTab === 'fields' && (
          <>
            {schemaFields.length > 0 ? (
              <>
                <div className="fields-panel__section-title">Campos del documento</div>
                {schemaFields.map((field) => (
                  <div key={field.id} className="fields-panel__field">
                    <label htmlFor={`field-${field.id}`} className="fields-panel__label">
                      {field.label}
                      {field.required && <span className="fields-panel__required">*</span>}
                    </label>
                    <Field
                      field={field}
                      value={fieldValues[field.id]}
                      onChange={onFieldChange}
                      disabled={disabled}
                      docId={docId}
                    />
                    {field.hint && (
                      <span className="fields-panel__hint">{field.hint}</span>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 'var(--space-3)', padding: 'var(--space-6) var(--space-4)',
                textAlign: 'center', color: 'var(--color-text-muted)',
              }}>
                <Info size={24} strokeWidth={1.5} />
                <p style={{ fontSize: 'var(--font-size-sm)', margin: 0, lineHeight: 1.5 }}>
                  El editor de campos para <strong style={{ color: 'var(--color-text)' }}>{docType}</strong>{' '}
                  estará disponible en la próxima fase de implementación.
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', margin: 0 }}>
                  Los datos del documento se conservan correctamente.
                </p>
              </div>
            )}
          </>
        )}

        {/* Tab: Metadatos */}
        {activeTab === 'meta' && doc && (
          <>
            <div className="fields-panel__section-title">Tipo y clasificación</div>
            <div className="fields-panel__field">
              <label className="fields-panel__label">Tipo documental</label>
              <div className="fields-panel__meta-val" style={{ padding: '4px 0' }}>
                {doc.type || '—'}
              </div>
            </div>
            <div className="fields-panel__field">
              <label className="fields-panel__label">Grupo funcional</label>
              <div className="fields-panel__meta-val" style={{ padding: '4px 0' }}>
                {doc.functionalGroup || '—'}
              </div>
            </div>

            <div className="fields-panel__section-title" style={{ marginTop: 'var(--space-2)' }}>
              Trazabilidad
            </div>
            {doc.createdByName && (
              <div className="fields-panel__meta-row">
                <span className="fields-panel__meta-key">Creado por</span>
                <span className="fields-panel__meta-val">{doc.createdByName}</span>
                {doc.createdByRole && (
                  <span className="fields-panel__meta-sub">{doc.createdByRole}</span>
                )}
              </div>
            )}
            {doc.updatedByName && (
              <div className="fields-panel__meta-row">
                <span className="fields-panel__meta-key">Última edición</span>
                <span className="fields-panel__meta-val">{doc.updatedByName}</span>
                {doc.updatedByRole && (
                  <span className="fields-panel__meta-sub">{doc.updatedByRole}</span>
                )}
              </div>
            )}
            {doc.createdAt && (
              <div className="fields-panel__meta-row">
                <span className="fields-panel__meta-key">Fecha creación</span>
                <span className="fields-panel__meta-val">
                  {new Date(doc.createdAt).toLocaleString('es-MX')}
                </span>
              </div>
            )}
            {doc.updatedAt && (
              <div className="fields-panel__meta-row">
                <span className="fields-panel__meta-key">Última modificación</span>
                <span className="fields-panel__meta-val">
                  {new Date(doc.updatedAt).toLocaleString('es-MX')}
                </span>
              </div>
            )}

            <div style={{ marginTop: 'var(--space-4)' }}>
              <button
                className="btn btn--secondary btn--full btn--sm"
                disabled={disabled}
                onClick={onSaveAsTemplate}
              >
                <FileText size={14} /> Guardar como plantilla
              </button>
            </div>
          </>
        )}

        {/* Tab: Estado de integración */}
        {activeTab === 'status' && (
          <>
            <div className="fields-panel__section-title">Integración institucional</div>

            <div className="fields-panel__integration">
              {cloudStatus === 'synced'
                ? <CheckCircle size={16} color="var(--color-success)" />
                : cloudStatus === 'syncing'
                ? <Loader size={16} color="var(--color-warning)" className="spin" />
                : <Cloud size={16} color="var(--color-text-muted)" />}
              <div className="fields-panel__integration-info">
                <span className="fields-panel__integration-label">Nube institucional</span>
                <span className={`fields-panel__integration-val ${statusClass(cloudStatus, 'synced')}`}>
                  {cloudLabel(cloudStatus)}
                </span>
              </div>
            </div>

            <div className="fields-panel__integration">
              {emailStatus === 'sent'
                ? <CheckCircle size={16} color="var(--color-success)" />
                : emailStatus === 'sending'
                ? <Loader size={16} color="var(--color-warning)" className="spin" />
                : <Mail size={16} color="var(--color-text-muted)" />}
              <div className="fields-panel__integration-info">
                <span className="fields-panel__integration-label">Correo Microsoft 365</span>
                <span className={`fields-panel__integration-val ${statusClass(emailStatus, 'sent')}`}>
                  {emailLabel(emailStatus)}
                </span>
              </div>
            </div>

            {doc?.templateSource && (
              <>
                <div className="fields-panel__section-title" style={{ marginTop: 'var(--space-2)' }}>
                  Plantilla base
                </div>
                <div className="fields-panel__meta-row">
                  <span className="fields-panel__meta-key">ID de plantilla</span>
                  <span className="fields-panel__meta-val">{doc.templateSource}</span>
                </div>
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}
