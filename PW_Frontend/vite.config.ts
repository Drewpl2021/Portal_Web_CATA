import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  if (command === 'build' && !env.VITE_API_URL) {
    console.warn(
      '\n⚠  VITE_API_URL está vacío: este build usará los datos de prueba de src/api/mock y mostrará la franja «Datos de prueba».\n',
    )
  }
  return { plugins: [react()] }
})
