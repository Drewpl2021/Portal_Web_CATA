// Mapa del sitio, igual al de la web actual (cata.edu.pe).
// Las rutas son estructura del portal y viven en el código; el contenido de cada página llega de la API.

export interface EnlaceMenu {
  etiqueta: string
  ruta: string
}

export interface GrupoMenu {
  titulo: string
  enlaces: EnlaceMenu[]
}

export interface ItemMenu {
  etiqueta: string
  ruta: string
  /** Solo Nosotros: se abre como mega menú en tres columnas. */
  grupos?: GrupoMenu[]
}

export const NOSOTROS: GrupoMenu[] = [
  {
    titulo: 'Institución',
    enlaces: [
      { etiqueta: 'Misión y Visión', ruta: '/nosotros/mision-y-vision' },
      { etiqueta: 'Reseña Histórica', ruta: '/nosotros/resena-historica' },
      { etiqueta: 'Emblema', ruta: '/nosotros/emblema' },
      { etiqueta: 'Himno', ruta: '/nosotros/himno' },
      { etiqueta: 'Consejo Directivo', ruta: '/nosotros/consejo-directivo' },
      { etiqueta: 'Administración', ruta: '/nosotros/administracion' },
      { etiqueta: 'Organigrama', ruta: '/nosotros/organigrama' },
    ],
  },
  {
    titulo: 'Gestión',
    enlaces: [
      { etiqueta: 'Procesos', ruta: '/nosotros/procesos' },
      { etiqueta: 'Planificación Anual', ruta: '/nosotros/planificacion-anual' },
      { etiqueta: 'Planes de Mejora', ruta: '/nosotros/planes-de-mejora' },
      { etiqueta: 'Evaluación Docente', ruta: '/nosotros/evaluacion-docente' },
      { etiqueta: 'Acreditación', ruta: '/nosotros/acreditacion' },
    ],
  },
  {
    titulo: 'Documentos',
    enlaces: [
      { etiqueta: 'Instrumentos de Gestión', ruta: '/nosotros/instrumentos-de-gestion' },
      { etiqueta: 'Manual de Identidad', ruta: '/nosotros/manual-de-identidad' },
      { etiqueta: 'Planificador Inteligente EVA', ruta: '/nosotros/planificador-eva' },
    ],
  },
]

export const MENU: ItemMenu[] = [
  { etiqueta: 'Inicio', ruta: '/' },
  { etiqueta: 'Proyectos', ruta: '/proyectos' },
  { etiqueta: 'Nosotros', ruta: '/nosotros', grupos: NOSOTROS },
  { etiqueta: 'Propuesta Educativa', ruta: '/propuesta-educativa' },
  { etiqueta: 'Matrícula', ruta: '/matricula' },
  { etiqueta: 'Logros', ruta: '/logros' },
  { etiqueta: 'Contacto', ruta: '/contacto' },
]

/** Una ruta está activa si es la misma o una subruta (Nosotros). Inicio solo coincide exacto. */
export const estaActiva = (ruta: string, actual: string, inicio = '/') =>
  ruta === '/' ? actual === inicio : actual === ruta || actual.startsWith(`${ruta}/`)

/** Título de una página a partir de su ruta relativa (sin la base de la propuesta). */
export function tituloDeRuta(ruta: string): string {
  const todos = [...MENU, ...NOSOTROS.flatMap((g) => g.enlaces)]
  return todos.find((e) => e.ruta === ruta)?.etiqueta ?? 'Página no encontrada'
}
