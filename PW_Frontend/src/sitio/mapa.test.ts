import { describe, expect, it } from 'vitest'
import { esquemaNavegacion } from '../api/esquemas'
import type { Navegacion } from '../api/tipos'
import { gradoParaMensaje } from '../lib/formato'
import navegacionTipica from '../api/mock/tipico/navegacion.json'
import { armarMapa, conNumero } from './mapa'

const tipica = (navegacionTipica as { data: Navegacion }).data

describe('mapa del sitio (GET /v1/navegacion)', () => {
  it('pone la ruta de cada página y el mega menú solo en Nosotros', () => {
    const mapa = armarMapa(tipica, true)
    expect(mapa.menu.map((m) => m.ruta)).toEqual(['/', '/proyectos', '/nosotros', '/propuesta-educativa', '/matricula', '/logros', '/contacto'])
    expect(mapa.menu.filter((m) => m.grupos).map((m) => m.pagina)).toEqual(['nosotros'])
    expect(mapa.nosotros[0]!.enlaces[0]).toEqual({ etiqueta: 'Misión y Visión', ruta: '/nosotros/mision-y-vision' })
  })

  it('sin grupos, Nosotros es un enlace simple; una página fuera del menú no tiene etiqueta', () => {
    const mapa = armarMapa({ ...tipica, nosotros: [], menu: tipica.menu.filter((m) => m.pagina !== 'logros') }, true)
    expect(mapa.menu.find((m) => m.pagina === 'nosotros')!.grupos).toBeUndefined()
    expect(mapa.etiquetaDe('logros')).toBe('')
    expect(mapa.etiquetaDe('contacto')).toBe('Contacto')
  })

  it('escribe el número de sedes en letras, con mayúscula solo al principio', () => {
    expect(conNumero('{n} sedes en San Román', 4)).toBe('Cuatro sedes en San Román')
    expect(conNumero('Nuestras {n} sedes', 2)).toBe('Nuestras dos sedes')
    expect(conNumero('{n} sedes', 12)).toBe('12 sedes')
  })

  it('rechaza un menú o unos grupos que el portal no sabría mostrar', () => {
    const con = (cambio: Partial<Navegacion>) => esquemaNavegacion.safeParse({ ...tipica, ...cambio }).success
    expect(con({})).toBe(true)
    expect(con({ menu: [] })).toBe(false)
    expect(con({ menu: [tipica.menu[0]!, tipica.menu[0]!] })).toBe(false)
    expect(con({ menu: [{ pagina: 'blog' as never, etiqueta: 'Blog' }] })).toBe(false)
    const grupo = tipica.nosotros[0]!
    expect(con({ nosotros: [grupo, { ...tipica.nosotros[1]!, paginas: [grupo.paginas[0]!] }] })).toBe(false)
    expect(con({ nosotros: [{ ...grupo, paginas: [] }] })).toBe(false)
    const trece = Array.from({ length: 13 }, (_, i) => ({ slug: `p-${i}`, etiqueta: `P ${i}` }))
    expect(con({ nosotros: [{ ...grupo, paginas: trece }] })).toBe(false)
    const cinco = Array.from({ length: 5 }, (_, i) => ({ id: `g-${i}`, titulo: `G ${i}`, paginas: [{ slug: `s-${i}`, etiqueta: 'S' }] }))
    expect(con({ nosotros: cinco })).toBe(false)
  })
})

describe('grados del formulario', () => {
  it('cada opción va con su nivel entre paréntesis, sin armar una frase con «de»', () => {
    expect(gradoParaMensaje('1.er grado', 'Primaria')).toBe('1.er grado (Primaria)')
    expect(gradoParaMensaje('Música', 'Talleres')).toBe('Música (Talleres)')
  })
})
