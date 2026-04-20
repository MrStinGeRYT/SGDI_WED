// ============================================================
// SGDI Web — emailService.js
// Capa de acceso a datos de Correos (mock).
// ============================================================

import mockEmails from '../data/mockEmails.json';
import { auditService } from './auditService';
import { getCurrentUser } from './userService';

let _emails = [...mockEmails];
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getEmails() {
  await delay(300);
  return [..._emails].sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
}

export async function sendEmail(emailData) {
  await delay(1000);
  const user = getCurrentUser();
  const newEmail = {
    id:         `mail_${Date.now()}`,
    to:         emailData.to,
    cc:         emailData.cc || '',
    subject:    emailData.subject,
    body:       emailData.body || '',
    attachment: emailData.attachment || null,
    documentId: emailData.documentId || null,
    status:     'delivered',
    sentById:   user?.id   || 'usr-001',
    sentByName: user?.name || 'Sistema',
    sentAt:     new Date().toISOString(),
  };
  _emails = [newEmail, ..._emails];
  auditService.log('send_email', emailData.to, newEmail.id, 'Correos');
  return newEmail;
}

const emailService = { getEmails, sendEmail };
export default emailService;
