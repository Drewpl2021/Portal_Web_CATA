import { obtenerSitio } from '../../api/servicios'
import { useRecurso } from '../../hooks/useRecurso'
import Divisor from '../Divisor'
import Carrusel from '../secciones/Carrusel'
import Cierre from '../secciones/Cierre'
import Cifras from '../secciones/Cifras'
import Niveles from '../secciones/Niveles'
import Noticias from '../secciones/Noticias'
import Quienes from '../secciones/Quienes'
import Sedes from '../secciones/Sedes'

// Inicio: el carrusel de lo último que publica el colegio y, debajo, el resto de secciones.
export default function Inicio() {
  const sitio = useRecurso('sitio', obtenerSitio)
  return (
    <>
      {/* El título oculto de la página: el nombre del colegio, en cuanto llega. */}
      {sitio.estado === 'listo' && <h1 className="visually-hidden">{sitio.datos.nombre}</h1>}
      <Carrusel />
      <Cifras />
      <Quienes />
      <Niveles />
      <Sedes />
      <Divisor fondo="lavado" />
      <Noticias />
      <Cierre />
    </>
  )
}
