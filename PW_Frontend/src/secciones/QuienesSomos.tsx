import { obtenerQuienesSomos } from '../api/servicios'
import { Cargando, ErrorCarga } from '../components/EstadoSeccion'
import Imagen from '../components/Imagen'
import { useRecurso } from '../hooks/useRecurso'

export default function QuienesSomos() {
  const r = useRecurso('quienes-somos', obtenerQuienesSomos)

  return (
    <section className="seccion quienes" id="quienes-somos" aria-labelledby="quienes-titulo" aria-busy={r.estado === 'cargando'}>
      {r.estado === 'cargando' && <Cargando que="quiénes somos" lineas={5} />}
      {r.estado === 'error' && (
        <>
          <h2 className="titulo-rotulo" id="quienes-titulo">
            Quiénes somos
          </h2>
          <ErrorCarga que="esta sección" reintentar={r.reintentar} />
        </>
      )}
      {r.estado === 'listo' && (
        <div className={`quienes__cuerpo${r.datos.foto ? ' quienes__cuerpo--con-foto' : ''}`}>
          <div className="quienes__texto">
            <h2 className="titulo-rotulo" id="quienes-titulo">
              {r.datos.titulo}
            </h2>
            {r.datos.parrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            {r.datos.simbolos.length > 0 && (
              <div className="simbolos">
                <h3 className="simbolos__titulo">
                  <img src="/brand/emblema-cata-192.png" alt="" width="40" height="40" />
                  Lo que dice el emblema
                </h3>
                <dl>
                  {r.datos.simbolos.map((s, i) => (
                    <div key={i}>
                      <dt>{s.nombre}</dt>
                      <dd>{s.significado}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
          <Imagen imagen={r.datos.foto} proporcion="4 / 5" className="quienes__foto" sizes="(min-width: 760px) 40vw, 100vw" />
        </div>
      )}
    </section>
  )
}
