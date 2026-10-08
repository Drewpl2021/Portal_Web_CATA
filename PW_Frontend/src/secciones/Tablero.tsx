import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { obtenerRutas, obtenerSitio } from '../api/servicios'
import RoutePlate, { EnlaceParada } from '../components/RoutePlate'
import SolicitudWhatsapp from '../components/SolicitudWhatsapp'
import { Cargando, ErrorCarga } from '../components/EstadoSeccion'
import { useRecurso } from '../hooks/useRecurso'

export interface TableroHandle {
  abrirSolicitud: () => void
}

// Las dos placas de ruta de la primera pantalla.
const Tablero = forwardRef<TableroHandle>(function Tablero(_, ref) {
  const rutas = useRecurso('rutas', obtenerRutas)
  const sitio = useRecurso('sitio', obtenerSitio)

  const [formAbierto, setFormAbierto] = useState(false)
  const placa = useRef<HTMLDivElement>(null)
  const primerCampo = useRef<HTMLInputElement>(null)
  const enfocar = useRef(false)

  useEffect(() => {
    if (formAbierto && enfocar.current) {
      primerCampo.current?.focus({ preventScroll: true })
      enfocar.current = false
    }
  }, [formAbierto])

  const abrir = () => {
    enfocar.current = true
    setFormAbierto(true)
  }

  useImperativeHandle(ref, () => ({
    abrirSolicitud: () => {
      abrir()
      placa.current?.scrollIntoView({ block: 'start' })
    },
  }))

  if (rutas.estado === 'cargando') {
    return (
      <div className="tablero" aria-busy="true">
        <div className="placa placa--claro">
          <div className="placa__marco">
            <Cargando que="las rutas de la portada" lineas={2} className="cargando--placa" />
          </div>
        </div>
        <div className="placa placa--emblema">
          <div className="placa__marco">
            <Cargando que="la ruta de la comunidad" lineas={2} className="cargando--placa" />
          </div>
        </div>
      </div>
    )
  }

  if (rutas.estado === 'error') {
    return (
      <div className="tablero">
        <div className="placa placa--claro">
          <div className="placa__marco">
            <ErrorCarga que="la portada" reintentar={rutas.reintentar} />
          </div>
        </div>
      </div>
    )
  }

  const { familias, comunidad } = rutas.datos

  return (
    <div className="tablero">
      <div ref={placa} className="tablero__ancla" id="familias">
        <RoutePlate
          id="ruta-familias"
          tono="claro"
          nombre={familias.nombre}
          bajada={familias.bajada}
          paradas={familias.paradas}
          terminal={
            <button
              type="button"
              className="ruta__enlace ruta__boton"
              aria-expanded={formAbierto}
              aria-controls="solicitud-panel"
              onClick={() => (formAbierto ? setFormAbierto(false) : abrir())}
            >
              <span className="ruta__punto ruta__punto--dorado" aria-hidden="true" />
              <span className="accion-dorada">
                {familias.accion.etiqueta}
                {formAbierto ? <X size={20} aria-hidden="true" /> : <ArrowRight size={20} aria-hidden="true" />}
              </span>
              {familias.accion.detalle && <span className="ruta__detalle">{familias.accion.detalle}</span>}
            </button>
          }
        >
          <div className="placa__panel" id="solicitud-panel" hidden={!formAbierto}>
            <p className="placa__panel-titulo">Arma tu mensaje y envíalo desde tu WhatsApp.</p>
            {sitio.estado === 'listo' && (
              <SolicitudWhatsapp accion={familias.accion} whatsapp={sitio.datos.whatsapp} primerCampoRef={primerCampo} />
            )}
            {sitio.estado === 'cargando' && <Cargando que="el formulario" lineas={2} />}
            {sitio.estado === 'error' && <ErrorCarga que="el formulario" reintentar={sitio.reintentar} />}
          </div>
        </RoutePlate>
      </div>

      <RoutePlate
        id="ruta-comunidad"
        tono="emblema"
        nombre={comunidad.nombre}
        bajada={comunidad.bajada}
        paradas={comunidad.paradas}
        terminal={comunidad.terminal && <EnlaceParada parada={comunidad.terminal} terminal />}
      />
    </div>
  )
})

export default Tablero
