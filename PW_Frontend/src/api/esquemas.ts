// Validación en tiempo de ejecución de cada respuesta, según docs/API_CONTRACT.md.
// Si la API cambia un tipo, la sección muestra su estado de error en vez de romper la página.
import { z } from 'zod'
import { SECCIONES } from './tipos'
import type * as T from './tipos'

const texto = z.string()
const textoONulo = z.string().nullable()
const url = z.string().url().regex(/^https:\/\//, 'Las URL deben ser https')

const fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha AAAA-MM-DD')
const fechaHora = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:\d{2})$/, 'Fecha y hora ISO 8601 con zona')

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

const enlace = z.object({ etiqueta: texto, url, externo: z.boolean() })

const destino = z.discriminatedUnion('tipo', [
  z.object({ tipo: z.literal('seccion'), seccion: z.enum(SECCIONES) }),
  z.object({ tipo: z.literal('pagina'), ruta: z.string().regex(/^\/[a-z0-9/-]*$/, 'Ruta interna: /pagina') }),
  z.object({ tipo: z.literal('url'), url, externo: z.boolean() }),
])

const parada = z.object({ id: texto, etiqueta: texto, detalle: textoONulo, destino })

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

const rutaBase = {
  nombre: texto,
  bajada: textoONulo,
  paradas: z.array(parada).min(1).max(4),
}

export const esquemaRutas = z.object({
  familias: z.object({
    ...rutaBase,
    accion: z.object({ etiqueta: texto, detalle: textoONulo, mensajeWhatsapp: texto }),
  }),
  comunidad: z.object({ ...rutaBase, terminal: parada.nullable() }),
})

export const esquemaHero = z.object({
  titulo: texto,
  bajada: textoONulo,
  figuras: z.array(z.object({ tipo: z.enum(['recorte', 'foto']), imagen })).max(3),
  accionPrincipal: z.object({ etiqueta: texto, destino }),
  accionSecundaria: z.object({ etiqueta: texto, destino }).nullable(),
})

export const esquemaCifras = z
  .array(z.object({ id: texto, valor: z.number().int().min(0), sufijo: textoONulo, etiqueta: texto }))
  .max(4)

export const esquemaAviso = z
  .object({
    id: texto,
    titulo: texto,
    texto: textoONulo,
    imagen: imagen.nullable(),
    enlace: enlace.nullable(),
    vigenteDesde: fechaHora,
    vigenteHasta: fechaHora.nullable(),
  })
  .nullable()

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

export const sobre = <S extends z.ZodTypeAny>(data: S) => z.object({ data })
export const sobrePaginado = <S extends z.ZodTypeAny>(data: S) => z.object({ data, meta: esquemaMeta })

// Garantía en compilación: los esquemas y los tipos del contrato describen lo mismo.
type Igual<A, B> = (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false
const coincide = <_ extends true>() => {}
coincide<Igual<z.infer<typeof esquemaSitio>, T.Sitio>>()
coincide<Igual<z.infer<typeof esquemaRutas>['comunidad']['terminal'], T.Parada | null>>()
coincide<Igual<z.infer<typeof esquemaAviso>, T.Aviso | null>>()
coincide<Igual<z.infer<typeof esquemaHero>, T.Hero>>()
coincide<Igual<z.infer<typeof esquemaCifras>, T.Cifra[]>>()
coincide<Igual<z.infer<typeof esquemaQuienesSomos>, T.QuienesSomos>>()
coincide<Igual<z.infer<typeof esquemaNiveles>, T.Niveles>>()
coincide<Igual<z.infer<typeof esquemaSedes>, T.Sede[]>>()
coincide<Igual<z.infer<typeof esquemaNoticias>, T.Noticia[]>>()
coincide<Igual<z.infer<typeof esquemaGrados>, T.GrupoGrados[]>>()
