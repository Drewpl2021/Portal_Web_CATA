import type { Destino, Sede, Telefono } from '../api/tipos'

export const enlaceTel = (t: Telefono) => `tel:${t.numero}`

export const enlaceWhatsapp = (t: Telefono, mensaje?: string) =>
  `https://wa.me/${t.numero.replace(/\D/g, '')}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`

export const enlaceMapa = (s: Pick<Sede, 'mapaUrl' | 'direccion' | 'distrito'>) =>
  s.mapaUrl ??
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([s.direccion, s.distrito].filter(Boolean).join(', '))}`

export function hrefDestino(d: Destino): { href: string; externo: boolean } {
  return d.tipo === 'seccion' ? { href: `#${d.seccion}`, externo: false } : { href: d.url, externo: d.externo }
}

export const atributosExterno = (externo: boolean) => (externo ? { target: '_blank', rel: 'noreferrer' } : {})

const formatoFecha = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** "2026-10-08" → "8 de octubre de 2026". */
export const fechaLegible = (fecha: string) => formatoFecha.format(new Date(`${fecha}T00:00:00Z`))

export const rellenarPlantilla = (plantilla: string, valores: Record<string, string>) =>
  plantilla.replace(/\{(\w+)\}/g, (_, k: string) => valores[k] ?? '')
