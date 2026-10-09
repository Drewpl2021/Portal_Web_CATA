import { useEffect, useLayoutEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import InsigniaPrueba from '../components/InsigniaPrueba'
import { tituloDeRuta } from '../sitio/mapa'
import TransicionPagina, { pedirFocoEnPaginaNueva } from '../sitio/TransicionPagina'
import Cabecera from './Cabecera'
import Contacto from './paginas/Contacto'
import Inicio from './paginas/Inicio'
import Logros from './paginas/Logros'
import Matricula from './paginas/Matricula'
import Nosotros from './paginas/Nosotros'
import NosotrosPagina from './paginas/NosotrosPagina'
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

  // Foco nunca tapado (WCAG 2.4.11): si el elemento enfocado queda en parte bajo la cabecera fija,
  // el navegador no desplaza la página porque lo considera visible. Aquí se corrige ese caso.
  useEffect(() => {
    const alEnfocar = (e: FocusEvent) => {
      const el = e.target
      if (!(el instanceof HTMLElement) || el.closest('.f-cab') || el.classList.contains('skip-link') || el.id === 'contenido') return
      const cabecera = document.querySelector('.f-cab__barra')?.getBoundingClientRect()
      if (!cabecera) return
      const arriba = el.getBoundingClientRect().top
      const margen = 16
      if (arriba < cabecera.bottom + margen) window.scrollBy({ top: arriba - cabecera.bottom - margen, behavior: 'instant' })
    }
    document.addEventListener('focusin', alEnfocar)
    return () => document.removeEventListener('focusin', alEnfocar)
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
            <Route path="nosotros" element={pagina(<Nosotros />)} />
            <Route path="nosotros/:slug" element={pagina(<NosotrosPagina />)} />
            <Route path="proyectos/:slug" element={pagina(<ProyectoDetalle />)} />
            <Route path="propuesta-educativa" element={pagina(<PropuestaEducativa />)} />
            <Route path="matricula" element={pagina(<Matricula />)} />
            <Route path="contacto" element={pagina(<Contacto />)} />
            <Route path="logros" element={pagina(<Logros />)} />
            <Route path="*" element={pagina(<Pendiente titulo={tituloDeRuta(ubicacion.pathname)} />, 'f-pendiente')} />
          </Routes>
        </AnimatePresence>
        <Pie />
        <InsigniaPrueba />
      </div>
    </div>
  )
}
