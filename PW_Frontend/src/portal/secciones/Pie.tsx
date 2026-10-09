import { Link } from 'react-router-dom'
import { ArrowUpRight, MapPin, MessageCircle, Phone } from 'lucide-react'
import { obtenerSitio } from '../../api/servicios'
import { useRecurso } from '../../hooks/useRecurso'
import { enlaceMapa, enlaceTel, enlaceWhatsapp } from '../../lib/formato'
import { MENU, NOSOTROS } from '../../sitio/mapa'
import { useRutaInterna } from '../../sitio/BaseRuta'
import Medalla from '../Medalla'

// Pie completo sobre marino: identidad, contacto, mapa del sitio y accesos.
export default function PieFinal() {
  const r = useRecurso('sitio', obtenerSitio)
  const interna = useRutaInterna()
  const sitio = r.estado === 'listo' ? r.datos : null
  const anio = new Date().getFullYear()

  return (
    <footer className="f-pie">
      <div className="f-pie__interior">
        <div className="f-pie__marca">
          <Medalla nombre={sitio?.nombre ?? 'Colegio Adventista Túpac Amaru'} anio={sitio?.anioFundacion ?? null} className="f-pie__medalla" />
          <p className="f-pie__nombre">{sitio?.nombre ?? 'Colegio Adventista Túpac Amaru'}</p>
          {sitio && (
            <p className="f-pie__lema">
              {[sitio.subtitulo, `${sitio.ciudad}, desde ${sitio.anioFundacion}`].filter(Boolean).join(' · ')}
            </p>
          )}
          {sitio?.portalAcademico && (
            <a className="f-portal-academico f-portal-academico--pie" href={sitio.portalAcademico.url} target="_blank" rel="noreferrer">
              <span className="f-portal-academico__texto">
                {sitio.portalAcademico.nombre} · Portal académico <ArrowUpRight size={18} strokeWidth={2.5} aria-hidden="true" />
              </span>
              <span className="visually-hidden"> (se abre en otra pestaña)</span>
            </a>
          )}
        </div>

        <nav className="f-pie__columna" aria-labelledby="f-pie-sitio">
          <h2 id="f-pie-sitio">El colegio</h2>
          <ul>
            {MENU.filter((m) => !m.grupos).map((m) => (
              <li key={m.ruta}>
                <Link to={interna(m.ruta)}>{m.etiqueta}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="f-pie__columna" aria-labelledby="f-pie-nosotros">
          <h2 id="f-pie-nosotros">Nosotros</h2>
          <ul>
            {NOSOTROS[0]!.enlaces.map((e) => (
              <li key={e.ruta}>
                <Link to={interna(e.ruta)}>{e.etiqueta}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="f-pie__columna">
          <h2>Contacto</h2>
          {sitio ? (
            <ul className="f-pie__contacto">
              <li>
                <a href={enlaceTel(sitio.telefono)}>
                  <Phone size={18} aria-hidden="true" /> {sitio.telefono.visible}
                </a>
              </li>
              <li>
                <a href={enlaceWhatsapp(sitio.whatsapp)} target="_blank" rel="noreferrer">
                  <MessageCircle size={18} aria-hidden="true" /> WhatsApp {sitio.whatsapp.visible}
                  <span className="visually-hidden"> (se abre en otra pestaña)</span>
                </a>
              </li>
              <li>
                <a
                  href={enlaceMapa({ mapaUrl: null, direccion: sitio.direccion.linea, distrito: sitio.direccion.distrito })}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin size={18} aria-hidden="true" />
                  <span>
                    {sitio.direccion.linea}
                    {sitio.direccion.distrito && (
                      <>
                        <br />
                        {sitio.direccion.distrito}
                      </>
                    )}
                  </span>
                  <span className="visually-hidden"> (mapa, se abre en otra pestaña)</span>
                </a>
              </li>
            </ul>
          ) : (
            <p className="f-pie__nota">{r.estado === 'cargando' ? 'Cargando datos de contacto…' : 'Datos de contacto no disponibles.'}</p>
          )}
        </div>
      </div>

      <div className="f-pie__base">
        <p>
          © {anio} {sitio?.nombre ?? 'Colegio Adventista Túpac Amaru'}.{sitio?.promotora && ` ${sitio.promotora}.`}
        </p>
      </div>
    </footer>
  )
}
