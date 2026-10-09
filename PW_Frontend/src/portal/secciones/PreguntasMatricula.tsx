import type { CSSProperties } from 'react'
import { Plus } from 'lucide-react'
import { obtenerPreguntasMatricula } from '../../api/servicios'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import { Revelar } from '../movimiento'

// Preguntas frecuentes con <details>: el navegador ya da teclado, estado abierto/cerrado y búsqueda en la página.
export default function PreguntasMatricula() {
  const r = useRecurso('matricula-preguntas', obtenerPreguntasMatricula)

  return (
    <section className="f-seccion f-preguntas" id="preguntas" aria-labelledby="f-preguntas-titulo">
      <div className="f-seccion__interior">
        <h2 className="f-titulo" id="f-preguntas-titulo">
          <Revelar como="span" efecto="titulo" className="f-barrido">
            Preguntas frecuentes
          </Revelar>
        </h2>
        {r.estado === 'cargando' && <Cargando que="las preguntas frecuentes" lineas={5} conTitulo={false} />}
        {r.estado === 'error' && <ErrorCarga que="las preguntas frecuentes" reintentar={r.reintentar} />}
        {r.estado === 'listo' && r.datos.length === 0 && (
          <div className="f-vacio">
            <p>Todavía no hay preguntas publicadas.</p>
            <p>
              Si tienes una duda, <a href="#solicitar">escríbenos por WhatsApp</a>.
            </p>
          </div>
        )}
        {r.estado === 'listo' && r.datos.length > 0 && (
          <Revelar efecto="escalonado" className="f-acordeon">
            {r.datos.map((p, i) => (
              <details key={p.id} className="f-pregunta" style={{ '--i': i } as CSSProperties}>
                <summary className="f-pregunta__resumen">
                  <span className="f-pregunta__texto">{p.pregunta}</span>
                  <span className="f-pregunta__icono" aria-hidden="true">
                    <Plus size={20} strokeWidth={3} />
                  </span>
                </summary>
                <p className="f-pregunta__respuesta">{p.respuesta}</p>
              </details>
            ))}
          </Revelar>
        )}
      </div>
    </section>
  )
}
