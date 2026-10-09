import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { obtenerQuienesSomos } from '../../api/servicios'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import { useRutaInterna } from '../../sitio/BaseRuta'
import { FotoParallax, Revelar } from '../movimiento'

export default function QuienesFinal() {
  const r = useRecurso('quienes-somos', obtenerQuienesSomos)
  const interna = useRutaInterna()

  return (
    <section className="f-seccion f-quienes" aria-labelledby="f-quienes-titulo">
      {r.estado === 'cargando' && <Cargando que="quiénes somos" lineas={5} />}
      {r.estado === 'error' && (
        <>
          <h2 className="f-titulo" id="f-quienes-titulo">
            Quiénes somos
          </h2>
          <ErrorCarga que="esta sección" reintentar={r.reintentar} />
        </>
      )}
      {r.estado === 'listo' && (
        <div className={`f-quienes__cuerpo${r.datos.foto ? ' f-quienes__cuerpo--foto' : ''}`}>
          {r.datos.foto && (
            <FotoParallax imagen={r.datos.foto} proporcion="4 / 5" className="f-quienes__foto" sizes="(min-width: 900px) 40vw, 100vw" />
          )}
          <div className="f-quienes__texto">
            <h2 className="f-titulo" id="f-quienes-titulo">
              <Revelar como="span" efecto="titulo" className="f-barrido">
                {r.datos.titulo}
              </Revelar>
            </h2>
            <Revelar efecto="barras" className="f-barras">
              <span />
              <span />
            </Revelar>
            {r.datos.parrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <Link to={interna('/nosotros/resena-historica')} className="f-enlace">
              Conoce nuestra historia <ArrowRight size={18} aria-hidden="true" />
            </Link>

            {r.datos.simbolos.length > 0 && (
              <>
                <h3 className="f-subtitulo">Lo que dice el emblema</h3>
                <Revelar como="ul" efecto="escalonado" className="f-simbolos">
                  {r.datos.simbolos.map((s, i) => (
                    <li key={i} className="f-tarjeta f-simbolo" style={{ '--i': i } as CSSProperties}>
                      <span className="f-simbolo__nombre">{s.nombre}</span>
                      <span className="f-simbolo__texto">{s.significado}</span>
                    </li>
                  ))}
                </Revelar>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
