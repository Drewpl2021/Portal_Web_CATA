import type { CSSProperties } from 'react'
import { Info } from 'lucide-react'
import { obtenerFechasMatricula } from '../../api/servicios'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import { useMapa } from '../../sitio/mapa'
import { etapaDe, partesFecha, rangoLegible } from '../../lib/formato'
import { Revelar } from '../movimiento'

const ETAPA = { 'en-curso': 'En curso', pasada: 'Terminó', proxima: null } as const

// Cronograma: una pista vertical con el día en una placa marina y el periodo escrito completo al lado.
export default function FechasMatricula() {
  const { titulos } = useMapa()
  const r = useRecurso('matricula-fechas', obtenerFechasMatricula)

  return (
    <section className="f-seccion f-fechas" id="fechas" aria-labelledby="f-fechas-titulo">
      <div className="f-seccion__interior">
        <h2 className="f-titulo" id="f-fechas-titulo">
          <Revelar como="span" efecto="titulo" className="f-barrido">
            {titulos.matricula.fechas}
          </Revelar>
        </h2>
        {r.estado === 'cargando' && <Cargando que="las fechas" lineas={4} conTitulo={false} />}
        {r.estado === 'error' && <ErrorCarga que="las fechas" reintentar={r.reintentar} />}
        {r.estado === 'listo' && (
          <>
            {r.datos.nota && (
              <p className="f-aviso">
                <Info size={22} strokeWidth={2.5} aria-hidden="true" />
                <span>{r.datos.nota}</span>
              </p>
            )}
            {r.datos.items.length === 0 ? (
              <div className="f-vacio">
                <p>El cronograma de matrícula se publicará pronto.</p>
                <p>
                  Si quieres que te avisemos, <a href="#solicitar">escríbenos por WhatsApp</a>.
                </p>
              </div>
            ) : (
              <Revelar como="ol" efecto="escalonado" className="f-cronograma">
                {r.datos.items.map((f, i) => {
                  const { dia, mes, anio } = partesFecha(f.inicio)
                  const etapa = ETAPA[etapaDe(f.inicio, f.fin)]
                  return (
                    <li key={f.id} className="f-hito" style={{ '--i': i } as CSSProperties}>
                      <span className="f-hito__fecha" aria-hidden="true">
                        <span className="f-hito__dia">{dia}</span>
                        <span className="f-hito__mes">
                          {mes} {anio}
                        </span>
                      </span>
                      <div className="f-hito__texto">
                        <h3 className="f-hito__titulo">{f.titulo}</h3>
                        <p className="f-hito__periodo">
                          <time dateTime={f.inicio}>{rangoLegible(f.inicio, f.fin)}</time>
                          {etapa && <span className="f-hito__etapa"> {etapa}</span>}
                        </p>
                        {f.detalle && <p className="f-hito__detalle">{f.detalle}</p>}
                      </div>
                    </li>
                  )
                })}
              </Revelar>
            )}
          </>
        )}
      </div>
    </section>
  )
}
