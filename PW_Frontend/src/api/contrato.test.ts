import { describe, expect, it } from 'vitest'
import {
  esquemaBanners,
  esquemaCifras,
  esquemaHero,
  esquemaGrados,
  esquemaNiveles,
  esquemaNoticias,
  esquemaQuienesSomos,
  esquemaSedes,
  esquemaSitio,
  sobre,
  sobrePaginado,
} from './esquemas'

const ESQUEMAS = {
  sitio: sobre(esquemaSitio),
  banners: sobre(esquemaBanners),
  'propuesta-cabecera': sobre(esquemaHero),
  cifras: sobre(esquemaCifras),
  'quienes-somos': sobre(esquemaQuienesSomos),
  niveles: sobre(esquemaNiveles),
  sedes: sobre(esquemaSedes),
  noticias: sobrePaginado(esquemaNoticias),
  grados: sobre(esquemaGrados),
} as const

const archivos = import.meta.glob<unknown>('./mock/*/*.json', { eager: true, import: 'default' })

describe('los datos de prueba cumplen docs/API_CONTRACT.md', () => {
  it('hay datos típicos para cada recurso', () => {
    for (const recurso of Object.keys(ESQUEMAS)) {
      expect(archivos[`./mock/tipico/${recurso}.json`], recurso).toBeDefined()
    }
  })

  for (const [ruta, cuerpo] of Object.entries(archivos)) {
    const recurso = ruta.split('/').pop()!.replace('.json', '') as keyof typeof ESQUEMAS
    it(ruta, () => {
      const esquema = ESQUEMAS[recurso]
      expect(esquema, `recurso desconocido: ${recurso}`).toBeDefined()
      const r = esquema.safeParse(cuerpo)
      expect(r.success ? [] : r.error.issues).toEqual([])
    })
  }

  it('los datos típicos no traen campos fuera del contrato', () => {
    const sinOmitir = sobre(esquemaSitio.strict())
    expect(sinOmitir.safeParse(archivos['./mock/tipico/sitio.json']).success).toBe(true)
  })

  it('el escenario alt-vacio no tiene ningún alt con texto', () => {
    const json = JSON.stringify(Object.entries(archivos).filter(([r]) => r.includes('/alt-vacio/')))
    expect(json).not.toMatch(/"alt":"[^"]/)
  })

  it('el escenario sin-foto no tiene imágenes', () => {
    const json = JSON.stringify(Object.entries(archivos).filter(([r]) => r.includes('/sin-foto/')))
    expect(json).not.toMatch(/"url":"https:\/\/medios/)
  })
})

describe('el contrato rechaza respuestas inválidas', () => {
  it('rechaza un campo opcional omitido en vez de null', () => {
    const { foto: _, ...sinFoto } = { id: '1', nombre: 'X', direccion: 'Y', referencia: null, distrito: null, telefono: null, nota: null, foto: null, mapaUrl: null }
    expect(esquemaSedes.safeParse([sinFoto]).success).toBe(false)
  })

  it('rechaza imágenes sin https', () => {
    const imagen = { url: 'http://x.pe/a.jpg', alt: '', ancho: null, alto: null }
    expect(esquemaQuienesSomos.safeParse({ titulo: 't', parrafos: ['p'], foto: imagen, simbolos: [] }).success).toBe(false)
  })

  it('rechaza fechas con otro formato', () => {
    const n = { id: '1', slug: 'a', tipo: 'noticia', titulo: 't', resumen: null, fecha: '08/10/2026', foto: null, enlace: null }
    expect(esquemaNoticias.safeParse([n]).success).toBe(false)
  })

  it('rechaza una sección de destino desconocida', () => {
    const cabecera = {
      titulo: 't',
      bajada: null,
      figuras: [],
      accionPrincipal: { etiqueta: 'e', destino: { tipo: 'seccion', seccion: 'eventos' } },
      accionSecundaria: null,
    }
    expect(esquemaHero.safeParse(cabecera).success).toBe(false)
  })

  it('rechaza un banner con punto focal fuera de 0–100 o sin alineación válida', () => {
    const imagen = { url: 'https://x.pe/a.jpg', alt: '', ancho: null, alto: null }
    const base = { id: '1', categoria: 'aviso', titulo: 't', fecha: null, imagen, imagenMovil: null, accion: null }
    expect(esquemaBanners.safeParse([{ ...base, puntoFocal: { x: 120, y: 50 }, alineacion: 'izquierda' }]).success).toBe(false)
    expect(esquemaBanners.safeParse([{ ...base, puntoFocal: null, alineacion: 'centro' }]).success).toBe(false)
    expect(esquemaBanners.safeParse([{ ...base, puntoFocal: null, alineacion: 'derecha' }]).success).toBe(true)
  })
})
