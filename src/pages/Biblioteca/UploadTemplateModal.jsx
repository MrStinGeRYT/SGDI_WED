// ============================================================
// SGDI Web — UploadTemplateModal
// Flujo de carga con clasificación asistida mock
// Paso 1: Seleccionar archivo  → Paso 2: Revisión de clasificación
// ============================================================

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { suggestClassification } from '../../services/templateService';
import { documentTypes, functionalGroups } from '../../data/documentTypes.json';

const MAX_FILE_SIZE_MB = 10;

const CONFIDENCE_LABEL = (score) => {
  if (score >= 80) return { label: 'Alta', variant: 'success' };
  if (score >= 50) return { label: 'Media', variant: 'warning' };
  return { label: 'Baja', variant: 'danger' };
};

export default function UploadTemplateModal({ isOpen, onClose, onUploaded }) {
  // Paso: 'select' | 'review' | 'uploading' | 'done'
  const [step, setStep] = useState('select');
  const [file, setFile]   = useState(null);
  const [fileError, setFileError] = useState('');
  const [suggestion, setSuggestion] = useState(null);

  // Campos editables en el paso de revisión
  const [title, setTitle]           = useState('');
  const [type, setType]             = useState('');
  const [group, setGroup]           = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags]             = useState('');

  const fileInputRef = useRef(null);

  function reset() {
    setStep('select');
    setFile(null);
    setFileError('');
    setSuggestion(null);
    setTitle(''); setType(''); setGroup('');
    setDescription(''); setTags('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validaciones
    if (!selected.name.toLowerCase().endsWith('.docx')) {
      setFileError('El archivo debe estar en formato .docx');
      return;
    }
    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`El archivo supera el tamaño máximo de ${MAX_FILE_SIZE_MB} MB`);
      return;
    }

    setFileError('');
    setFile(selected);

    // Clasificación asistida
    const baseName = selected.name.replace(/\.docx$/i, '').replace(/[-_]/g, ' ');
    const sug = suggestClassification(selected.name, baseName);
    setSuggestion(sug);
    setTitle(baseName);
    setType(sug.type);
    setGroup(sug.functionalGroup);
    setStep('review');
  }

  async function handleConfirm() {
    if (!title.trim()) return;
    setStep('uploading');
    setFileError('');

    try {
      const { uploadTemplate } = await import('../../services/templateService');
      const newTemplate = await uploadTemplate(file, {
        title: title.trim(),
        type,
        functionalGroup: group,
        description: description.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      });

      setStep('done');
      setTimeout(() => {
        handleClose();
        if (onUploaded) onUploaded(newTemplate);
      }, 1200);
    } catch (err) {
      setFileError(err.message || 'Error al guardar la plantilla. Inténtalo de nuevo.');
      setStep('review');
    }
  }

  const conf = suggestion ? CONFIDENCE_LABEL(suggestion.confidence) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={step === 'uploading' ? undefined : handleClose}
      title="Subir Plantilla"
      size="md"
    >
      {/* ── Paso 1: Selección de archivo ── */}
      {step === 'select' && (
        <div className="upload-modal">
          <div
            className={`upload-dropzone ${fileError ? 'upload-dropzone--error' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const dt = e.dataTransfer.files[0];
              if (dt) handleFileChange({ target: { files: [dt] } });
            }}
          >
            <Upload size={32} className="upload-dropzone__icon" />
            <p className="upload-dropzone__title">Arrastra tu archivo aquí</p>
            <p className="upload-dropzone__sub">o haz clic para seleccionar</p>
            <p className="upload-dropzone__hint">Solo archivos <strong>.docx</strong> · Máximo {MAX_FILE_SIZE_MB} MB</p>
            {fileError && (
              <div className="upload-dropzone__error">
                <AlertCircle size={14} /> {fileError}
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* ── Paso 2: Revisión de clasificación ── */}
      {step === 'review' && suggestion && (
        <div className="upload-review">
          {/* Archivo seleccionado */}
          <div className="upload-review__file">
            <FileText size={20} style={{ color: 'var(--color-primary-500)', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)' }}>
                {file?.name}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                {(file?.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>

          {/* Panel de clasificación sugerida */}
          <div className="upload-review__suggestion">
            <div className="upload-review__suggestion-header">
              <span className="upload-review__suggestion-title">Clasificación sugerida por el sistema</span>
              <Badge variant={conf?.variant}>Confianza {conf?.label} — {suggestion.confidence}%</Badge>
            </div>
            <ul className="upload-review__reasons">
              {suggestion.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Formulario editable */}
          <div className="form-group">
            <label className="form-label form-label--required">Nombre de la plantilla</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre descriptivo de la plantilla"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tipo documental</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                {documentTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Grupo funcional</label>
              <select className="form-select" value={group} onChange={(e) => setGroup(e.target.value)}>
                {functionalGroups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción breve</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe brevemente el propósito de esta plantilla"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Etiquetas <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(separadas por coma)</span></label>
            <input
              type="text"
              className="form-input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tesis, jurado, posgrado"
            />
          </div>

          <div className="upload-review__actions">
            {fileError && (
              <div style={{
                width: '100%', padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-danger-50)', border: '1px solid var(--color-danger-200)',
                borderRadius: 'var(--radius-md)', color: 'var(--color-danger)',
                fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                {fileError}
              </div>
            )}
            <Button variant="ghost" onClick={() => { reset(); setStep('select'); }}>
              Cambiar archivo
            </Button>
            <Button
              variant="primary"
              rightIcon={<ChevronRight size={16} />}
              onClick={handleConfirm}
              disabled={!title.trim()}
            >
              Confirmar y guardar
            </Button>
          </div>
        </div>
      )}

      {/* ── Subiendo ── */}
      {step === 'uploading' && (
        <div className="upload-processing">
          <div className="upload-spinner" />
          <p>Guardando plantilla en el sistema…</p>
        </div>
      )}

      {/* ── Hecho ── */}
      {step === 'done' && (
        <div className="upload-processing">
          <CheckCircle size={40} color="var(--color-success)" />
          <p style={{ color: 'var(--color-success)', fontWeight: 'var(--font-weight-semibold)' }}>
            ¡Plantilla guardada correctamente!
          </p>
        </div>
      )}
    </Modal>
  );
}
