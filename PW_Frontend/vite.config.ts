import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Modo de build que genera a propósito una versión con los datos de prueba (npm run build:demo).
const MODO_DEMO = 'demo'

// public/mock tiene las imágenes y el audio de los datos de prueba: solo hacen falta en desarrollo y en la demo.
const sinMediosDePrueba = (): Plugin => ({
  name: 'sin-medios-de-prueba',
  apply: 'build',
  closeBundle() {
    rmSync(resolve(__dirname, 'dist/mock'), { recursive: true, force: true })
  },
})

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const demo = mode === MODO_DEMO
  const sinApi = !env.VITE_API_URL?.trim()

  // Un build de producción sin API publicaría los datos de prueba: se detiene.
  if (command === 'build' && !demo && sinApi) {
    throw new Error(
      [
        '',
        'VITE_API_URL no está configurado: el build se detuvo para no publicar los datos de prueba.',
        '',
        '  · Build de producción: define la URL de la API del módulo Portal web de RR.HH.,',
        '    en PW_Frontend/.env.production o en el entorno:',
        '      VITE_API_URL=https://rrhh.cata.edu.pe/api/portal npm run build',
        '  · Versión con datos de prueba, a propósito: npm run build:demo',
        '',
      ].join('\n'),
    )
  }

  return {
    plugins: [react(), ...(demo ? [] : [sinMediosDePrueba()])],
    // La demo siempre usa los datos locales, aunque el entorno tenga VITE_API_URL.
    define: demo ? { 'import.meta.env.VITE_API_URL': JSON.stringify('') } : {},
  }
})
