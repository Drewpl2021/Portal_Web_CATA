import { useEffect, useLayoutEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import InsigniaPrueba from '../components/InsigniaPrueba'
import { tituloDeRuta } from '../sitio/mapa'
import TransicionPagina, { pedirFocoEnPaginaNueva } from '../sitio/TransicionPagina'
import Cabecera from './Cabecera'
import Contacto from './paginas/Contacto'
import Inicio from './paginas/Inicio'
import Matricula from './paginas/Matricula'
import Pendiente from './paginas/Pendiente'
import PropuestaEducativa from './paginas/PropuestaEducativa'
import ProyectoDetalle from './paginas/ProyectoDetalle'
import Proyectos from './paginas/Proyectos'
import Pie from './secciones/Pie'
import './portal.css'

// Estructura de todo el portal: cabecera fija, páginas con transición y pie.
export default function Layout() {
  const ubicacion = useLocation()

  // Activa los estados iniciales de las entradas al hacer scroll antes del primer pintado.
  // Sin esta clase (sin JavaScript), todo el contenido se ve desde el principio.
  useLayoutEffect(() => {
    document.documentElement.classList.add('f-anim')
    return () => document.documentElement.classList.remove('f-anim')
  }, [])

  // Cada página nueva empieza arriba y, si se llegó navegando, con el foco en su contenido.
  const rutaAnterior = useRef(ubicacion.pathname)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (rutaAnterior.current !== ubicacion.pathname) {
      rutaAnterior.current = ubicacion.pathname
      pedirFocoEnPaginaNueva()
    }
  }, [ubicacion.pathname])

  const pagina = (contenido: React.ReactNode, clase?: string) => (
    <TransicionPagina>
      <main id="contenido" tabIndex={-1} className={clase}>
        {contenido}
      </main>
    </TransicionPagina>
  )

  return (
    <div className="f">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Cabecera />
      <div data-fondo-menu>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={ubicacion} key={ubicacion.pathname}>
            <Route index element={pagina(<Inicio />)} />
            <Route path="proyectos" element={pagina(<Proyectos />)} />
            <Route path="proyectos/:slug" element={pagina(<ProyectoDetalle />)} />
            <Route path="propuesta-educativa" element={pagina(<PropuestaEducativa />)} />
            <Route path="matricula" element={pagina(<Matricula />)} />
            <Route path="contacto" element={pagina(<Contacto />)} />
            <Route path="*" element={pagina(<Pendiente titulo={tituloDeRuta(ubicacion.pathname)} />, 'f-pendiente')} />
          </Routes>
        </AnimatePresence>
        <Pie />
        <InsigniaPrueba />
      </div>
    </div>
  )
}
