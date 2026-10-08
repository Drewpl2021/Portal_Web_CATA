import { ArrowRight, MapPin, MessageCircle, Phone } from 'lucide-react'
import { obtenerRutas, obtenerSitio } from '../api/servicios'
import { Cargando, ErrorCarga } from '../components/EstadoSeccion'
import { useRecurso } from '../hooks/useRecurso'
import { enlaceMapa, enlaceTel, enlaceWhatsapp } from '../lib/formato'

export default function Cierre({ alSolicitar }: { alSolicitar: () => void }) {
  const r = useRecurso('sitio', obtenerSitio)
  const rutas = useRecurso('rutas', obtenerRutas)

  return (
    <section className="cierre" id="contacto" aria-labelledby="contacto-titulo">
      <div className="cierre__marco">
        <h2 className="cierre__titulo" id="contacto-titulo">
          {r.estado === 'listo' ? `¿Quieres conocer ${r.datos.nombreCorto}?` : 'Contacto'}
        </h2>
        {r.estado === 'cargando' && <Cargando que="los datos de contacto" lineas={2} />}
        {r.estado === 'error' && <ErrorCarga que="los datos de contacto" reintentar={r.reintentar} />}
        {r.estado === 'listo' && (
          <ul className="cierre__datos">
            <li>
              <a href={enlaceTel(r.datos.telefono)}>
                <Phone size={22} aria-hidden="true" />
                <span>
                  <strong>Teléfono</strong> {r.datos.telefono.visible}
                </span>
              </a>
            </li>
            <li>
              <a href={enlaceWhatsapp(r.datos.whatsapp)} target="_blank" rel="noreferrer">
                <MessageCircle size={22} aria-hidden="true" />
                <span>
                  <strong>WhatsApp</strong> {r.datos.whatsapp.visible}
                  <span className="visually-hidden"> (se abre en otra pestaña)</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={enlaceMapa({ mapaUrl: null, direccion: r.datos.direccion.linea, distrito: r.datos.direccion.distrito })}
                target="_blank"
                rel="noreferrer"
              >
                <MapPin size={22} aria-hidden="true" />
                <span>
                  <strong>{r.datos.direccion.linea}</strong> {r.datos.direccion.referencia}
                  <span className="visually-hidden"> (mapa, se abre en otra pestaña)</span>
                </span>
              </a>
            </li>
          </ul>
        )}
        {rutas.estado === 'listo' && (
          <button type="button" className="accion-dorada cierre__accion" onClick={alSolicitar}>
            {rutas.datos.familias.accion.etiqueta} <ArrowRight size={20} aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  )
}
