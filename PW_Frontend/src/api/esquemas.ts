// Validación en tiempo de ejecución de cada respuesta, según docs/API_CONTRACT.md.
// Si la API cambia un tipo, la sección muestra su estado de error en vez de romper la página.
import { z } from 'zod'
import { CATEGORIAS_BANNER, ESTADOS_PROYECTO, ESTADOS_VACANTE, FORMATOS_ENLACE, PAGINAS_SOLICITUD, REDES, SECCIONES, TIPOS_AUDIO } from './tipos'
import type * as T from './tipos'

const texto = z.string()
const textoONulo = z.string().nullable()
const url = z.string().url().regex(/^https:\/\//, 'Las URL deben ser https')

const fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha AAAA-MM-DD')
const imagen = z.object({
  url,
  alt: z.string(),
  ancho: z.number().int().positive().nullable(),
  alto: z.number().int().positive().nullable(),
})

const telefono = z.object({
  numero: z.string().regex(/^\+\d{8,15}$/, 'Teléfono E.164'),
  visible: texto,
})

const correo = z.string().email('Correo electrónico')

// Solo se insertan mapas de Google Maps u OpenStreetMap
const mapaEmbed = url.regex(
  /^https:\/\/(www\.google\.com\/maps(\/embed)?\?|www\.openstreetmap\.org\/export\/embed\.html\?)/,
  'Mapa de Google Maps u OpenStreetMap',
)

const enlace = z.object({ etiqueta: texto, url, externo: z.boolean() })

const destino = z.discriminatedUnion('tipo', [
  z.object({ tipo: z.literal('seccion'), seccion: z.enum(SECCIONES) }),
  z.object({ tipo: z.literal('pagina'), ruta: z.string().regex(/^\/[a-z0-9/-]*$/, 'Ruta interna: /pagina') }),
  z.object({ tipo: z.literal('url'), url, externo: z.boolean() }),
])

export const esquemaSitio = z.object({
  nombre: texto,
  nombreCorto: texto,
  subtitulo: textoONulo,
  ciudad: texto,
  anioFundacion: z.number().int(),
  telefono,
  whatsapp: telefono,
  direccion: z.object({ linea: texto, referencia: textoONulo, distrito: textoONulo }),
  portalAcademicoUrl: url.nullable(),
  promotora: textoONulo,
})

const accion = z.object({ etiqueta: texto, destino })

export const esquemaBanners = z
  .array(
    z.object({
      id: texto,
      categoria: z.enum(CATEGORIAS_BANNER),
      titulo: texto,
      fecha: fecha.nullable(),
      imagen,
      imagenMovil: imagen.nullable(),
      puntoFocal: z.object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100) }).nullable(),
      alineacion: z.enum(['izquierda', 'derecha']),
      accion: accion.nullable(),
    }),
  )
  .max(8)

export const esquemaHero = z.object({
  titulo: texto,
  bajada: textoONulo,
  figuras: z.array(z.object({ tipo: z.enum(['recorte', 'foto']), imagen })).max(3),
  accionPrincipal: accion,
  accionSecundaria: accion.nullable(),
})

export const esquemaCifras = z
  .array(z.object({ id: texto, valor: z.number().int().min(0), sufijo: textoONulo, etiqueta: texto }))
  .max(4)

export const esquemaQuienesSomos = z.object({
  titulo: texto,
  parrafos: z.array(texto).min(1).max(6),
  foto: imagen.nullable(),
  simbolos: z.array(z.object({ nombre: texto, significado: texto })).max(8),
})

export const esquemaNiveles = z.object({
  titulo: texto,
  propuestaUrl: url.nullable(),
  items: z
    .array(
      z.object({
        id: texto,
        nombre: texto,
        rango: textoONulo,
        sede: textoONulo,
        reconocimiento: textoONulo,
        foto: imagen.nullable(),
      }),
    )
    .max(4),
})

export const esquemaSedes = z
  .array(
    z.object({
      id: texto,
      nombre: texto,
      direccion: texto,
      referencia: textoONulo,
      distrito: textoONulo,
      telefono: telefono.nullable(),
      nota: textoONulo,
      foto: imagen.nullable(),
      mapaUrl: url.nullable(),
      correo: correo.nullable(),
      horario: z.array(z.object({ dias: texto, horas: texto })).max(4),
      mapaEmbedUrl: mapaEmbed.nullable(),
    }),
  )
  .max(8)

const noticia = z.object({
  id: texto,
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug: a-z, 0-9 y -'),
  tipo: z.enum(['noticia', 'comunicado']),
  titulo: texto,
  resumen: textoONulo,
  fecha,
  foto: imagen.nullable(),
  enlace: enlace.nullable(),
})

