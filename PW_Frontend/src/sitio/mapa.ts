// Mapa del sitio (contrato 2.13, GET /v1/navegacion).
// Las rutas son estructura del portal y viven en el código; los nombres del menú, los grupos de Nosotros
// y los títulos de cada página llegan de la API, como el resto del contenido.
import { useMemo } from 'react'
import navegacionInicial from 'virtual:navegacion-inicial'
import { obtenerNavegacion } from '../api/servicios'
import type { Navegacion, PaginaMenu, TitulosPaginas } from '../api/tipos'
import { useRecurso } from '../hooks/useRecurso'

export interface EnlaceMenu {
  etiqueta: string
  ruta: string
}

export interface GrupoMenu {
  id: string
  titulo: string
  enlaces: EnlaceMenu[]
}

export interface ItemMenu {
  pagina: PaginaMenu
  etiqueta: string
  ruta: string
  /** Solo Nosotros, y solo si tiene grupos: se abre como mega menú. */
  grupos?: GrupoMenu[]
}

/** La ruta de cada página del menú: el contrato solo dice qué página es. */
export const RUTAS: Record<PaginaMenu, string> = {
  inicio: '/',
  proyectos: '/proyectos',
  nosotros: '/nosotros',
  'propuesta-educativa': '/propuesta-educativa',
  matricula: '/matricula',
  logros: '/logros',
  contacto: '/contacto',
}

export const rutaDeSubpagina = (slug: string) => `/nosotros/${slug}`

export interface Mapa {
  menu: ItemMenu[]
  nosotros: GrupoMenu[]
  pie: Navegacion['pie']
  titulos: TitulosPaginas
  /** El nombre de una página en el menú; vacío si el colegio la sacó del menú. */
  etiquetaDe: (pagina: PaginaMenu) => string
  /** false mientras la navegación de la compilación espera la del navegador: aún puede cambiar. */
  definitivo: boolean
}

export function armarMapa(n: Navegacion, definitivo: boolean): Mapa {
  const nosotros: GrupoMenu[] = n.nosotros.map((g) => ({
    id: g.id,
    titulo: g.titulo,
    enlaces: g.paginas.map((p) => ({ etiqueta: p.etiqueta, ruta: rutaDeSubpagina(p.slug) })),
  }))
  const menu: ItemMenu[] = n.menu.map((m) => ({
    pagina: m.pagina,
    etiqueta: m.etiqueta,
    ruta: RUTAS[m.pagina],
    ...(m.pagina === 'nosotros' && nosotros.length > 0 ? { grupos: nosotros } : {}),
  }))
  return {
    menu,
    nosotros,
    pie: n.pie,
    titulos: n.titulos,
    etiquetaDe: (pagina) => n.menu.find((m) => m.pagina === pagina)?.etiqueta ?? '',
    definitivo,
  }
}

const INICIAL = armarMapa(navegacionInicial, false)

/**
 * El mapa del sitio. Empieza con la navegación que se descargó al compilar (así el menú nunca falta,
 * aunque la API no responda) y la reemplaza por la del navegador en cuanto llega: un cambio hecho en
 * el panel se ve sin volver a compilar.
 */
export function useMapa(): Mapa {
  const r = useRecurso('navegacion', obtenerNavegacion)
  const datos = r.estado === 'listo' ? r.datos : null
  const terminado = r.estado !== 'cargando'
  return useMemo(() => (datos ? armarMapa(datos, true) : terminado ? { ...INICIAL, definitivo: true } : INICIAL), [datos, terminado])
}

/** Una ruta está activa si es la misma o una subruta (Nosotros). Inicio solo coincide exacto. */
export const estaActiva = (ruta: string, actual: string, inicio = '/') =>
  ruta === '/' ? actual === inicio : actual === ruta || actual.startsWith(`${ruta}/`)

/** El número de sedes en letras, para los títulos con {n}: «Cuatro sedes en San Román». */
const NUMEROS = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho']

export function conNumero(plantilla: string, n: number): string {
  const palabra = NUMEROS[n] ?? String(n)
  return plantilla.replace(/\{n\}/g, (_, posicion: number) =>
    posicion === 0 ? palabra.charAt(0).toUpperCase() + palabra.slice(1) : palabra,
  )
}
