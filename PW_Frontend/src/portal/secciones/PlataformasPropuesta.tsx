import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { obtenerPlataformas } from '../../api/servicios'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import { useMapa } from '../../sitio/mapa'
import { Revelar } from '../movimiento'

// Plataformas digitales (Cubicol, EVA) en las tarjetas de texto de Nosotros; lo que falta lleva su aclaración.
export default function PlataformasPropuesta() {
  const { titulos } = useMapa()
  const r = useRecurso('propuesta-plataformas', obtenerPlataformas)

  return (
    <section className="f-seccion f-plataformas" id="plataformas" aria-labelledby="f-plataformas-titulo">
      <div className="f-seccion__interior">
        <h2 className="f-titulo" id="f-plataformas-titulo">
          <Revelar como="span" efecto="titulo" className="f-barrido">
            {titulos.propuestaEducativa.plataformas}
          </Revelar>
        </h2>
        {r.estado === 'cargando' && <Cargando que="las plataformas" lineas={4} conTitulo={false} />}
        {r.estado === 'error' && <ErrorCarga que="las plataformas" reintentar={r.reintentar} />}
        {r.estado === 'listo' && r.datos.length === 0 && <p className="f-vacio">Las plataformas digitales se publicarán pronto.</p>}
        {r.estado === 'listo' && r.datos.length > 0 && (
          <Revelar como="ul" efecto="escalonado" className="f-tarjetas-texto">
            {r.datos.map((p, i) => (
              <li key={p.id} className="f-tarjeta-texto" style={{ '--i': i } as CSSProperties}>
                <h3 className="f-tarjeta-texto__titulo">{p.nombre}</h3>
                {p.aclaracion && <p className="f-logro__aclaracion">{p.aclaracion}</p>}
                {p.descripcion && <p className="f-tarjeta-texto__texto">{p.descripcion}</p>}
                {p.funciones.length > 0 && (
                  <dl className="f-funciones">
                    {p.funciones.map((f) => (
                      <div key={f.titulo}>
                        <dt>{f.titulo}</dt>
                        <dd>{f.texto}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {p.enlace && (
                  <p className="f-funciones__enlace">
                    <a className="f-enlace f-enlace--chico" href={p.enlace.url} {...(p.enlace.externo ? { target: '_blank', rel: 'noreferrer' } : {})}>
                      {p.enlace.etiqueta} {p.enlace.externo && <ArrowUpRight size={18} aria-hidden="true" />}
                      {p.enlace.externo && <span className="visually-hidden"> (se abre en otra pestaña)</span>}
                    </a>
                  </p>
                )}
              </li>
            ))}
          </Revelar>
        )}
      </div>
    </section>
  )
}