export const esquemaMeta = z.object({
  pagina: z.number().int().min(1),
  limite: z.number().int().min(1).max(24),
  total: z.number().int().min(0),
})

export const esquemaNoticias = z.array(noticia)

export const esquemaGrados = z.array(z.object({ nivel: texto, opciones: z.array(texto).min(1).max(8) }))

// Matrícula
export const esquemaCabeceraMatricula = z.object({
  titulo: texto,
  bajada: textoONulo,
  anio: z.number().int().min(2000).max(2100).nullable(),
  figura: imagen.nullable(),
})

export const esquemaProcesos = z
  .array(
    z.object({
      id: texto,
      nombre: texto,
      resumen: textoONulo,
      listas: z.array(z.object({ titulo: texto, items: z.array(texto).min(1).max(15) })).max(4),
      pasos: z.array(z.object({ titulo: texto, detalle: textoONulo })).max(8),
    }),
  )
  .max(4)

export const esquemaVacantes = z.object({
  actualizado: fecha.nullable(),
  nota: textoONulo,
  niveles: z
    .array(
      z.object({
        id: texto,
        nivel: texto,
        detalle: textoONulo,
        estado: z.enum(ESTADOS_VACANTE),
        vacantes: z.number().int().min(0).nullable(),
      }),
    )
    .max(6),
})

export const esquemaFechasMatricula = z.object({
  nota: textoONulo,
  items: z
    .array(z.object({ id: texto, titulo: texto, inicio: fecha, fin: fecha.nullable(), detalle: textoONulo }))
    .max(12),
})

export const esquemaPreguntas = z.array(z.object({ id: texto, pregunta: texto, respuesta: texto })).max(15)

export const esquemaSolicitud = z.object({
  titulo: texto,
  texto: textoONulo,
  mensajeWhatsapp: z.string().min(1),
  mensajesPorPagina: z
    .array(z.object({ pagina: z.enum(PAGINAS_SOLICITUD), mensaje: z.string().min(1) }))
    .max(PAGINAS_SOLICITUD.length)
    .refine((l) => new Set(l.map((m) => m.pagina)).size === l.length, 'Un solo mensaje por página'),
})

// Proyectos
const slug = z.string().regex(/^[a-z0-9-]+$/, 'slug: a-z, 0-9 y -')

const proyectoResumen = z.object({
  id: texto,
  slug,
  titulo: texto,
  lema: textoONulo,
  resumen: texto,
  categoria: texto,
  niveles: z.array(texto).max(6),
  estado: z.enum(ESTADOS_PROYECTO).nullable(),
  fecha: fecha.nullable(),
  foto: imagen.nullable(),
})

export const esquemaProyectos = z
  .object({
    titulo: texto,
    bajada: textoONulo,
    categorias: z.array(z.object({ id: texto, nombre: texto })).max(8),
    proyectos: z.array(proyectoResumen).max(24),
  })
  .refine(
    (d) => d.proyectos.every((p) => d.categorias.some((c) => c.id === p.categoria)),
    'Cada proyecto debe usar una categoría de la lista',
  )

export const esquemaProyecto = proyectoResumen.extend({
  categoriaNombre: texto,
  descripcion: z.array(texto).min(1).max(6),
  secciones: z
    .array(
      z.object({
        titulo: texto,
        tipo: z.enum(['lista', 'numerada']),
        items: z.array(z.object({ titulo: textoONulo, texto })).min(1).max(12),
      }),
    )
    .max(8),
  galeria: z.array(imagen).max(12),
})

export const esquemaContacto = z.object({
  titulo: texto,
  bajada: textoONulo,
  figura: imagen.nullable(),
  correo: correo.nullable(),
  redes: z.array(z.object({ red: z.enum(REDES), cuenta: texto, url })).max(6),
})

// Nosotros
export const esquemaNosotros = z.object({
  titulo: texto,
  bajada: textoONulo,
  paginas: z.array(z.object({ slug, resumen: texto })).max(20),
})

const firma = z.object({ nombre: texto, detalle: textoONulo })

// El organigrama es un árbol; se limita a 5 niveles y 12 hijos por cargo.
const nodoOrganigrama = (nivel: number): z.ZodType<T.NodoOrganigrama> =>
  z.object({
    cargo: texto,
    detalle: textoONulo,
    hijos: nivel >= 5 ? z.array(z.never()).max(0) : z.array(z.lazy(() => nodoOrganigrama(nivel + 1))).max(12),
  }) as z.ZodType<T.NodoOrganigrama>

