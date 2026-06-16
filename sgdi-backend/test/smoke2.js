// test/smoke2.js — Smoke test ampliado: templates + firma-imagen
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE = 'http://localhost:3001/api'
let token = null
let docId = null
let tplId = null

async function req(method, path, body, auth = true) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth && token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  const icon = res.ok ? '✅' : '❌'
  console.log(`${icon} ${method} ${path} → ${res.status}`, JSON.stringify(data).slice(0, 150))
  return { ok: res.ok, data, status: res.status }
}

async function reqMultipart(path, formData, auth = true) {
  const headers = {}
  if (auth && token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: formData })
  const data = await res.json().catch(() => ({}))
  const icon = res.ok ? '✅' : '❌'
  console.log(`${icon} POST ${path} → ${res.status}`, JSON.stringify(data).slice(0, 150))
  return { ok: res.ok, data, status: res.status }
}

async function main() {
  console.log('\n🔥 SGDI Backend — Smoke Test 2 (Templates + Firma Imagen)\n')

  // Login
  const loginRes = await req('POST', '/auth/login', { email: 'admin@sgdi.unacar.mx', password: 'Admin1234!' })
  if (loginRes.ok) token = loginRes.data.token
  else { console.error('Login falló. Abortando.'); process.exit(1) }

  // Crear documento de prueba
  const docRes = await req('POST', '/documents', { title: 'Doc Test Firma', type: 'oficio' })
  if (docRes.ok) docId = docRes.data.id

  // ── Templates ────────────────────────────────────────────────────────────────
  console.log('\n── Templates ──')

  // Crear archivo de plantilla de prueba (texto simple como .docx mock)
  const testFilePath = path.join(__dirname, '_test_template.txt')
  fs.writeFileSync(testFilePath, 'Contenido de plantilla de prueba para SGDI.')

  const tplFormData = new FormData()
  tplFormData.append('file', new Blob(['Plantilla mock'], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }), 'plantilla_test.docx')
  tplFormData.append('title',           'Plantilla de Prueba')
  tplFormData.append('type',            'oficio')
  tplFormData.append('functionalGroup', 'tesis')
  tplFormData.append('version',         '1.0')
  tplFormData.append('tags',            'test,prueba')

  const tplRes = await reqMultipart('/templates', tplFormData)
  if (tplRes.ok) tplId = tplRes.data.id

  await req('GET', '/templates')
  if (tplId) await req('GET', `/templates/${tplId}`)

  // ── Firma imagen ─────────────────────────────────────────────────────────────
  console.log('\n── Firma Imagen ──')

  if (docId) {
    // Crear imagen PNG mínima (1x1 pixel)
    const pngBuffer = Buffer.from([
      0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A,0x00,0x00,0x00,0x0D,0x49,0x48,0x44,0x52,
      0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x01,0x08,0x02,0x00,0x00,0x00,0x90,0x77,0x53,
      0xDE,0x00,0x00,0x00,0x0C,0x49,0x44,0x41,0x54,0x08,0xD7,0x63,0xF8,0xCF,0xC0,0x00,
      0x00,0x00,0x02,0x00,0x01,0xE2,0x21,0xBC,0x33,0x00,0x00,0x00,0x00,0x49,0x45,0x4E,
      0x44,0xAE,0x42,0x60,0x82
    ])

    const firmaFormData = new FormData()
    firmaFormData.append('firma', new Blob([pngBuffer], { type: 'image/png' }), 'firma_test.png')

    await reqMultipart(`/documents/${docId}/firma-imagen`, firmaFormData)

    // Verificar que el documento tiene la URL de firma
    const docFull = await req('GET', `/documents/${docId}`)
    console.log(`   firmaImgUrl: ${docFull.data.firmaImgUrl}`)
  }

  // Cleanup: archivar template
  if (tplId) await req('PATCH', `/templates/${tplId}/archive`)

  // Cleanup archivo temporal
  try { fs.unlinkSync(testFilePath) } catch {}

  console.log('\n✔ Smoke Test 2 completado.\n')
}

main().catch(console.error)
