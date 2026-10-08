import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { obtenerNiveles } from '../../api/servicios'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import Imagen from '../../components/Imagen'
import { useRecurso } from '../../hooks/useRecurso'
import { Revelar } from '../movimiento'

// Niveles como carriles de pista: placas inclinadas que se alternan entre marino y blanco
// sobre el campo celeste, y entran desde la izquierda una tras otra.
export default function NivelesFinal() {
  const r = useRecurso('niveles', obtenerNiveles)

  return (
    <section className="f-seccion f-niveles" aria-labelledby="f-niveles-titulo">
      <div className="f-seccion__interior">
        {r.estado === 'cargando' && <Cargando que="los niveles" lineas={4} className="f-cargando--claro" />}
        {r.estado === 'error' && (
          <>
            <h2 className="f-titulo f-titulo--blanco" id="f-niveles-titulo">
              Niveles
            </h2>
            <ErrorCarga que="los niveles" reintentar={r.reintentar} className="f-error--claro" />
          </>
        )}
        {r.estado === 'listo' && (
          <>
            <div className="f-seccion__cabeza">
              <h2 className="f-titulo f-titulo--blanco" id="f-niveles-titulo">
                <Revelar como="span" efecto="titulo" className="f-barrido">
                  {r.datos.titulo}
                </Revelar>
              </h2>
              {r.datos.propuestaUrl && (
                <a className="f-enlace f-enlace--blanco" href={r.datos.propuestaUrl} target="_blank" rel="noreferrer">
                  Ver la propuesta educativa <ArrowUpRight size={20} aria-hidden="true" />
                  <span className="visually-hidden"> (se abre en otra pestaña)</span>
                </a>
              )}
            </div>
            {r.datos.items.length === 0 ? (
              <p className="f-vacio f-vacio--claro">La información de los niveles se publicará pronto.</p>
            ) : (
              <Revelar como="ul" efecto="carriles" className="f-carriles">
                {r.datos.items.map((n, i) => (
                  <li
                    key={n.id}
                    className={`f-carril f-carril--${i % 2 === 0 ? 'marino' : 'blanco'}${n.foto ? ' f-carril--foto' : ''}`}
                    style={{ '--i': i } as CSSProperties}
                  >
                    <h3 className="f-carril__nombre">{n.nombre}</h3>
                    <div className="f-carril__datos">
                      {n.rango && <p className="f-carril__rango">{n.rango}</p>}
                      {(n.sede || n.reconocimiento) && (
                        <p className="f-carril__detalle">
                          {n.sede}
                          {n.sede && n.reconocimiento && <br />}
                          {n.reconocimiento}
                        </p>
                      )}
                    </div>
                    <Imagen imagen={n.foto} proporcion="3 / 2" className="f-carril__foto" sizes="(min-width: 900px) 22vw, 90vw" />
                  </li>
                ))}
              </Revelar>
            )}
          </>
        )}
      </div>
    </section>
  )
}
