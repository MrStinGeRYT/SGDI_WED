// prisma/seed.js — Siembra usuarios iniciales (Prisma 5)
// Ejecutar con: node prisma/seed.js  (o npm run db:seed)
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // ── Admin inicial ──────────────────────────────────────────────────────────
  const adminEmail    = 'admin@sgdi.unacar.mx'
  const adminPassword = 'Admin1234!'  // Cambiar en producción

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } })

  if (existing) {
    console.log(`ℹ️  El usuario admin ya existe (${adminEmail}). Seed omitido para admin.`)
  } else {
    const hashed = await bcrypt.hash(adminPassword, 12)
    const admin  = await prisma.user.create({
      data: {
        name:     'Administrador SGDI',
        email:    adminEmail,
        password: hashed,
        role:     'ADMIN',
        active:   true,
      },
    })
    console.log(`✅ Usuario admin creado:`)
    console.log(`   Email:    ${admin.email}`)
    console.log(`   Rol:      ${admin.role}`)
    console.log(`   Password: ${adminPassword}  ← cambiar en producción`)
  }

  // ── Usuario editor de prueba ───────────────────────────────────────────────
  const editorEmail    = 'editor@sgdi.unacar.mx'
  const editorPassword = 'Editor1234!'

  const existingEditor = await prisma.user.findUnique({ where: { email: editorEmail } })

  if (!existingEditor) {
    const hashedEditor = await bcrypt.hash(editorPassword, 12)
    await prisma.user.create({
      data: {
        name:     'Editor de Prueba',
        email:    editorEmail,
        password: hashedEditor,
        role:     'EDITOR',
        active:   true,
      },
    })
    console.log(`✅ Usuario editor creado: ${editorEmail} / ${editorPassword}`)
  }

  console.log('\n🎉 Seed completado.')
}

main()
  .catch(e => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
