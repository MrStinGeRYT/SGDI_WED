// test/smoke.js — Prueba rápida de endpoints principales
import 'dotenv/config'

const BASE = 'http://localhost:3001/api'
let token = null
let docId = null

async function req(method, path, body, auth = false) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth && token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  const icon = res.ok ? '✅' : '❌'
  console.log(`${icon} ${method} ${path} → ${res.status}`, JSON.stringify(data).slice(0, 120))
  return { ok: res.ok, data, status: res.status }
}

async function main() {
  console.log('\n🔥 SGDI Backend — Smoke Test\n')

  // Health
  await req('GET', '/health')

  // Login con credenciales incorrectas
  await req('POST', '/auth/login', { email: 'x@x.com', password: 'wrong' })

  // Login correcto
  const loginRes = await req('POST', '/auth/login', {
    email:    'admin@sgdi.unacar.mx',
    password: 'Admin1234!',
  })
  if (loginRes.ok) token = loginRes.data.token

  // /me
  await req('GET', '/auth/me', null, true)

  // /me sin token
  await req('GET', '/auth/me', null, false)

  // Crear documento
  const createRes = await req('POST', '/documents', {
    title: 'Oficio de prueba #1',
    type:  'oficio',
  }, true)
  if (createRes.ok) docId = createRes.data.id

  // Listar documentos
  await req('GET', '/documents', null, true)

  // Obtener por ID
  if (docId) await req('GET', `/documents/${docId}`, null, true)

  // Actualizar documento
  if (docId) await req('PATCH', `/documents/${docId}`, {
    status:     'REVIEW',
    firmaTexto: 'Lic. Juan Pérez',
    fields:     { folio: 'OF-2026-001', asunto: 'Prueba de sistema' },
  }, true)

  // Dashboard
  await req('GET', '/dashboard', null, true)

  // Audit
  await req('GET', '/audit', null, true)

  // Archivar
  if (docId) await req('PATCH', `/documents/${docId}/archive`, null, true)

  console.log('\n✔ Smoke test completado.\n')
}

main().catch(console.error)
