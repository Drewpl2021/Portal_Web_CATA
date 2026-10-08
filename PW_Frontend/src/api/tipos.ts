// Tipos del contrato de la API pública del portal (docs/API_CONTRACT.md, v1.0).
// Todos los campos llegan siempre; los opcionales valen null.

/** Fecha ISO 8601 sin hora: "2026-10-08". */
export type Fecha = string
/** Fecha y hora ISO 8601 con zona: "2026-10-08T07:30:00-05:00". */
export type FechaHora = string

export interface Imagen {
  /** URL absoluta https. */
  url: string
  /** Texto alternativo. "" = decorativa. */
  alt: string
  ancho: number | null
  alto: number | null
}

export interface Telefono {
  /** E.164: "+5151325096". */
  numero: string
  /** Como se lee: "051 325096". */
  visible: string
}

export interface Enlace {
  etiqueta: string
  url: string
  externo: boolean
}

export const SECCIONES = ['quienes-somos', 'niveles', 'sedes', 'noticias', 'contacto'] as const
export type Seccion = (typeof SECCIONES)[number]

export type Destino =
  | { tipo: 'seccion'; seccion: Seccion }
  | { tipo: 'pagina'; ruta: string }
  | { tipo: 'url'; url: string; externo: boolean }

export interface Direccion {
  linea: string
  referencia: string | null
  distrito: string | null
}

// GET /v1/sitio
export interface Sitio {
  nombre: string
  nombreCorto: string
  subtitulo: string | null
  ciudad: string
  anioFundacion: number
  telefono: Telefono
  whatsapp: Telefono
  direccion: Direccion
  portalAcademicoUrl: string | null
  promotora: string | null
}

// GET /v1/portada/rutas
export interface Parada {
  id: string
  etiqueta: string
  detalle: string | null
  destino: Destino
}

export interface RutaBase {
  nombre: string
  bajada: string | null
  paradas: Parada[]
}

export interface AccionSolicitud {
  etiqueta: string
  detalle: string | null
  /** Plantilla con {nombre} y {grado}. */
  mensajeWhatsapp: string
}

export interface RutaFamilias extends RutaBase {
  accion: AccionSolicitud
}

export interface RutaComunidad extends RutaBase {
  terminal: Parada | null
}

export interface Rutas {
  familias: RutaFamilias
  comunidad: RutaComunidad
}

// GET /v1/portada/hero
export interface FiguraHero {
  /** recorte: PNG con fondo transparente (persona u objeto). foto: imagen rectangular. */
  tipo: 'recorte' | 'foto'
  imagen: Imagen
}

export interface AccionHero {
  etiqueta: string
  destino: Destino
}

export interface Hero {
  titulo: string
  bajada: string | null
  figuras: FiguraHero[]
  accionPrincipal: AccionHero
  accionSecundaria: AccionHero | null
}

// GET /v1/avisos/vigente
export interface Aviso {
  id: string
  titulo: string
  texto: string | null
  imagen: Imagen | null
  enlace: Enlace | null
  vigenteDesde: FechaHora
  vigenteHasta: FechaHora | null
}

// GET /v1/quienes-somos
export interface Simbolo {
  nombre: string
  significado: string
}

export interface QuienesSomos {
  titulo: string
  parrafos: string[]
  foto: Imagen | null
  simbolos: Simbolo[]
}

// GET /v1/niveles
export interface Nivel {
  id: string
  nombre: string
  rango: string | null
  sede: string | null
  reconocimiento: string | null
  foto: Imagen | null
}

export interface Niveles {
  titulo: string
  propuestaUrl: string | null
  items: Nivel[]
}

// GET /v1/sedes
export interface Sede {
  id: string
  nombre: string
  direccion: string
  referencia: string | null
  distrito: string | null
  telefono: Telefono | null
  nota: string | null
  foto: Imagen | null
  mapaUrl: string | null
}

// GET /v1/noticias
export interface Noticia {
  id: string
  slug: string
  tipo: 'noticia' | 'comunicado'
  titulo: string
  resumen: string | null
  fecha: Fecha
  foto: Imagen | null
  enlace: Enlace | null
}

export interface MetaPaginacion {
  pagina: number
  limite: number
  total: number
}

export interface ListaNoticias {
  noticias: Noticia[]
  meta: MetaPaginacion
}

// GET /v1/grados
export interface GrupoGrados {
  nivel: string
  opciones: string[]
}

// Sobres de respuesta
export interface Respuesta<T> {
  data: T
}

export interface RespuestaPaginada<T> {
  data: T[]
  meta: MetaPaginacion
}

export interface RespuestaError {
  error: { codigo: string; mensaje: string }
}
