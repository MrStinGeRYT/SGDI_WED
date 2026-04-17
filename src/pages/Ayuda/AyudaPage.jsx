// ============================================================
// SGDI Web — AyudaPage
// ============================================================

import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Send, Book, FileText, Mail } from 'lucide-react';
import Card      from '../../components/ui/Card';
import Button    from '../../components/ui/Button';
import Accordion from '../../components/ui/Accordion';
import './Ayuda.css';

const FAQ = [
  {
    title: '¿Cómo subo una plantilla al sistema?',
    content: 'Ve a la sección "Biblioteca" y haz clic en el botón "Subir plantilla". Selecciona un archivo Word (.docx) y el sistema lo procesará automáticamente.',
  },
  {
    title: '¿Cómo clasifico un documento?',
    content: 'En la Biblioteca de plantillas, selecciona el documento y usa el botón "Clasificar". Podrás asignarle un tipo documental y grupo funcional.',
  },
  {
    title: '¿Cómo envío un correo institucional?',
    content: 'Ve a la sección "Correos", completa el formulario con destinatario, asunto y cuerpo. Puedes adjuntar un documento y hacer clic en "Enviar correo institucional".',
  },
  {
    title: '¿Cómo conecto Microsoft 365?',
    content: 'Ve a "Configuración" y haz clic en "Conectar Microsoft 365". Necesitarás tus credenciales institucionales. Esta función estará disponible próximamente.',
  },
];

export default function AyudaPage() {
  const [chatMsg, setChatMsg] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'system', text: '¡Hola! Soy el asistente de SGDI Web. ¿En qué puedo ayudarte hoy?' },
  ]);

  function handleSendChat(e) {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    const userMsg = chatMsg.trim();
    setChatLog((prev) => [
      ...prev,
      { role: 'user', text: userMsg },
      { role: 'system', text: 'Gracias por tu pregunta. El asistente IA estará disponible próximamente. Por ahora, consulta las preguntas frecuentes.' },
    ]);
    setChatMsg('');
  }

  return (
    <div className="ayuda-page">
      <div className="page-header">
        <h1 className="page-header__title">Ayuda y Asistente</h1>
        <p className="page-header__subtitle">Soporte, guía rápida y preguntas frecuentes</p>
      </div>

      {/* Quick Links */}
      <div className="ayuda-quick-links">
        <Card className="quick-link-card">
          <Card.Body>
            <Book size={24} className="quick-link-card__icon" />
            <h3 className="quick-link-card__title">Guía de Biblioteca</h3>
            <p className="quick-link-card__desc">Aprende a gestionar plantillas</p>
          </Card.Body>
        </Card>
        <Card className="quick-link-card">
          <Card.Body>
            <FileText size={24} className="quick-link-card__icon" />
            <h3 className="quick-link-card__title">Gestión Documental</h3>
            <p className="quick-link-card__desc">Crea y clasifica documentos</p>
          </Card.Body>
        </Card>
        <Card className="quick-link-card">
          <Card.Body>
            <Mail size={24} className="quick-link-card__icon" />
            <h3 className="quick-link-card__title">Integración MS365</h3>
            <p className="quick-link-card__desc">Sincroniza tus correos</p>
          </Card.Body>
        </Card>
      </div>

      <div className="ayuda-grid">
        {/* FAQ */}
        <Card>
          <Card.Header>
            <Card.Title subtitle="Respuestas a las dudas más comunes">Preguntas frecuentes</Card.Title>
          </Card.Header>
          <Card.Body>
            <Accordion items={FAQ} />
          </Card.Body>
        </Card>

        {/* Mini chat */}
        <Card className="chat-card">
          <Card.Header>
            <Card.Title subtitle="Asistente virtual (modo demo)">
              <MessageSquare size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Asistente SGDI
            </Card.Title>
          </Card.Header>
          <Card.Body className="chat-card__body">
            {/* Chat log */}
            <div className="chat-log">
              {chatLog.map((msg, i) => (
                <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendChat} className="chat-input-form">
              <input
                id="chat-input"
                type="text"
                className="form-input"
                placeholder="Escribe tu consulta…"
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
              />
              <Button type="submit" variant="primary" iconOnly aria-label="Enviar mensaje">
                <Send size={16} />
              </Button>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
