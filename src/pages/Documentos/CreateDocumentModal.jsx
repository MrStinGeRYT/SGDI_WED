// ============================================================
// SGDI Web — CreateDocumentModal
// Flujo de 4 pasos para crear un documento desde plantilla
// Paso 1: Seleccionar plantilla
// Paso 2: Datos básicos del documento
// Paso 3: Resumen de revisión
// Paso 4: Generando / redirigir al editor
// ============================================================

import React, { useState, useEffect } from 'react';
import { CheckCircle, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { getTemplates } from '../../services/templateService';
import { createDocument } from '../../services/documentService';
import { documentTypes, functionalGroups } from '../../data/documentTypes.json';

const STEPS = ['Elegir plantilla', 'Datos del documento', 'Revisar', 'Creando'];

export default function CreateDocumentModal({ isOpen, onClose, onCreated }) {
  const [step, setStep]     = useState(0);
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected]   = useState(null);
  const [title, setTitle]         = useState('');
  const [type, setType]           = useState('');
  const [group, setGroup]         = useState('');

  useEffect(() => {
    if (isOpen) {
      getTemplates({ status: 'active' }).then(setTemplates);
      setStep(0); setSelected(null);
      setTitle(''); setType(''); setGroup('');
    }
  }, [isOpen]);

  function handleSelectTemplate(tpl) {
    setSelected(tpl);
    setType(tpl.type);
    setGroup(tpl.functionalGroup);
  }

  function handleClose() {
    setStep(0); setSelected(null);
    onClose();
  }

  async function handleCreate() {
    setStep(3);
    const doc = await createDocument({
      title:           title.trim() || `Documento - ${selected.title}`,
      type,
      functionalGroup: group,
      templateId:      selected.id,
    });
    setTimeout(() => {
      handleClose();
      if (onCreated) onCreated(doc);
    }, 1000);
  }

  const typeName  = documentTypes.find((t) => t.id === type)?.name  || type;
  const groupName = functionalGroups.find((g) => g.id === group)?.name || group;

  return (
    <Modal
      isOpen={isOpen}
      onClose={step === 3 ? undefined : handleClose}
      title="Crear Documento"
      size="md"
    >
      {/* ── Indicador de pasos ── */}
      {step < 3 && (
        <div className="cdm-steps">
          {STEPS.slice(0, 3).map((label, i) => (
            <div key={i} className={`cdm-step ${i === step ? 'cdm-step--active' : ''} ${i < step ? 'cdm-step--done' : ''}`}>
              <div className="cdm-step__dot">
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className="cdm-step__label">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Paso 0: Elegir plantilla ── */}
      {step === 0 && (
        <div className="cdm-body">
          {templates.length === 0 ? (
            <EmptyState icon={FileText} title="No hay plantillas activas" description="Sube primero una plantilla en la Biblioteca." />
          ) : (
            <div className="cdm-template-list">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  className={`cdm-template-item ${selected?.id === tpl.id ? 'cdm-template-item--selected' : ''}`}
                  onClick={() => handleSelectTemplate(tpl)}
                >
                  <FileText size={18} style={{ flexShrink: 0, color: 'var(--color-primary-400)' }} />
                  <div className="cdm-template-item__info">
                    <span className="cdm-template-item__title">{tpl.title}</span>
                    <span className="cdm-template-item__meta">{tpl.fileName}</span>
                  </div>
                  {selected?.id === tpl.id && (
                    <CheckCircle size={18} style={{ color: 'var(--color-success)', marginLeft: 'auto' }} />
                  )}
                </button>
              ))}
            </div>
          )}
          <div className="cdm-footer">
            <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
            <Button
              variant="primary"
              rightIcon={<ChevronRight size={16} />}
              disabled={!selected}
              onClick={() => setStep(1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* ── Paso 1: Datos básicos ── */}
      {step === 1 && (
        <div className="cdm-body">
          <div className="form-group">
            <label className="form-label form-label--required">Título del documento</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Ej: Oficio Asignación Jurado - ${new Date().getFullYear()}`}
              autoFocus
            />
          </div>

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

          <div className="cdm-footer">
            <Button variant="ghost" leftIcon={<ChevronLeft size={16} />} onClick={() => setStep(0)}>
              Atrás
            </Button>
            <Button
              variant="primary"
              rightIcon={<ChevronRight size={16} />}
              disabled={!title.trim()}
              onClick={() => setStep(2)}
            >
              Revisar
            </Button>
          </div>
        </div>
      )}

      {/* ── Paso 2: Resumen ── */}
      {step === 2 && (
        <div className="cdm-body">
          <div className="cdm-summary">
            <div className="cdm-summary__row">
              <span className="cdm-summary__label">Título</span>
              <span className="cdm-summary__value">{title}</span>
            </div>
            <div className="cdm-summary__row">
              <span className="cdm-summary__label">Plantilla base</span>
              <span className="cdm-summary__value">{selected?.title}</span>
            </div>
            <div className="cdm-summary__row">
              <span className="cdm-summary__label">Tipo</span>
              <Badge variant="neutral">{typeName}</Badge>
            </div>
            <div className="cdm-summary__row">
              <span className="cdm-summary__label">Grupo funcional</span>
              <Badge variant="neutral">{groupName}</Badge>
            </div>
            <div className="cdm-summary__row">
              <span className="cdm-summary__label">Estado inicial</span>
              <Badge variant="warning" dot>Borrador</Badge>
            </div>
          </div>

          <div className="cdm-footer">
            <Button variant="ghost" leftIcon={<ChevronLeft size={16} />} onClick={() => setStep(1)}>
              Editar
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Crear documento
            </Button>
          </div>
        </div>
      )}

      {/* ── Paso 3: Generando ── */}
      {step === 3 && (
        <div className="upload-processing">
          <div className="upload-spinner" />
          <p>Generando documento desde la plantilla…</p>
        </div>
      )}
    </Modal>
  );
}
