import type { Destino, Sede, Telefono } from '../api/tipos'

export const enlaceTel = (t: Telefono) => `tel:${t.numero}`

export const enlaceWhatsapp = (t: Telefono, mensaje?: string) =>
  `https://wa.me/${t.numero.replace(/\D/g, '')}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`

export const enlaceMapa = (s: Pick<Sede, 'mapaUrl' | 'direccion' | 'distrito'>) =>
  s.mapaUrl ??
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([s.direccion, s.distrito].filter(Boolean).join(', '))}`

export function hrefDestino(d: Destino): { href: string; externo: boolean } {
  if (d.tipo === 'seccion') return { href: `#${d.seccion}`, externo: false }
  if (d.tipo === 'pagina') return { href: d.ruta, externo: false }
  return { href: d.url, externo: d.externo }
}

export const atributosExterno = (externo: boolean) => (externo ? { target: '_blank', rel: 'noreferrer' } : {})

const formatoFecha = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** "2026-10-08" → "8 de octubre de 2026". */
export const fechaLegible = (fecha: string) => formatoFecha.format(new Date(`${fecha}T00:00:00Z`))

export const rellenarPlantilla = (plantilla: string, valores: Record<string, string>) =>
  plantilla.replace(/\{(\w+)\}/g, (_, k: string) => valores[k] ?? '')

const formatoDiaMes = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', timeZone: 'UTC' })
const aFecha = (f: string) => new Date(`${f}T00:00:00Z`)

/** "2026-11-02", "2026-12-18" → "Del 2 de noviembre al 18 de diciembre de 2026". Sin fin, la fecha sola. */
export function rangoLegible(inicio: string, fin: string | null) {
  if (!fin || fin === inicio) return fechaLegible(inicio)
  const mismoAnio = inicio.slice(0, 4) === fin.slice(0, 4)
  const desde = mismoAnio ? formatoDiaMes.format(aFecha(inicio)) : fechaLegible(inicio)
  return `Del ${desde} al ${fechaLegible(fin)}`
}

/** Partes para el bloque de fecha: día, mes abreviado y año. */
export function partesFecha(f: string) {
  const d = aFecha(f)
  const mes = new Intl.DateTimeFormat('es-PE', { month: 'short', timeZone: 'UTC' }).format(d).replace('.', '')
  return { dia: d.getUTCDate(), mes, anio: d.getUTCFullYear() }
}

/** Compara un periodo con la fecha de hoy (en la hora de Lima). */
export function etapaDe(inicio: string, fin: string | null, hoy = new Date()): 'pasada' | 'en-curso' | 'proxima' {
  const local = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(hoy)
  if (local < inicio) return 'proxima'
  if (local > (fin ?? inicio)) return 'pasada'
  return 'en-curso'
}

const formatoKB = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 })
const formatoMB = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 1 })

/** 850000 → "830 KB"; 1250000 → "1,2 MB". */
export function pesoLegible(bytes: number) {
  if (bytes < 1024 * 1024) return `${formatoKB.format(Math.max(1, bytes / 1024))} KB`
  return `${formatoMB.format(bytes / (1024 * 1024))} MB`
}
