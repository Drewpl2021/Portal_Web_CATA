import type { CSSProperties, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Parada } from '../api/tipos'
import { atributosExterno, hrefDestino } from '../lib/formato'

interface Props {
  id: string
  tono: 'claro' | 'emblema'
  nombre: string
  bajada: string | null
  paradas: Parada[]
  terminal: ReactNode
  children?: ReactNode
}

// Una placa de ruta: nombre enorme, bajada y la línea con sus paradas.
export default function RoutePlate({ id, tono, nombre, bajada, paradas, terminal, children }: Props) {
  return (
    <section className={`placa placa--${tono}`} aria-labelledby={`${id}-nombre`}>
      <div className="placa__marco">
        <div className="placa__cabeza">
          <h2 className="placa__nombre" id={`${id}-nombre`}>
            {nombre}
          </h2>
          {bajada && <p className="placa__bajada">{bajada}</p>}
        </div>

        <ol className="ruta" aria-label={`Paradas de ${nombre}`}>
          {paradas.map((p, i) => (
            <li className="ruta__parada" key={p.id} style={{ '--i': i } as CSSProperties}>
              <EnlaceParada parada={p} />
            </li>
          ))}
          {terminal && (
            <li className="ruta__parada ruta__parada--terminal" style={{ '--i': paradas.length } as CSSProperties}>
              {terminal}
            </li>
          )}
        </ol>

        {children}
      </div>
    </section>
  )
}

export function EnlaceParada({ parada, terminal = false }: { parada: Parada; terminal?: boolean }) {
  const { href, externo } = hrefDestino(parada.destino)
  return (
    <a className="ruta__enlace" href={href} {...atributosExterno(externo)}>
      <span className={`ruta__punto${terminal ? ' ruta__punto--terminal' : ''}`} aria-hidden="true" />
      <span className="ruta__etiqueta">
        {parada.etiqueta}
        {externo && <ArrowUpRight className="ruta__externo" size={18} strokeWidth={2.5} aria-hidden="true" />}
      </span>
      {(parada.detalle || externo) && (
        <span className="ruta__detalle">
          {parada.detalle}
          {externo && <span className="visually-hidden"> (se abre en otra pestaña)</span>}
        </span>
      )}
    </a>
  )
}
