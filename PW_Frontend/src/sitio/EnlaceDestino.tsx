import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Destino } from '../api/tipos'
import { hrefDestino } from '../lib/formato'

// Enlace a cualquier Destino del contrato: páginas internas con el router, URLs externas en otra pestaña.
export default function EnlaceDestino({
  destino,
  className,
  children,
}: {
  destino: Destino
  className?: string
  children: ReactNode
}) {
  const { href, externo } = hrefDestino(destino)
  if (destino.tipo === 'pagina') {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} className={className} {...(externo ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {children}
      {externo && <span className="visually-hidden"> (se abre en otra pestaña)</span>}
    </a>
  )
}