const bloque = z.discriminatedUnion('tipo', [
  z.object({ tipo: z.literal('texto'), titulo: textoONulo, parrafos: z.array(texto).min(1).max(20), firma: firma.nullable() }),
  z.object({ tipo: z.literal('destacado'), rotulo: texto, texto }),
  z.object({
    tipo: z.literal('lista'),
    titulo: textoONulo,
    estilo: z.enum(['vinetas', 'tarjetas']),
    items: z.array(z.object({ titulo: textoONulo, texto, fuente: textoONulo })).min(1).max(20),
  }),
  z.object({ tipo: z.literal('hitos'), titulo: textoONulo, items: z.array(z.object({ fecha: texto, texto })).min(1).max(20) }),
  z.object({ tipo: z.literal('imagen'), imagen, pie: textoONulo, transcripcion: z.array(texto).min(1).max(20).nullable() }),
  z.object({
    tipo: z.literal('personas'),
    titulo: textoONulo,
    personas: z.array(z.object({ id: texto, nombre: texto, cargo: texto, foto: imagen.nullable() })).min(1).max(40),
  }),
  z.object({ tipo: z.literal('mensaje'), titulo: textoONulo, parrafos: z.array(texto).min(1).max(12), firma, foto: imagen.nullable() }),
  z.object({
    tipo: z.literal('letra'),
    titulo: textoONulo,
    partes: z.array(z.object({ titulo: texto, versos: z.array(texto).min(1).max(16) })).min(1).max(12),
  }),
  z.object({ tipo: z.literal('audio'), titulo: texto, url, formato: z.enum(TIPOS_AUDIO), descripcion: textoONulo }),
  z.object({ tipo: z.literal('organigrama'), titulo: textoONulo, imagen: imagen.nullable(), enlace: enlace.nullable(), raiz: nodoOrganigrama(1) }),
  z.object({
    tipo: z.literal('enlaces'),
    titulo: textoONulo,
    enlaces: z.array(z.object({ etiqueta: texto, url, descripcion: textoONulo, formato: z.enum(FORMATOS_ENLACE) })).min(1).max(30),
  }),
])

export const esquemaPaginaContenido = z.object({
  slug,
  titulo: texto,
  bajada: textoONulo,
  bloques: z.array(bloque).max(30),
})

export const sobre = <S extends z.ZodTypeAny>(data: S) => z.object({ data })
export const sobrePaginado = <S extends z.ZodTypeAny>(data: S) => z.object({ data, meta: esquemaMeta })

// Garantía en compilación: los esquemas y los tipos del contrato describen lo mismo.
type Igual<A, B> = (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false
const coincide = <_ extends true>() => {}
coincide<Igual<z.infer<typeof esquemaSitio>, T.Sitio>>()
coincide<Igual<z.infer<typeof esquemaBanners>, T.Banner[]>>()
coincide<Igual<z.infer<typeof esquemaHero>, T.Hero>>()
coincide<Igual<z.infer<typeof esquemaCifras>, T.Cifra[]>>()
coincide<Igual<z.infer<typeof esquemaQuienesSomos>, T.QuienesSomos>>()
coincide<Igual<z.infer<typeof esquemaNiveles>, T.Niveles>>()
coincide<Igual<z.infer<typeof esquemaSedes>, T.Sede[]>>()
coincide<Igual<z.infer<typeof esquemaNoticias>, T.Noticia[]>>()
coincide<Igual<z.infer<typeof esquemaGrados>, T.GrupoGrados[]>>()
coincide<Igual<z.infer<typeof esquemaCabeceraMatricula>, T.CabeceraMatricula>>()
coincide<Igual<z.infer<typeof esquemaProcesos>, T.ProcesoMatricula[]>>()
coincide<Igual<z.infer<typeof esquemaVacantes>, T.Vacantes>>()
coincide<Igual<z.infer<typeof esquemaFechasMatricula>, T.FechasMatricula>>()
coincide<Igual<z.infer<typeof esquemaPreguntas>, T.PreguntaFrecuente[]>>()
coincide<Igual<z.infer<typeof esquemaSolicitud>, T.SolicitudInformacion>>()
coincide<Igual<z.infer<typeof esquemaContacto>, T.Contacto>>()
coincide<Igual<z.infer<typeof esquemaProyectos>, T.Proyectos>>()
coincide<Igual<z.infer<typeof esquemaProyecto>, T.Proyecto>>()
coincide<Igual<z.infer<typeof esquemaNosotros>, T.Nosotros>>()
coincide<Igual<z.infer<typeof esquemaPaginaContenido>, T.PaginaContenido>>()
