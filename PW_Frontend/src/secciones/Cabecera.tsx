import { MessageCircle, Phone } from 'lucide-react'
import { obtenerSitio } from '../api/servicios'
import { useRecurso } from '../hooks/useRecurso'
import { enlaceTel, enlaceWhatsapp } from '../lib/formato'

// El emblema es un archivo de marca local, no contenido de la API.
const EMBLEMA = '/brand/emblema-cata-192.png'
const NOMBRE_EMBLEMA = 'Colegio Adventista Túpac Amaru'

export default function Cabecera() {
  const sitio = useRecurso('sitio', obtenerSitio)
  const datos = sitio.estado === 'listo' ? sitio.datos : null

  return (
    <header className="cabecera">
      <div className="cabecera__marca">
        <img className="cabecera__emblema" src={EMBLEMA} alt={sitio.estado === 'cargando' ? NOMBRE_EMBLEMA : ''} width="64" height="64" />
        <div className="cabecera__textos">
          {datos ? (
            <>
              <h1 className="cabecera__nombre">{datos.nombre}</h1>
              <p className="cabecera__lema">
                {[datos.subtitulo, `${datos.ciudad}, desde ${datos.anioFundacion}`].filter(Boolean).join(' — ')}
              </p>
            </>
          ) : (
            <>
              {sitio.estado === 'cargando' && <span className="cabecera__esqueleto" aria-hidden="true" />}
              {sitio.estado === 'error' && <h1 className="cabecera__nombre">{NOMBRE_EMBLEMA}</h1>}
            </>
          )}
        </div>
      </div>

      {datos && (
        <nav className="cabecera__accesos" aria-label="Contacto rápido">
          <a href={enlaceTel(datos.telefono)}>
            <Phone size={18} aria-hidden="true" />
            <span className="cabecera__acceso-texto">
              <span className="visually-hidden">Llamar al </span>
              {datos.telefono.visible}
            </span>
          </a>
          <a href={enlaceWhatsapp(datos.whatsapp)} target="_blank" rel="noreferrer">
            <MessageCircle size={18} aria-hidden="true" />
            <span className="cabecera__acceso-texto">
              WhatsApp<span className="visually-hidden"> (se abre en otra pestaña)</span>
            </span>
          </a>
        </nav>
      )}
    </header>
  )
}
