import CabeceraMatricula from '../secciones/CabeceraMatricula'
import FechasMatricula from '../secciones/FechasMatricula'
import PreguntasMatricula from '../secciones/PreguntasMatricula'
import ProcesosMatricula from '../secciones/ProcesosMatricula'
import SolicitudMatricula from '../secciones/SolicitudMatricula'
import VacantesMatricula from '../secciones/VacantesMatricula'

const INDICE = [
  { id: 'proceso', etiqueta: 'Pasos y requisitos' },
  { id: 'vacantes', etiqueta: 'Vacantes' },
  { id: 'fechas', etiqueta: 'Fechas' },
  { id: 'preguntas', etiqueta: 'Preguntas' },
  { id: 'solicitar', etiqueta: 'Solicitar información' },
]

// Matrícula: cabecera, índice de la página y una sección por endpoint. Cada sección maneja sus estados.
export default function Matricula() {
  return (
    <>
      <CabeceraMatricula />
      <nav className="f-indice" aria-label="En esta página">
        <ul className="f-indice__lista">
          {INDICE.map((s) => (
            <li key={s.id}>
              <a className="f-indice__enlace" href={`#${s.id}`}>
                {s.etiqueta}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <ProcesosMatricula />
      <VacantesMatricula />
      <FechasMatricula />
      <PreguntasMatricula />
      <SolicitudMatricula />
    </>
  )
}
