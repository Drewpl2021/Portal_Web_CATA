import type { CSSProperties } from 'react'
import { obtenerPilares } from '../../api/servicios'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import { Revelar } from '../movimiento'
import { FranjaCifras } from './Cifras'

// Cifras de la propuesta: la franja marina de Inicio. Si no hay cifras o fallan, no aparece.
export function CifrasPropuesta() {
  const r = useRecurso('propuesta-pilares', obtenerPilares)
  if (r.estado !== 'listo' || r.datos.cifras.length === 0) return null
  return <FranjaCifras cifras={r.datos.cifras} etiqueta="La propuesta en cifras" />
}

// Introducción y los pilares, como las placas marinas de Misión y Visión, con sus aspectos en etiquetas.
export default function PilaresPropuesta() {
  const r = useRecurso('propuesta-pilares', obtenerPilares)

  return (
    <section className="f-seccion f-pilares" id="pilares" aria-labelledby="f-pilares-titulo">
      <div className="f-seccion__interior">
        <h2 className="f-titulo" id="f-pilares-titulo">
          <Revelar como="span" efecto="titulo" className="f-barrido">
            Nuestros pilares
          </Revelar>
        </h2>
        {r.estado === 'cargando' && <Cargando que="los pilares" lineas={4} conTitulo={false} />}
        {r.estado === 'error' && <ErrorCarga que="los pilares" reintentar={r.reintentar} />}
        {r.estado === 'listo' && (
          <div className="f-pilares__cuerpo">
            {r.datos.introduccion && (
              <div className="f-prosa">
                <h3 className="f-subtitulo f-pilares__intro">{r.datos.introduccion.titulo}</h3>
                {r.datos.introduccion.parrafos.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
            {r.datos.pilares.length === 0 ? (
              <p className="f-vacio">Los pilares de la propuesta educativa se publicarán pronto.</p>
            ) : (
              <Revelar como="ul" efecto="carriles" className="f-destacados">
                {r.datos.pilares.map((p, i) => (
                  <li key={p.id} className="f-destacado" style={{ '--i': i } as CSSProperties}>
                    <p className="f-destacado__rotulo" aria-hidden="true">
                      Pilar {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className="f-destacado__texto">{p.titulo}</h3>
                    <p className="f-pilar__texto">{p.texto}</p>
                    {p.puntos.length > 0 && (
                      <ul className="f-meta f-pilar__puntos" aria-label={`Aspectos de ${p.titulo}`}>
                        {p.puntos.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </Revelar>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
