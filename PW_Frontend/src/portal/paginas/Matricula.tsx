import CabeceraMatricula from '../secciones/CabeceraMatricula'
import FechasMatricula from '../secciones/FechasMatricula'
import IndicePagina from '../secciones/IndicePagina'
import PreguntasMatricula from '../secciones/PreguntasMatricula'
import ProcesosMatricula from '../secciones/ProcesosMatricula'
import SolicitudInformacion from '../secciones/SolicitudInformacion'
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
      <IndicePagina secciones={INDICE} />
      <ProcesosMatricula />
      <VacantesMatricula />
      <FechasMatricula />
      <PreguntasMatricula />
      <SolicitudInformacion pagina="matricula" />
    </>
  )
}
