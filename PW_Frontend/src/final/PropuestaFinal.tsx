import { useEffect, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import InsigniaPrueba from '../components/InsigniaPrueba'
import { PaginaPendiente } from '../propuestas/IndicePropuestas'
import { ProveedorBaseRuta } from '../sitio/BaseRuta'
import { tituloDeRuta } from '../sitio/mapa'
import TransicionPagina from '../sitio/TransicionPagina'
import CabeceraFinal from './CabeceraFinal'
import Divisor from './Divisor'
import AvisoFinal from './secciones/AvisoFinal'
import Cifras from './secciones/Cifras'
import CierreFinal from './secciones/CierreFinal'
import HeroFinal from './secciones/HeroFinal'
import NivelesFinal from './secciones/NivelesFinal'
import NoticiasFinal from './secciones/NoticiasFinal'
import PieFinal from './secciones/PieFinal'
import QuienesFinal from './secciones/QuienesFinal'
import SedesFinal from './secciones/SedesFinal'
import './final.css'

const BASE = '/propuesta-final'

function Inicio() {
  return (
    <>
      <HeroFinal />
      <Cifras />
      <AvisoFinal />
      <Divisor />
      <QuienesFinal />
      <NivelesFinal />
      <SedesFinal />
      <Divisor fondo="lavado" />
      <NoticiasFinal />
      <CierreFinal />
    </>
  )
}

export default function PropuestaFinal() {
  const ubicacion = useLocation()
  const relativa = ubicacion.pathname.slice(BASE.length) || '/'

  // Activa los estados iniciales de las entradas al hacer scroll antes del primer pintado.
  // Sin esta clase (sin JavaScript), todo el contenido se ve desde el principio.
  useLayoutEffect(() => {
    document.documentElement.classList.add('f-anim')
    return () => document.documentElement.classList.remove('f-anim')
  }, [])

  // Cada página nueva empieza arriba.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [ubicacion.pathname])

  return (
    <ProveedorBaseRuta value={BASE}>
      <div className="f">
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <CabeceraFinal base={BASE} />
        <div data-fondo-menu>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={ubicacion} key={ubicacion.pathname}>
              <Route
                index
                element={
                  <TransicionPagina>
                    <main id="contenido" tabIndex={-1}>
                      <Inicio />
                    </main>
                  </TransicionPagina>
                }
              />
              <Route
                path="*"
                element={
                  <TransicionPagina>
                    <main id="contenido" tabIndex={-1} className="f-pendiente">
                      <PaginaPendiente titulo={tituloDeRuta(relativa)} />
                    </main>
                  </TransicionPagina>
                }
              />
            </Routes>
          </AnimatePresence>
          <PieFinal />
          <InsigniaPrueba />
        </div>
      </div>
    </ProveedorBaseRuta>
  )
}
