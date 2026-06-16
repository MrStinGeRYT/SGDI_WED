// server.js — Entry point
import app from './src/app.js'
import { env } from './src/config/env.js'

const PORT = env.PORT

app.listen(PORT, () => {
  console.log(`✅ SGDI Backend corriendo en http://localhost:${PORT}`)
  console.log(`📦 Entorno: ${env.NODE_ENV}`)
  console.log(`💾 Storage: ${env.STORAGE_DRIVER}`)
})
