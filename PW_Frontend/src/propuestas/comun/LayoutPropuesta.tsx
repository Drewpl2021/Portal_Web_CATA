import type { ComponentType } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import TransicionPagina from '../../sitio/TransicionPagina'
import { tituloDeRuta } from '../../sitio/mapa'
import { CambiarPropuesta, PaginaPendiente } from '../IndicePropuestas'

interface Props {
  letra: 'A' | 'B' | 'C'
  base: string
  clase: string
  Cabecera: ComponentType<{ base: string }>
  Hero: ComponentType
}

// Estructura común: cabecera fija, páginas con transición y barra para cambiar de propuesta.
// Las rutas internas viven bajo la base de la propuesta para probar el menú sin salir de ella.
export default function LayoutPropuesta({ letra, base, clase, Cabecera, Hero }: Props) {
  const ubicacion = useLocation()
  const relativa = ubicacion.pathname.slice(base.length) || '/'

  return (
    <div className={clase}>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Cabecera base={base} />
      <div data-fondo-menu>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={ubicacion} key={ubicacion.pathname}>
            <Route
              index
              element={
                <TransicionPagina>
                  <main id="contenido" tabIndex={-1}>
                    <Hero />
                  </main>
                </TransicionPagina>
              }
            />
            <Route
              path="*"
              element={
                <TransicionPagina>
                  <main id="contenido" tabIndex={-1}>
                    <PaginaPendiente titulo={tituloDeRuta(relativa)} />
                  </main>
                </TransicionPagina>
              }
            />
          </Routes>
        </AnimatePresence>
        <CambiarPropuesta actual={letra} />
      </div>
    </div>
  )
}
