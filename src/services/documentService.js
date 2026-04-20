// ============================================================
// SGDI Web — documentService.js
// Capa de acceso a datos de Documentos (mock).
// ============================================================

import mockDocuments from '../data/mockDocuments.json';
import { auditService } from './auditService';
import { getCurrentUser } from './userService';

let _documents = [...mockDocuments];
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getDocuments(filters = {}) {
  await delay(300);
  let result = [..._documents];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((d) => d.title.toLowerCase().includes(q));
  }
  if (filters.status) result = result.filter((d) => d.status === filters.status);
  return result;
}

export async function getDocumentById(id) {
  await delay(200);
  return _documents.find((d) => d.id === id) || null;
}

export async function createDocument(metadata) {
  await delay(1000);
  const user = getCurrentUser();
  const now  = new Date().toISOString();
  const newDoc = {
    id:              `doc_${Date.now()}`,
    title:           metadata.title,
    type:            metadata.type,
    functionalGroup: metadata.functionalGroup,
    status:          'borrador',
    content:         '',
    createdAt:       now,
    updatedAt:       now,
    createdById:     user?.id   || 'usr-001',
    createdByName:   user?.name || 'Sistema',
    createdByRole:   user?.role || 'Administrador',
    updatedById:     user?.id   || 'usr-001',
    updatedByName:   user?.name || 'Sistema',
    updatedByRole:   user?.role || 'Administrador',
    templateSource:  metadata.templateId || null,
    cloudStatus:     'none',
    emailStatus:     'none',
  };
  _documents = [newDoc, ..._documents];
  auditService.log('create_document', newDoc.title, newDoc.id, 'Documentos');
  return newDoc;
}

export async function updateDocument(id, changes) {
  await delay(800);
  const user = getCurrentUser();
  _documents = _documents.map((d) =>
    d.id === id
      ? { ...d, ...changes, updatedAt: new Date().toISOString(),
          updatedById: user?.id, updatedByName: user?.name, updatedByRole: user?.role }
      : d,
  );
  const doc = _documents.find((d) => d.id === id);
  auditService.log('edit_document', doc?.title || id, id, 'Documentos');
  return doc;
}

export async function uploadToCloud(id) {
  await delay(1200);
  _documents = _documents.map((d) =>
    d.id === id ? { ...d, cloudStatus: 'synced' } : d,
  );
  auditService.log('upload_cloud', id, id, 'Documentos');
  return true;
}

export async function sendDocumentByEmail(id) {
  await delay(800);
  _documents = _documents.map((d) =>
    d.id === id ? { ...d, emailStatus: 'sent', status: 'enviado' } : d,
  );
  return true;
}

export async function archiveDocument(id) {
  await delay(800);
  _documents = _documents.map((d) =>
    d.id === id ? { ...d, status: 'archivado' } : d,
  );
  const doc = _documents.find((d) => d.id === id);
  auditService.log('archive_document', doc?.title || id, id, 'Documentos');
  return true;
}

const documentService = {
  getDocuments, getDocumentById, createDocument,
  updateDocument, uploadToCloud, sendDocumentByEmail, archiveDocument,
};
export default documentService;
