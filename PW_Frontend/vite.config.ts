import { rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Modo de build que genera a propósito una versión con los datos de prueba (npm run build:demo).
const MODO_DEMO = 'demo'

// Carpeta donde está publicada la demo: https://cata.edu.pe/PW/. Si la demo se mueve a la raíz del
// dominio o a otra carpeta, cambiar este valor (con barra al principio y al final) y volver a
// generarla. También se puede indicar sin tocar el archivo: VITE_BASE=/otra/ npm run build:demo
const BASE_DEMO = '/PW/'

// public/mock tiene las imágenes y el audio de los datos de prueba: solo hacen falta en desarrollo y en la demo.
const sinMediosDePrueba = (): Plugin => {
  let salida = ''
  return {
    name: 'sin-medios-de-prueba',
    apply: 'build',
    // La carpeta de salida real (dist/ u otra con --outDir).
    configResolved(c) {
      salida = resolve(c.root, c.build.outDir)
    },
    closeBundle() {
      rmSync(resolve(salida, 'mock'), { recursive: true, force: true })
    },
  }
}

// .htaccess de Apache (GoDaddy, cPanel) generado con la misma base del build, para que nunca queden
// desalineados: las rutas del portal (/matricula, /nosotros/himno…) las resuelve la propia página, así
// que toda dirección que no sea un archivo real entrega index.html y recargar no da 404.
const htaccess = (base: string): Plugin => {
  let salida = ''
  return {
    name: 'htaccess',
    apply: 'build',
    configResolved(c) {
      salida = resolve(c.root, c.build.outDir)
    },
    closeBundle() {
      const contenido = [
        `# Generado por vite.config.ts para la base ${base}. No editar a mano: cambiar la base y volver a generar.`,
        'Options -MultiViews',
        '<IfModule mod_rewrite.c>',
        '  RewriteEngine On',
        `  RewriteBase ${base}`,
        '  RewriteCond %{REQUEST_FILENAME} !-f',
        '  RewriteCond %{REQUEST_FILENAME} !-d',
        `  RewriteRule ^ ${base}index.html [QSA,L]`,
        '</IfModule>',
        '',
        '# index.html siempre fresco; los archivos de assets/ llevan su huella en el nombre y pueden guardarse un año.',
        '<IfModule mod_headers.c>',
        '  <FilesMatch "index\\.html$">',
        '    Header set Cache-Control "no-cache"',
        '  </FilesMatch>',
        '  <FilesMatch "\\.(js|css|woff2)$">',
        '    Header set Cache-Control "public, max-age=31536000, immutable"',
        '  </FilesMatch>',
        '</IfModule>',
        '',
      ].join('\n')
      writeFileSync(resolve(salida, '.htaccess'), contenido)
    },
  }
}

export default defineConfig(({ command, mode, isPreview }) => {
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

  // Carpeta donde se publica el sitio: la de la demo (BASE_DEMO) en el build de demo y en su vista
  // previa (vite preview --mode demo); la raíz del dominio en desarrollo y en producción. VITE_BASE
  // la reemplaza en cualquier modo. El router (basename) y las rutas de los archivos públicos la
  // siguen con import.meta.env.BASE_URL.
  const base = env.VITE_BASE?.trim() || (demo && (command === 'build' || isPreview) ? BASE_DEMO : '/')

  return {
    base,
    plugins: [react(), htaccess(base), ...(demo ? [] : [sinMediosDePrueba()])],
    // La demo siempre usa los datos locales, aunque el entorno tenga VITE_API_URL.
    define: demo ? { 'import.meta.env.VITE_API_URL': JSON.stringify('') } : {},
  }
})
