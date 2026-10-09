import { describe, expect, it } from 'vitest'
import {
  esquemaBanners,
  esquemaCabeceraMatricula,
  esquemaFechasMatricula,
  esquemaPreguntas,
  esquemaProcesos,
  esquemaSolicitud,
  esquemaVacantes,
  esquemaCifras,
  esquemaContacto,
  esquemaDocentes,
  esquemaHero,
  esquemaGrados,
  esquemaNiveles,
  esquemaNoticias,
  esquemaNosotros,
  esquemaPaginaContenido,
  esquemaProyecto,
  esquemaProyectos,
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
  'matricula-cabecera': sobre(esquemaCabeceraMatricula),
  'matricula-procesos': sobre(esquemaProcesos),
  'matricula-vacantes': sobre(esquemaVacantes),
  'matricula-fechas': sobre(esquemaFechasMatricula),
  'matricula-preguntas': sobre(esquemaPreguntas),
  solicitud: sobre(esquemaSolicitud),
  contacto: sobre(esquemaContacto),
  proyectos: sobre(esquemaProyectos),
  proyecto: sobre(esquemaProyecto),
  nosotros: sobre(esquemaNosotros),
  'nosotros-pagina': sobre(esquemaPaginaContenido),
  docentes: sobre(esquemaDocentes),
} as const

const archivos = import.meta.glob<unknown>('./mock/*/*.json', { eager: true, import: 'default' })

