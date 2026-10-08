// Franjas diagonales de camiseta entre dos secciones. Decorativas.
export default function Divisor({ fondo = 'blanco' }: { fondo?: 'blanco' | 'lavado' }) {
  return (
    <div className={`f-divisor f-divisor--${fondo}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  )
}
