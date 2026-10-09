import { useSearchParams } from 'react-router-dom'
import type { Proyectos } from '../../api/tipos'
import { Revelar } from '../movimiento'
import TarjetaProyecto from './TarjetaProyecto'

const contar = (n: number) => (n === 1 ? '1 proyecto' : `${n} proyectos`)

// Lista de proyectos con filtro por categoría. La categoría elegida vive en la URL (?categoria=…),
// así se puede compartir y el botón Atrás la respeta. El cambio de filtro no se anima: es una acción frecuente.
export default function ListaProyectos({ datos }: { datos: Proyectos }) {
  const [parametros, setParametros] = useSearchParams()
  const nombreDe = (id: string) => datos.categorias.find((c) => c.id === id)?.nombre ?? null

  // Solo se ofrecen categorías con proyectos; una categoría desconocida en la URL equivale a «Todos».
  const usadas = datos.categorias.filter((c) => datos.proyectos.some((p) => p.categoria === c.id))
  const pedida = parametros.get('categoria')
  const activa = usadas.some((c) => c.id === pedida) ? pedida : null
  const visibles = activa ? datos.proyectos.filter((p) => p.categoria === activa) : datos.proyectos

  const elegir = (id: string | null) => {
    const siguiente = new URLSearchParams(parametros)
    if (id) siguiente.set('categoria', id)
    else siguiente.delete('categoria')
    setParametros(siguiente, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      {usadas.length > 1 && (
        <div className="f-filtro">
          <p className="f-filtro__etiqueta" id="f-filtro-etiqueta">
            Filtrar por categoría
          </p>
          <ul className="f-filtro__lista" aria-labelledby="f-filtro-etiqueta">
            <li>
              <button type="button" className="f-filtro__boton" aria-pressed={activa === null} onClick={() => elegir(null)}>
                Todos <span className="f-filtro__n">{datos.proyectos.length}</span>
              </button>
            </li>
            {usadas.map((c) => (
              <li key={c.id}>
                <button type="button" className="f-filtro__boton" aria-pressed={activa === c.id} onClick={() => elegir(c.id)}>
                  {c.nombre}{' '}
                  <span className="f-filtro__n">{datos.proyectos.filter((p) => p.categoria === c.id).length}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="f-filtro__resultado" aria-live="polite">
        {activa ? `${contar(visibles.length)} en ${nombreDe(activa)}` : contar(visibles.length)}
      </p>
      <Revelar como="ul" efecto="escalonado" className="f-proyectos__lista">
        {visibles.map((p, i) => (
          <TarjetaProyecto key={p.id} proyecto={p} categoria={nombreDe(p.categoria)} i={i} />
        ))}
      </Revelar>
    </>
  )
}