describe('los datos de prueba cumplen docs/API_CONTRACT.md', () => {
  it('hay datos típicos para cada recurso', () => {
    for (const recurso of Object.keys(ESQUEMAS).filter((x) => x !== 'proyecto' && x !== 'nosotros-pagina')) {
      expect(archivos[`./mock/tipico/${recurso}.json`], recurso).toBeDefined()
    }
  })

  for (const [ruta, cuerpo] of Object.entries(archivos)) {
    const recurso = ruta.split('/').pop()!.replace('.json', '').split('--')[0] as keyof typeof ESQUEMAS
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
  it('solo acepta mapas insertados de Google Maps u OpenStreetMap', () => {
    const sede = { id: '1', nombre: 'X', direccion: 'Y', referencia: null, distrito: null, telefono: null, nota: null, foto: null, mapaUrl: null, correo: null, horario: [] }
    expect(esquemaSedes.safeParse([{ ...sede, mapaEmbedUrl: 'https://evil.example/maps?q=x' }]).success).toBe(false)
    expect(esquemaSedes.safeParse([{ ...sede, mapaEmbedUrl: 'https://www.google.com/maps/embed?pb=abc' }]).success).toBe(true)
    expect(esquemaSedes.safeParse([{ ...sede, mapaEmbedUrl: null, correo: 'no-es-correo' }]).success).toBe(false)
  })

  it('cada proyecto de la lista tiene su detalle en el mismo escenario o en típico', () => {
    for (const [ruta, cuerpo] of Object.entries(archivos).filter(([r]) => r.endsWith('/proyectos.json'))) {
      const escenario = ruta.split('/')[2]
      for (const p of (cuerpo as { data: { proyectos: { slug: string }[] } }).data.proyectos) {
        const detalle = archivos[`./mock/${escenario}/proyecto--${p.slug}.json`] ?? archivos[`./mock/tipico/proyecto--${p.slug}.json`]
        expect(detalle, `${escenario}: ${p.slug}`).toBeDefined()
      }
    }
  })

  it('rechaza un proyecto con una categoría que no está en la lista', () => {
    const p = { id: '1', slug: 'a', titulo: 't', lema: null, resumen: 'r', categoria: 'otra', niveles: [], estado: null, fecha: null, foto: null }
    expect(esquemaProyectos.safeParse({ titulo: 't', bajada: null, categorias: [{ id: 'tec', nombre: 'Tecnología' }], proyectos: [p] }).success).toBe(false)
  })

  it('rechaza dos mensajes de WhatsApp para la misma página', () => {
    const base = { titulo: 't', texto: null, mensajeWhatsapp: 'm' }
    const m = { pagina: 'contacto', mensaje: 'x' }
    expect(esquemaSolicitud.safeParse({ ...base, mensajesPorPagina: [m, m] }).success).toBe(false)
    expect(esquemaSolicitud.safeParse({ ...base, mensajesPorPagina: [m] }).success).toBe(true)
  })

  it('hay una página típica para cada subpágina de Nosotros', () => {
    for (const slug of ['mision-y-vision', 'resena-historica', 'emblema', 'himno', 'consejo-directivo', 'administracion', 'personal-docente', 'organigrama', 'procesos', 'planificacion-anual', 'planes-de-mejora', 'evaluacion-docente', 'acreditacion', 'instrumentos-de-gestion', 'manual-de-identidad', 'planificador-eva']) {
      expect(archivos[`./mock/tipico/nosotros-pagina--${slug}.json`], slug).toBeDefined()
    }
  })

  it('rechaza un bloque de tipo desconocido y un audio que no es de un formato admitido', () => {
    const pagina = { slug: 'x', titulo: 't', bajada: null }
    expect(esquemaPaginaContenido.safeParse({ ...pagina, bloques: [{ tipo: 'video', url: 'https://x.pe/v.mp4' }] }).success).toBe(false)
    const audio = { tipo: 'audio', titulo: 'Himno', url: 'https://x.pe/h.mp3', descripcion: null }
    expect(esquemaPaginaContenido.safeParse({ ...pagina, bloques: [{ ...audio, formato: 'audio/midi' }] }).success).toBe(false)
    expect(esquemaPaginaContenido.safeParse({ ...pagina, bloques: [{ ...audio, formato: 'audio/mpeg' }] }).success).toBe(true)
  })

  it('limita la profundidad del organigrama', () => {
    const hoja = (n: number): unknown => ({ cargo: `Nivel ${n}`, detalle: null, hijos: n < 7 ? [hoja(n + 1)] : [] })
    const bloque = { tipo: 'organigrama', titulo: null, imagen: null, enlace: null }
    expect(esquemaPaginaContenido.safeParse({ slug: 'o', titulo: 't', bajada: null, bloques: [{ ...bloque, raiz: hoja(1) }] }).success).toBe(false)
  })

  it('rechaza un docente con un nivel que no está en la lista y un peso de archivo no positivo', () => {
    const d = { id: '1', nombre: 'n', cargo: 'c', nivel: 'otro', foto: null }
    expect(esquemaDocentes.safeParse({ niveles: [{ id: 'inicial', nombre: 'Inicial' }], docentes: [d] }).success).toBe(false)
    const enlace = { etiqueta: 'e', url: 'https://x.pe/a.pdf', descripcion: null, formato: 'pdf' }
    const pagina = (peso: unknown) => ({ slug: 'x', titulo: 't', bajada: null, bloques: [{ tipo: 'enlaces', titulo: null, enlaces: [{ ...enlace, peso }] }] })
    expect(esquemaPaginaContenido.safeParse(pagina(0)).success).toBe(false)
    expect(esquemaPaginaContenido.safeParse(pagina(1_250_000)).success).toBe(true)
  })

  it('rechaza una red social desconocida', () => {
    const contacto = { titulo: 't', bajada: null, figura: null, correo: null }
    expect(esquemaContacto.safeParse({ ...contacto, redes: [{ red: 'myspace', cuenta: 'c', url: 'https://x.pe' }] }).success).toBe(false)
  })

  it('rechaza un estado de vacante desconocido', () => {
    const nivel = { id: 'i', nivel: 'Inicial', detalle: null, vacantes: null }
    expect(esquemaVacantes.safeParse({ actualizado: null, nota: null, niveles: [{ ...nivel, estado: 'abierta' }] }).success).toBe(false)
    expect(esquemaVacantes.safeParse({ actualizado: null, nota: null, niveles: [{ ...nivel, estado: 'consultar' }] }).success).toBe(true)
  })

  it('rechaza una lista de requisitos vacía', () => {
    const proceso = { id: 'n', nombre: 'Nuevos', resumen: null, pasos: [], listas: [{ titulo: 'Requisitos', items: [] }] }
    expect(esquemaProcesos.safeParse([proceso]).success).toBe(false)
  })

  it('rechaza un campo opcional omitido en vez de null', () => {
    const { foto: _, ...sinFoto } = { id: '1', nombre: 'X', direccion: 'Y', referencia: null, distrito: null, telefono: null, nota: null, foto: null, mapaUrl: null, correo: null, horario: [], mapaEmbedUrl: null }
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
