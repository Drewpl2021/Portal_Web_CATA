import { describe, expect, it } from 'vitest'
import { REDES } from '../api/tipos'
import { MARCAS } from './redes'

const luminancia = (hex: string) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}
const contraste = (a: string, b: string) => {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m)
  return (x! + 0.05) / (y! + 0.05)
}

describe('placas de las redes sociales', () => {
  it('hay nombre, color e icono para cada red del contrato', () => {
    expect(Object.keys(MARCAS).sort()).toEqual([...REDES].sort())
  })

  // WCAG 1.4.3 y 1.4.11: icono y nombre blancos sobre el color de la marca, 4.5:1 o más.
  for (const red of REDES) {
    it(`${red}: el blanco sobre su color llega a 4.5:1`, () => {
      expect(contraste(MARCAS[red].color, '#ffffff')).toBeGreaterThanOrEqual(4.5)
    })
  }
})
