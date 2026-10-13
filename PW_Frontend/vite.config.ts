import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { esquemaNavegacion, sobre } from './src/api/esquemas'

// Modo de build que genera a propósito una versión con los datos de prueba (npm run build:demo).
const MODO_DEMO = 'demo'

// Carpeta donde se publica el portal (y antes, la demo): https://cata.edu.pe/PW/. Si se mueve a la raíz
// del dominio o a otra carpeta, cambiar este valor (con barra al principio y al final) y volver a
// compilar. También se puede indicar sin tocar el archivo: VITE_BASE=/otra/ npm run build
const BASE_PUBLICADA = '/PW/'

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

// Contrato 2.13: el menú, los grupos de Nosotros y los títulos llegan de GET /v1/navegacion. Para que una
// caída de la API no deje el sitio sin menú, se descarga al compilar (sin API, se toma el de los datos de
// prueba), se valida y entra en el paquete como valor inicial (virtual:navegacion-inicial); en el
// navegador se vuelve a pedir y reemplaza a este. Así ningún texto queda escrito a mano en el código.
//
// NAVEGACION_URL (opcional, sin prefijo VITE_: no entra al paquete) toma la navegación de otra API con el
// mismo contrato, por ejemplo una local, cuando la de producción todavía no responde al compilar. El
// paquete sigue leyendo VITE_API_URL en el navegador; solo cambia el valor inicial del menú.
const navegacionInicial = (apiUrl: string, desde = apiUrl): Plugin => {
  const ID = 'virtual:navegacion-inicial'
  // Convención de Vite para los módulos virtuales: el id resuelto empieza con el carácter nulo.
  const RESUELTO = `${String.fromCharCode(0)}${ID}`
  let raiz = ''
  let navegacion: unknown = null
  return {
    name: 'navegacion-inicial',
    configResolved(c) {
      raiz = c.root
    },
    async buildStart() {
      let cuerpo: unknown
      const origen = desde ? `${desde}/v1/navegacion` : 'src/api/mock/tipico/navegacion.json'
      try {
        if (desde) {
          const res = await fetch(origen, { headers: { Accept: 'application/json' } })
          if (!res.ok) throw new Error(`respondió ${res.status}`)
          cuerpo = await res.json()
        } else {
          cuerpo = JSON.parse(readFileSync(resolve(raiz, origen), 'utf8'))
        }
      } catch (e) {
        throw new Error(`No se pudo leer la navegación del sitio (${origen}): ${(e as Error).message}. Sin ella el sitio quedaría sin menú.`)
      }
      const r = sobre(esquemaNavegacion).safeParse(cuerpo)
      if (!r.success) {
        throw new Error(`La navegación de ${origen} no cumple el contrato: ${JSON.stringify(r.error.issues.slice(0, 3))}`)
      }
      navegacion = r.data.data
    },
    resolveId: (id) => (id === ID ? RESUELTO : null),
    load: (id) => (id === RESUELTO ? `export default ${JSON.stringify(navegacion)}` : null),
  }
}

const sinBarra = (url?: string) => (url ?? '').trim().replace(/\/+$/, '')

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

  // Carpeta donde se publica el sitio: BASE_PUBLICADA en los builds (producción y demo) y en su vista
  // previa; la raíz en desarrollo. VITE_BASE la reemplaza en cualquier modo. El router (basename) y las
  // rutas de los archivos públicos la siguen con import.meta.env.BASE_URL.
  const base = env.VITE_BASE?.trim() || (command === 'build' || isPreview ? BASE_PUBLICADA : '/')

  return {
    base,
    plugins: [react(), htaccess(base), navegacionInicial(demo ? '' : sinBarra(env.VITE_API_URL), demo ? '' : sinBarra(process.env.NAVEGACION_URL) || sinBarra(env.VITE_API_URL)), ...(demo ? [] : [sinMediosDePrueba()])],
    // La demo siempre usa los datos locales, aunque el entorno tenga VITE_API_URL.
    define: demo ? { 'import.meta.env.VITE_API_URL': JSON.stringify('') } : {},
  }
})
