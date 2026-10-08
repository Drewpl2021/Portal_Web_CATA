import { ArrowUpRight } from 'lucide-react'
import { obtenerNiveles } from '../api/servicios'
import { Cargando, ErrorCarga } from '../components/EstadoSeccion'
import Imagen from '../components/Imagen'
import { useRecurso } from '../hooks/useRecurso'

export default function Niveles() {
  const r = useRecurso('niveles', obtenerNiveles)

  return (
    <section className="seccion niveles" id="niveles" aria-labelledby="niveles-titulo" aria-busy={r.estado === 'cargando'}>
      <div className="niveles__interior">
        {r.estado === 'cargando' && <Cargando que="los niveles" lineas={4} />}
        {r.estado === 'error' && (
          <>
            <h2 className="titulo-rotulo" id="niveles-titulo">
              Niveles
            </h2>
            <ErrorCarga que="los niveles" reintentar={r.reintentar} />
          </>
        )}
        {r.estado === 'listo' && (
          <>
            <div className="niveles__cabeza">
              <h2 className="titulo-rotulo" id="niveles-titulo">
                {r.datos.titulo}
              </h2>
              {r.datos.propuestaUrl && (
                <a className="enlace-flecha" href={r.datos.propuestaUrl} target="_blank" rel="noreferrer">
                  Ver la propuesta educativa <ArrowUpRight size={18} aria-hidden="true" />
                  <span className="visually-hidden"> (se abre en otra pestaña)</span>
                </a>
              )}
            </div>

            {r.datos.items.length === 0 ? (
              <p className="vacio">La información de los niveles se publicará pronto.</p>
            ) : (
              <ol className="hitos">
                {r.datos.items.map((n) => (
                  <li className={`hitos__parada${n.foto ? ' hitos__parada--con-foto' : ''}`} key={n.id}>
                    <span className="hitos__punto" aria-hidden="true" />
                    <h3 className="hitos__anio">{n.nombre}</h3>
                    {n.rango && <p className="hitos__nombre">{n.rango}</p>}
                    {(n.sede || n.reconocimiento) && (
                      <p className="hitos__texto">
                        {n.sede}
                        {n.sede && n.reconocimiento && <br />}
                        {n.reconocimiento}
                      </p>
                    )}
                    <Imagen imagen={n.foto} proporcion="3 / 2" className="hitos__foto" sizes="(min-width: 760px) 30vw, 100vw" />
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
      </div>
    </section>
  )
}
