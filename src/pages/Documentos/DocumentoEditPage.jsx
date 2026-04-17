// ============================================================
// SGDI Web — DocumentoEditPage (Mock Editor)
// Editor visual de documentos, versión sin paquetes externos.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Send, Cloud, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { ROUTES } from '../../utils/constants';
import './DocumentoEdit.css';

// Usamos los datos mock
import mockDocuments from '../../data/mockDocuments.json';

export default function DocumentoEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Buscar documento o crear uno vacío si id="nuevo"
  const doc = mockDocuments.find(d => d.id === id) || {
    id: "nuevo",
    title: "Nuevo Documento",
    type: "oficio",
    functionalGroup: "comites",
    content: "" // Contenido mock
  };

  const [title, setTitle] = useState(doc.title);
  const [content, setContent] = useState(doc.content || "Redacta aquí el contenido del documento...");
  const [isSaving, setIsSaving] = useState(false);

  // Simular guardado
  const handleSave = (action = 'save') => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (action === 'save') showToast("Documento guardado localmente", "success");
      else if (action === 'cloud') showToast("Sincronizado con la nube", "success");
      else if (action === 'send') showToast("Documento enviado", "success");
    }, 800);
  };

  return (
    <div className="doc-edit-page">
      {/* ── Header / Topbar del Editor ── */}
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
            />
            <span className="doc-edit__status">
              {isSaving ? "Guardando..." : "Guardado en local"}
            </span>
          </div>
        </div>

        <div className="doc-edit__header-right">
          <button className="btn btn--outline btn--sm" onClick={() => handleSave('cloud')} disabled={isSaving}>
            <Cloud size={16} /> Subir a nube
          </button>
          <button className="btn btn--secondary btn--sm" onClick={() => handleSave('send')} disabled={isSaving}>
            <Send size={16} /> Enviar
          </button>
          <button className="btn btn--primary btn--sm" onClick={() => handleSave('save')} disabled={isSaving}>
            <Save size={16} /> {isSaving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </header>

      {/* ── Área de trabajo ── */}
      <div className="doc-edit__workspace">
        
        {/* Editor (Textarea estilizado) */}
        <main className="doc-edit__main">
          <div className="doc-edit__paper">
            <textarea
              className="doc-edit__textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comienza a escribir el documento..."
            />
          </div>
        </main>

        {/* Panel derecho (Metadatos) */}
        <aside className="doc-edit__sidebar">
          <div className="doc-edit__sidebar-section">
            <h3 className="doc-edit__sidebar-title">Metadatos</h3>
            
            <div className="form-group">
              <label className="form-label">Tipo documental</label>
              <select className="form-select form-select--sm" defaultValue={doc.type}>
                <option value="oficio">Oficio</option>
                <option value="constancia">Constancia</option>
                <option value="memorandum">Memorándum</option>
                <option value="acta">Acta</option>
                <option value="informe">Informe</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Grupo Funcional</label>
              <select className="form-select form-select--sm" defaultValue={doc.functionalGroup}>
                <option value="comites">Comités</option>
                <option value="promocion">Promoción y apoyo académico</option>
                <option value="eventos">Eventos y organización</option>
                <option value="jurados">Jurados y comisiones</option>
                <option value="tesis">Tesis y dirección</option>
              </select>
            </div>
          </div>

          <div className="doc-edit__sidebar-section">
            <h3 className="doc-edit__sidebar-title">Estado de Integración</h3>
            
            <div className="integration-status">
              <Cloud size={16} className="integration-status__icon" />
              <div className="integration-status__info">
                <span className="integration-status__label">Nube Institucional</span>
                <span className="integration-status__value status-pending">No sincronizado</span>
              </div>
            </div>

            <div className="integration-status">
              <Send size={16} className="integration-status__icon" />
              <div className="integration-status__info">
                <span className="integration-status__label">Correo Microsoft 365</span>
                <span className="integration-status__value status-none">No enviado</span>
              </div>
            </div>
          </div>
          
          <div className="doc-edit__sidebar-section">
            <button className="btn btn--secondary btn--full btn--sm">
              <FileText size={16} /> Guardar como plantilla
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}
