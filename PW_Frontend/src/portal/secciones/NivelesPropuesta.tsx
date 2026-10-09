import type { CSSProperties } from 'react'
import { Check } from 'lucide-react'
import { obtenerNivelesPropuesta } from '../../api/servicios'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import Imagen from '../../components/Imagen'
import { useRecurso } from '../../hooks/useRecurso'
import { Revelar } from '../movimiento'

// Niveles en detalle con los carriles de Inicio: nombre, descripción, rasgos, talleres y foto.
export default function NivelesPropuesta() {
  const r = useRecurso('propuesta-niveles', obtenerNivelesPropuesta)

  return (
    <section className="f-seccion f-niveles f-niveles-propuesta" id="niveles" aria-labelledby="f-niveles-propuesta-titulo">
      <div className="f-seccion__interior">
        <h2 className="f-titulo f-titulo--blanco" id="f-niveles-propuesta-titulo">
          <Revelar como="span" efecto="titulo" className="f-barrido">
            Por niveles
          </Revelar>
        </h2>
        {r.estado === 'cargando' && <Cargando que="los niveles" lineas={4} conTitulo={false} className="f-cargando--claro" />}
        {r.estado === 'error' && <ErrorCarga que="los niveles" reintentar={r.reintentar} className="f-error--claro" />}
        {r.estado === 'listo' && r.datos.length === 0 && (
          <p className="f-vacio f-vacio--claro">La propuesta de cada nivel se publicará pronto.</p>
        )}
        {r.estado === 'listo' && r.datos.length > 0 && (
          <Revelar como="ul" efecto="carriles" className="f-carriles">
            {r.datos.map((n, i) => (
              <li
                key={n.id}
                className={`f-carril f-carril--detalle f-carril--${i % 2 === 0 ? 'marino' : 'blanco'}${n.foto ? ' f-carril--foto' : ''}`}
                style={{ '--i': i } as CSSProperties}
              >
                <div>
                  <h3 className="f-carril__nombre">{n.nombre}</h3>
                  {n.rango && <p className="f-carril__rango f-carril__rango--bajo">{n.rango}</p>}
                </div>
                <div className="f-carril__datos f-carril__datos--detalle">
                  {n.descripcion.map((p, j) => (
                    <p key={j} className="f-carril__detalle">
                      {p}
                    </p>
                  ))}
                  {n.rasgos.length > 0 && (
                    <ul className="f-meta" aria-label={`Rasgos de ${n.nombre}`}>
                      {n.rasgos.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  )}
                  {n.talleres.length > 0 && (
                    <>
                      <h4 className="f-carril__subtitulo">Talleres</h4>
                      <ul className="f-carril__talleres">
                        {n.talleres.map((t) => (
                          <li key={t.titulo}>
                            <Check size={16} strokeWidth={3} aria-hidden="true" />
                            <span>
                              <strong>{t.titulo}</strong>
                              {t.texto && <>: {t.texto}</>}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                <Imagen imagen={n.foto} proporcion="3 / 2" className="f-carril__foto" sizes="(min-width: 900px) 22vw, 90vw" />
              </li>
            ))}
          </Revelar>
        )}
      </div>
    </section>
  )
}
