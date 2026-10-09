import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import InsigniaPrueba from '../components/InsigniaPrueba'
import { tituloDeRuta } from '../sitio/mapa'
import TransicionPagina, { pedirFocoEnPaginaNueva } from '../sitio/TransicionPagina'
import BarraRedes from './BarraRedes'
import Cabecera from './Cabecera'
import Inicio from './paginas/Inicio'
import Pendiente from './paginas/Pendiente'
import { CabeceraCargando } from './secciones/CabeceraPagina'
import Pie from './secciones/Pie'
import './portal.css'

// Inicio va en el paquete principal; las demás páginas se descargan al visitarlas.
const Contacto = lazy(() => import('./paginas/Contacto'))
const Logros = lazy(() => import('./paginas/Logros'))
const Matricula = lazy(() => import('./paginas/Matricula'))
const Nosotros = lazy(() => import('./paginas/Nosotros'))
const NosotrosPagina = lazy(() => import('./paginas/NosotrosPagina'))
const PropuestaEducativa = lazy(() => import('./paginas/PropuestaEducativa'))
const ProyectoDetalle = lazy(() => import('./paginas/ProyectoDetalle'))
const Proyectos = lazy(() => import('./paginas/Proyectos'))

// Estructura de todo el portal: cabecera fija, páginas con transición, pie y barra de redes.
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
        {/* Mientras llega el código de la página, la misma cabecera de carga que usan las páginas */}
        <Suspense fallback={<CabeceraCargando />}>{contenido}</Suspense>
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
        <BarraRedes />
        <InsigniaPrueba />
      </div>
    </div>
  )
}
