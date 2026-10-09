// Genera los PDF para imprimir (A4) de los documentos que se entregan fuera del equipo:
// la solicitud al colegio y el contrato de la API. Uso: npm run pdf (desde PW_Frontend/).
// Salida: docs/pdf/. Regenerar después de cambiar cualquiera de los .md.
//
// Usa el Chromium de Playwright. Si no está instalado: npx playwright install chromium.
// Para usar otro Chrome: CHROME_EXE=/ruta/a/chrome npm run pdf
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'
import { chromium } from 'playwright'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const docs = path.join(raiz, 'docs')
const salida = path.join(docs, 'pdf')

const DOCUMENTOS = [
  { md: 'SOLICITUD_AL_COLEGIO.md', titulo: 'Solicitud al Colegio Adventista Túpac Amaru' },
  { md: 'API_CONTRACT.md', titulo: 'Contrato de la API del portal CATA' },
]

// La tipografía del portal, incrustada para que el PDF no dependa de archivos externos.
const archivo = fs.readFileSync(path.join(raiz, 'PW_Frontend/node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2'))
const fuente = `data:font/woff2;base64,${archivo.toString('base64')}`

const escapar = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const pagina = (titulo, cuerpo) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${escapar(titulo)}</title>
<style>
@font-face { font-family: 'Archivo'; src: url('${fuente}') format('woff2'); font-weight: 100 900; }
@page { size: A4; margin: 18mm 16mm 20mm; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: 'Archivo', 'Segoe UI', 'Segoe UI Symbol', sans-serif; font-size: 10pt; line-height: 1.45; color: #212853; margin: 0; }
h1 { font-size: 20pt; font-weight: 850; margin: 0 0 6pt; padding-bottom: 6pt; border-bottom: 2.5pt solid #ffbd59; }
h2 { font-size: 14pt; font-weight: 800; margin: 18pt 0 6pt; break-after: avoid; }
h3 { font-size: 11.5pt; font-weight: 750; margin: 12pt 0 4pt; color: #0077ab; break-after: avoid; }
h4 { font-size: 10.5pt; margin: 10pt 0 4pt; break-after: avoid; }
p, li { orphans: 3; widows: 3; }
p { margin: 0 0 6pt; }
ul, ol { margin: 0 0 6pt; padding-left: 16pt; }
a { color: #0077ab; text-decoration: none; }
hr { border: 0; border-top: 0.75pt solid #c8cbe0; margin: 14pt 0; }
table { width: 100%; border-collapse: collapse; margin: 4pt 0 10pt; font-size: 8.8pt; }
thead { display: table-header-group; } /* el encabezado se repite si la tabla sigue en otra página */
tr { break-inside: avoid; }
th, td { border: 0.6pt solid #c8cbe0; padding: 3.5pt 5pt; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
th { background: #e6f4fb; font-weight: 750; overflow-wrap: normal; }
code { font-family: Consolas, 'Cascadia Mono', monospace; font-size: 8.4pt; background: #f2f3f8; padding: 0 2pt; border-radius: 2pt; overflow-wrap: anywhere; }
pre { background: #f2f3f8; border-left: 2.5pt solid #0090cd; padding: 6pt 8pt; font-size: 7.8pt; line-height: 1.35; white-space: pre-wrap; overflow-wrap: anywhere; }
pre code { background: none; padding: 0; font-size: inherit; }
strong { font-weight: 750; }
blockquote { margin: 0 0 8pt; padding: 4pt 10pt; border-left: 2.5pt solid #ffbd59; background: #fff8ec; }
</style></head><body>${cuerpo}</body></html>`

const pie = (titulo) =>
  `<div style="width:100%;font-family:Segoe UI,sans-serif;font-size:7.5pt;color:#4a5180;padding:0 16mm;display:flex;justify-content:space-between"><span>${escapar(titulo)}</span><span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span></div>`

fs.mkdirSync(salida, { recursive: true })
const navegador = await chromium.launch(process.env.CHROME_EXE ? { executablePath: process.env.CHROME_EXE } : {})
try {
  for (const { md, titulo: base } of DOCUMENTOS) {
    const texto = fs.readFileSync(path.join(docs, md), 'utf8')
    // El contrato lleva su versión en el pie, tomada del propio documento.
    const version = texto.match(/\*\*Versión del contrato:\*\* ([\d.]+)/)?.[1]
    const titulo = version ? `${base} · v${version}` : base
    const p = await navegador.newPage()
    // breaks: los saltos de línea simples del .md (por ejemplo «Para / De / Fecha») se respetan.
    await p.setContent(pagina(titulo, marked.parse(texto, { gfm: true, breaks: true })), { waitUntil: 'load' })
    await p.evaluate(() => document.fonts.ready)
    const destino = path.join(salida, md.replace(/\.md$/, '.pdf'))
    await p.pdf({
      path: destino,
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: pie(titulo),
    })
    await p.close()
    console.log(`${path.relative(raiz, destino)} actualizado`)
  }
} finally {
  await navegador.close()
}
