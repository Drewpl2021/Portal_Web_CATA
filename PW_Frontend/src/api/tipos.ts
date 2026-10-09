// Tipos del contrato de la API pública del portal (docs/API_CONTRACT.md, v2.5).
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

// GET /v1/portada/banners
export const CATEGORIAS_BANNER = ['aviso', 'matricula', 'evento', 'noticia'] as const
export type CategoriaBanner = (typeof CATEGORIAS_BANNER)[number]

export interface Banner {
  id: string
  categoria: CategoriaBanner
  titulo: string
  fecha: Fecha | null
  /** Imagen de escritorio, apaisada (≈ 1900 × 700). */
  imagen: Imagen
  /** Imagen vertical opcional para móvil (4:5). Sin ella, se recorta la de escritorio en el punto focal. */
  imagenMovil: Imagen | null
  /** Punto focal en porcentaje (0–100) para recortar la imagen de escritorio. */
  puntoFocal: { x: number; y: number } | null
  /** Lado donde va el texto, para no tapar el texto propio de un afiche. */
  alineacion: 'izquierda' | 'derecha'
  accion: AccionHero | null
}

// GET /v1/propuesta-educativa/cabecera
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

// GET /v1/portada/cifras
export interface Cifra {
  id: string
  /** Número entero que se anima al entrar en pantalla. */
  valor: number
  /** Signo opcional tras el número: "+", "%". */
  sufijo: string | null
  etiqueta: string
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
  /** Enlace «Cómo llegar». null = el portal busca la dirección en Google Maps. */
  mapaUrl: string | null
  correo: string | null
  /** Horario de atención, una fila por grupo de días. [] = no se muestra. */
  horario: HorarioAtencion[]
  /** URL para insertar el mapa (Google Maps «Insertar un mapa» u OpenStreetMap). null = sin mapa. */
  mapaEmbedUrl: string | null
}

