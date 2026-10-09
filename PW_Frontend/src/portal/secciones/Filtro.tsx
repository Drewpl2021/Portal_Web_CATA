import { useId } from 'react'
import { useSearchParams } from 'react-router-dom'

export interface OpcionFiltro {
  id: string
  nombre: string
  /** Cuántos elementos tiene la opción. */
  n: number
}

/**
 * Opción elegida de un filtro, guardada en la dirección (?{parametro}=id): se puede compartir
 * y el botón Atrás la respeta. Un id que no está entre las opciones equivale a «Todos».
 */
export function useFiltroUrl(parametro: string, opciones: OpcionFiltro[]) {
  const [parametros, setParametros] = useSearchParams()
  const pedida = parametros.get(parametro)
  const activa = opciones.some((o) => o.id === pedida) ? pedida : null

  const elegir = (id: string | null) => {
    const siguiente = new URLSearchParams(parametros)
    if (id) siguiente.set(parametro, id)
    else siguiente.delete(parametro)
    setParametros(siguiente, { replace: true, preventScrollReset: true })
  }
  return { activa, elegir }
}

/**
 * Botones de filtro con el total de cada opción y un texto vivo con el resultado.
 * Con una sola opción no se muestran los botones. El cambio no se anima: es una acción frecuente.
 */
export default function Filtro({
  etiqueta,
  opciones,
  activa,
  alElegir,
  total,
  resultado,
}: {
  etiqueta: string
  opciones: OpcionFiltro[]
  activa: string | null
  alElegir: (id: string | null) => void
  total: number
  /** Texto del resultado, que se anuncia al cambiar: «2 proyectos en Tecnología». Sin él, no se muestra (p. ej. con dos filtros y un solo resultado). */
  resultado?: string
}) {
  const id = useId()
  return (
    <>
      {opciones.length > 1 && (
        <div className="f-filtro">
          <p className="f-filtro__etiqueta" id={id}>
            {etiqueta}
          </p>
          <ul className="f-filtro__lista" aria-labelledby={id}>
            <li>
              <button type="button" className="f-filtro__boton" aria-pressed={activa === null} onClick={() => alElegir(null)}>
                Todos <span className="f-filtro__n">{total}</span>
              </button>
            </li>
            {opciones.map((o) => (
              <li key={o.id}>
                <button type="button" className="f-filtro__boton" aria-pressed={activa === o.id} onClick={() => alElegir(o.id)}>
                  {o.nombre} <span className="f-filtro__n">{o.n}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {resultado !== undefined && (
        <p className="f-filtro__resultado" aria-live="polite">
          {resultado}
        </p>
      )}
    </>
  )
}
