import { useMapa } from '../../sitio/mapa'
import CabeceraMatricula from '../secciones/CabeceraMatricula'
import FechasMatricula from '../secciones/FechasMatricula'
import IndicePagina from '../secciones/IndicePagina'
import PreguntasMatricula from '../secciones/PreguntasMatricula'
import ProcesosMatricula from '../secciones/ProcesosMatricula'
import SolicitudInformacion from '../secciones/SolicitudInformacion'
import VacantesMatricula from '../secciones/VacantesMatricula'

// Matrícula: cabecera, índice de la página y una sección por endpoint. Cada sección maneja sus estados.
export default function Matricula() {
  const { titulos } = useMapa()
  const t = titulos.matricula
  // El índice usa los mismos títulos que las secciones.
  const indice = [
    { id: 'proceso', etiqueta: t.procesos },
    { id: 'vacantes', etiqueta: t.vacantes },
    { id: 'fechas', etiqueta: t.fechas },
    { id: 'preguntas', etiqueta: t.preguntas },
    { id: 'solicitar', etiqueta: t.accionPrincipal },
  ]
  return (
    <>
      <CabeceraMatricula />
      <IndicePagina secciones={indice} />
      <ProcesosMatricula />
      <VacantesMatricula />
      <FechasMatricula />
      <PreguntasMatricula />
      <SolicitudInformacion pagina="matricula" />
    </>
  )
}
