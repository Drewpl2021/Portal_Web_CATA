import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'

import { obtenerProcesosMatricula } from '../../api/servicios'
import type { ProcesoMatricula } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import { useMapa } from '../../sitio/mapa'
import { ItemsVerificados } from '../contenido/Bloques'
import { Revelar } from '../movimiento'

// Pasos, requisitos y documentos de cada proceso (estudiantes nuevos, regulares…).
// Con más de un proceso, se eligen con pestañas; cada pestaña muestra sus pasos como una pista numerada.
export default function ProcesosMatricula() {
  const { titulos } = useMapa()
  const r = useRecurso('matricula-procesos', obtenerProcesosMatricula)

  return (
    <section className="f-seccion f-procesos" id="proceso" aria-labelledby="f-procesos-titulo">
      <div className="f-seccion__interior">
        <h2 className="f-titulo" id="f-procesos-titulo">
          <Revelar como="span" efecto="titulo" className="f-barrido">
            {titulos.matricula.procesos}
          </Revelar>
        </h2>
        {r.estado === 'cargando' && <Cargando que="el proceso de matrícula" lineas={5} conTitulo={false} />}
        {r.estado === 'error' && <ErrorCarga que="el proceso de matrícula" reintentar={r.reintentar} />}
        {r.estado === 'listo' && r.datos.length === 0 && (
          <div className="f-vacio">
            <p>Los pasos y requisitos de matrícula se publicarán pronto.</p>
            <p>
              Mientras tanto, <a href="#solicitar">solicita información por WhatsApp</a>.
            </p>
          </div>
        )}
        {r.estado === 'listo' && r.datos.length === 1 && <Proceso proceso={r.datos[0]!} />}
        {r.estado === 'listo' && r.datos.length > 1 && <Pestanas procesos={r.datos} />}
      </div>
    </section>
  )
}

// Pestañas según el patrón de ARIA: flechas, Inicio y Fin mueven y activan; solo la activa está en el orden de tabulación.
function Pestanas({ procesos }: { procesos: ProcesoMatricula[] }) {
  const base = useId()
  const [activa, setActiva] = useState(0)
  const botones = useRef<(HTMLButtonElement | null)[]>([])

  const ir = (i: number) => {
    const n = (i + procesos.length) % procesos.length
    setActiva(n)
    botones.current[n]?.focus()
  }

  const alTeclear = (e: KeyboardEvent) => {
    const mapa: Record<string, number> = { ArrowRight: activa + 1, ArrowLeft: activa - 1, Home: 0, End: procesos.length - 1 }
    if (e.key in mapa) {
      e.preventDefault()
      ir(mapa[e.key]!)
    }
  }

  return (
    <>
      <p className="f-procesos__pregunta" id={`${base}-etiqueta`}>
        ¿Para quién es la matrícula?
      </p>
      <div className="f-pestanas" role="tablist" aria-labelledby={`${base}-etiqueta`} onKeyDown={alTeclear}>
        {procesos.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => {
              botones.current[i] = el
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${i}`}
            aria-selected={i === activa}
            aria-controls={`${base}-panel-${i}`}
            tabIndex={i === activa ? 0 : -1}
            className="f-pestana"
            onClick={() => setActiva(i)}
          >
            <span className="f-pestana__texto">{p.nombre}</span>
          </button>
        ))}
      </div>
      {procesos.map((p, i) => (
        <div
          key={p.id}
          role="tabpanel"
          id={`${base}-panel-${i}`}
          aria-labelledby={`${base}-tab-${i}`}
          tabIndex={0}
          hidden={i !== activa}
          className="f-procesos__panel"
        >
          {i === activa && <Proceso proceso={p} conNombre={false} />}
        </div>
      ))}
    </>
  )
}

function Proceso({ proceso, conNombre = true }: { proceso: ProcesoMatricula; conNombre?: boolean }) {
  const enFila = proceso.pasos.length > 1 && proceso.pasos.length <= 4
  return (
    <div className="f-proceso">
      {conNombre && <h3 className="f-proceso__nombre">{proceso.nombre}</h3>}
      {proceso.resumen && <p className="f-proceso__resumen">{proceso.resumen}</p>}

      {proceso.pasos.length > 0 && (
        <>
          <h3 className="f-subtitulo">{proceso.pasos.length === 1 ? 'Paso' : `${proceso.pasos.length} pasos`}</h3>
          <Revelar
            como="ol"
            efecto="escalonado"
            className={`f-pasos${enFila ? ' f-pasos--fila' : ''}`}
            style={{ '--n': proceso.pasos.length } as CSSProperties}
          >
            {proceso.pasos.map((paso, i) => (
              <li key={i} className="f-paso" style={{ '--i': i } as CSSProperties}>
                <span className="f-paso__numero" aria-hidden="true">
                  {i + 1}
                </span>
                <h4 className="f-paso__titulo">
                  <span className="visually-hidden">Paso {i + 1}: </span>
                  {paso.titulo}
                </h4>
                {paso.detalle && <p className="f-paso__detalle">{paso.detalle}</p>}
              </li>
            ))}
          </Revelar>
        </>
      )}

      {proceso.listas.length > 0 && (
        <Revelar efecto="escalonado" className="f-listas">
          {proceso.listas.map((lista, i) => (
            <div key={i} className="f-lista" style={{ '--i': i } as CSSProperties}>
              <h3 className="f-lista__titulo">{lista.titulo}</h3>
              <ItemsVerificados items={lista.items} />
            </div>
          ))}
        </Revelar>
      )}
    </div>
  )
}
