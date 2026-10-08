import { useRef } from 'react'
import InsigniaPrueba from '../components/InsigniaPrueba'
import Aviso from '../secciones/Aviso'
import Cabecera from '../secciones/Cabecera'
import Cierre from '../secciones/Cierre'
import Niveles from '../secciones/Niveles'
import Noticias from '../secciones/Noticias'
import Pie from '../secciones/Pie'
import QuienesSomos from '../secciones/QuienesSomos'
import Sedes from '../secciones/Sedes'
import Tablero, { type TableroHandle } from '../secciones/Tablero'
import './Home.css'

// La portada solo compone secciones. Cada una carga sus datos y maneja su propia carga, error y vacío.
export default function Home() {
  const tablero = useRef<TableroHandle>(null)

  return (
    <>
      <a className="skip-link" href="#principal">
        Saltar al contenido
      </a>
      <InsigniaPrueba />
      <Cabecera />
      <main id="principal" tabIndex={-1}>
        <Tablero ref={tablero} />
        <Aviso />
        <QuienesSomos />
        <Niveles />
        <Sedes />
        <Noticias />
        <Cierre alSolicitar={() => tablero.current?.abrirSolicitud()} />
      </main>
      <Pie />
    </>
  )
}