export interface HorarioAtencion {
  /** "Lunes a viernes". */
  dias: string
  /** "8:00 a 13:00". */
  horas: string
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

// GET /v1/matricula/cabecera
export interface CabeceraMatricula {
  titulo: string
  bajada: string | null
  /** Año escolar del proceso. Lo define el colegio; el portal no lo calcula. null = no se muestra. */
  anio: number | null
  /** Recorte de estudiante (PNG con fondo transparente). null = cabecera solo con texto. */
  figura: Imagen | null
}

// GET /v1/matricula/procesos
export interface ListaRequisitos {
  titulo: string
  items: string[]
}

export interface PasoMatricula {
  titulo: string
  detalle: string | null
}

export interface ProcesoMatricula {
  id: string
  /** Para quién es: "Estudiantes nuevos". */
  nombre: string
  resumen: string | null
  listas: ListaRequisitos[]
  pasos: PasoMatricula[]
}

// GET /v1/matricula/vacantes
export const ESTADOS_VACANTE = ['disponible', 'pocas', 'agotadas', 'consultar'] as const
export type EstadoVacante = (typeof ESTADOS_VACANTE)[number]

export interface VacantesNivel {
  id: string
  nivel: string
  detalle: string | null
  estado: EstadoVacante
  /** Número de vacantes, si el colegio decide publicarlo. */
  vacantes: number | null
}

export interface Vacantes {
  actualizado: Fecha | null
  nota: string | null
  niveles: VacantesNivel[]
}

// GET /v1/matricula/fechas
export interface FechaMatricula {
  id: string
  titulo: string
  inicio: Fecha
  /** null = un solo día. */
  fin: Fecha | null
  detalle: string | null
}

export interface FechasMatricula {
  nota: string | null
  items: FechaMatricula[]
}

// GET /v1/matricula/preguntas
export interface PreguntaFrecuente {
  id: string
  pregunta: string
  respuesta: string
}

// GET /v1/solicitud (Matrícula y Contacto)
/** Páginas que muestran el formulario «Solicitar información». */
export const PAGINAS_SOLICITUD = ['matricula', 'contacto'] as const
export type PaginaSolicitud = (typeof PAGINAS_SOLICITUD)[number]

export interface MensajePagina {
  pagina: PaginaSolicitud
  /** Plantilla del mensaje de WhatsApp en esa página. Usa {nombre} y {grado}. */
  mensaje: string
}

export interface SolicitudInformacion {
  titulo: string
  texto: string | null
  /** Plantilla general: se usa en las páginas sin mensaje propio. Usa {nombre} y {grado}. */
  mensajeWhatsapp: string
  /** Un mensaje por página, como máximo uno para cada una. */
  mensajesPorPagina: MensajePagina[]
}

// GET /v1/contacto
export const REDES = ['facebook', 'youtube', 'tiktok', 'instagram', 'x', 'linkedin'] as const
export type Red = (typeof REDES)[number]

export interface RedSocial {
  red: Red
  /** Nombre de la cuenta como se ve en la red: "Colegio CATA". */
  cuenta: string
  url: string
}

export interface Contacto {
  titulo: string
  bajada: string | null
  /** Recorte de estudiante para la cabecera. */
  figura: Imagen | null
  /** Correo general del colegio. */
  correo: string | null
  redes: RedSocial[]
}

// GET /v1/proyectos y GET /v1/proyectos/{slug}
export const ESTADOS_PROYECTO = ['en-curso', 'proximo', 'finalizado'] as const
export type EstadoProyecto = (typeof ESTADOS_PROYECTO)[number]

export interface CategoriaProyecto {
  id: string
  nombre: string
}

export interface ProyectoResumen {
  id: string
  /** Parte de la URL del detalle: /proyectos/{slug}. */
  slug: string
  titulo: string
  /** Frase corta del proyecto: «Cocinamos con propósito». */
  lema: string | null
  resumen: string
  /** id de una de las categorías de la lista. */
  categoria: string
  /** Niveles o grados que participan: «Primaria», «Secundaria». [] = no se indica. */
  niveles: string[]
  estado: EstadoProyecto | null
  /** Fecha de inicio o de realización. */
  fecha: Fecha | null
  foto: Imagen | null
}

export interface Proyectos {
  titulo: string
  bajada: string | null
  categorias: CategoriaProyecto[]
  proyectos: ProyectoResumen[]
}

export interface SeccionProyecto {
  titulo: string
  /** lista: viñetas. numerada: placas numeradas, cada una con título opcional. */
  tipo: 'lista' | 'numerada'
  items: { titulo: string | null; texto: string }[]
}

export interface Proyecto extends ProyectoResumen {
  /** Nombre de la categoría, para no depender de la lista. */
  categoriaNombre: string
  descripcion: string[]
  secciones: SeccionProyecto[]
  galeria: Imagen[]
}

// GET /v1/nosotros
export interface ResumenSubpagina {
  /** Slug de la subpágina: «mision-y-vision». */
  slug: string
  resumen: string
}

export interface Nosotros {
  titulo: string
  bajada: string | null
  /** Una frase por subpágina, para las tarjetas del índice. Las que no estén solo muestran su nombre. */
  paginas: ResumenSubpagina[]
}

// GET /v1/nosotros/paginas/{slug}: página de contenido armada con bloques
export interface Firma {
  nombre: string
  /** Cargo o descripción: «Exprofesor del CATA». */
  detalle: string | null
}

export interface Persona {
  id: string
  nombre: string
  cargo: string
  foto: Imagen | null
}

export interface NodoOrganigrama {
  cargo: string
  /** Nombre de quien ocupa el cargo u otra aclaración. */
  detalle: string | null
  hijos: NodoOrganigrama[]
}

export const FORMATOS_ENLACE = ['pdf', 'web', 'hoja', 'presentacion', 'documento', 'canva'] as const
export type FormatoEnlace = (typeof FORMATOS_ENLACE)[number]

export const TIPOS_AUDIO = ['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav'] as const
export type TipoAudio = (typeof TIPOS_AUDIO)[number]

export type Bloque =
  | { tipo: 'texto'; titulo: string | null; parrafos: string[]; firma: Firma | null }
  | { tipo: 'destacado'; rotulo: string; texto: string }
  | {
      tipo: 'lista'
      titulo: string | null
      /** vinetas: lista simple. tarjetas: placas con título, texto y fuente. */
      estilo: 'vinetas' | 'tarjetas'
      items: { titulo: string | null; texto: string; fuente: string | null }[]
    }
  | { tipo: 'hitos'; titulo: string | null; items: { fecha: string; texto: string }[] }
  | { tipo: 'imagen'; imagen: Imagen; pie: string | null; transcripcion: string[] | null }
  | { tipo: 'personas'; titulo: string | null; personas: Persona[] }
  | { tipo: 'mensaje'; titulo: string | null; parrafos: string[]; firma: Firma; foto: Imagen | null }
  | { tipo: 'letra'; titulo: string | null; partes: { titulo: string; versos: string[] }[] }
  | { tipo: 'audio'; titulo: string; url: string; formato: TipoAudio; descripcion: string | null }
  | { tipo: 'organigrama'; titulo: string | null; imagen: Imagen | null; enlace: Enlace | null; raiz: NodoOrganigrama }
  | {
      tipo: 'enlaces'
      titulo: string | null
      /** peso: tamaño del archivo en bytes, para los que se descargan. null = página o diseño en línea. */
      enlaces: { etiqueta: string; url: string; descripcion: string | null; formato: FormatoEnlace; peso: number | null }[]
    }

export type TipoBloque = Bloque['tipo']

export interface PaginaContenido {
  slug: string
  titulo: string
  bajada: string | null
  bloques: Bloque[]
}

// GET /v1/docentes
export interface NivelDocente {
  id: string
  nombre: string
}

export interface Docente {
  id: string
  nombre: string
  /** Cargo o área: «Tutora de 3 años», «Matemática». */
  cargo: string
  /** id de uno de los niveles. */
  nivel: string
  foto: Imagen | null
}

export interface Docentes {
  niveles: NivelDocente[]
  docentes: Docente[]
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
