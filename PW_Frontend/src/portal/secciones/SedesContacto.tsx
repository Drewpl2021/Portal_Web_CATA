import type { CSSProperties } from 'react'
import { Clock, Mail, Map as IconoMapa, MapPin, Navigation, Phone } from 'lucide-react'
import { obtenerSedes } from '../../api/servicios'
import type { Sede } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import { useMapa } from '../../sitio/mapa'
import { enlaceMapa, enlaceTel } from '../../lib/formato'
import { Revelar } from '../movimiento'

// Datos de cada sede en placas: número de sede, dirección, teléfono, correo, horario y cómo llegar.
// Cada dato falta sin dejar hueco; «Ver en el mapa» lleva al mapa de la página con esa sede elegida.
export default function SedesContacto({ alVerEnMapa }: { alVerEnMapa: (id: string) => void }) {
  const { titulos } = useMapa()
  const r = useRecurso('sedes', obtenerSedes)

  return (
    <section className="f-seccion f-sedes-contacto" id="sedes" aria-labelledby="f-sedes-contacto-titulo">
      <div className="f-seccion__interior">
        <h2 className="f-titulo" id="f-sedes-contacto-titulo">
          <Revelar como="span" efecto="titulo" className="f-barrido">
            {r.estado === 'listo' && r.datos.length === 1 ? titulos.contacto.sedesUna : titulos.contacto.sedes}
          </Revelar>
        </h2>
        {r.estado === 'cargando' && <Cargando que="las sedes" lineas={5} conTitulo={false} />}
        {r.estado === 'error' && <ErrorCarga que="las sedes" reintentar={r.reintentar} />}
        {r.estado === 'listo' && r.datos.length === 0 && (
          <div className="f-vacio">
            <p>Las direcciones de las sedes se publicarán pronto.</p>
            <p>
              Mientras tanto, <a href="#solicitar">escríbenos por WhatsApp</a>.
            </p>
          </div>
        )}
        {r.estado === 'listo' && r.datos.length > 0 && (
          <Revelar como="ul" efecto="escalonado" className="f-fichas">
            {r.datos.map((s, i) => (
              <Ficha key={s.id} sede={s} i={i} alVerEnMapa={alVerEnMapa} />
            ))}
          </Revelar>
        )}
      </div>
    </section>
  )
}

function Ficha({ sede: s, i, alVerEnMapa }: { sede: Sede; i: number; alVerEnMapa: (id: string) => void }) {
  return (
    <li className="f-ficha" style={{ '--i': i } as CSSProperties}>
      <div className="f-ficha__cabeza">
        <span className="f-ficha__numero" aria-hidden="true">
          {String(i + 1).padStart(2, '0')}
        </span>
        <h3 className="f-ficha__nombre">{s.nombre}</h3>
      </div>
      <dl className="f-ficha__datos">
        <div className="f-ficha__fila">
          <dt>
            <MapPin size={20} strokeWidth={2.25} aria-hidden="true" />
            <span className="visually-hidden">Dirección</span>
          </dt>
          <dd>
            <span className="f-ficha__principal">{s.direccion}</span>
            {s.referencia && <span className="f-ficha__secundario">{s.referencia}</span>}
            {s.distrito && <span className="f-ficha__secundario">{s.distrito}</span>}
          </dd>
        </div>
        {s.telefono && (
          <div className="f-ficha__fila">
            <dt>
              <Phone size={20} strokeWidth={2.25} aria-hidden="true" />
              <span className="visually-hidden">Teléfono</span>
            </dt>
            <dd>
              <a className="f-ficha__enlace" href={enlaceTel(s.telefono)}>
                {s.telefono.visible}
              </a>
            </dd>
          </div>
        )}
        {s.correo && (
          <div className="f-ficha__fila">
            <dt>
              <Mail size={20} strokeWidth={2.25} aria-hidden="true" />
              <span className="visually-hidden">Correo</span>
            </dt>
            <dd>
              <a className="f-ficha__enlace f-ficha__correo" href={`mailto:${s.correo}`}>
                {s.correo}
              </a>
            </dd>
          </div>
        )}
        {s.horario.length > 0 && (
          <div className="f-ficha__fila">
            <dt>
              <Clock size={20} strokeWidth={2.25} aria-hidden="true" />
              <span className="visually-hidden">Horario de atención</span>
            </dt>
            <dd>
              <ul className="f-ficha__horario">
                {s.horario.map((h, j) => (
                  <li key={j}>
                    <span className="f-ficha__dias">{h.dias}</span> <span>{h.horas}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
      {s.nota && <p className="f-ficha__nota">{s.nota}</p>}
      <p className="f-ficha__acciones">
        <a className="f-enlace f-enlace--chico" href={enlaceMapa(s)} target="_blank" rel="noreferrer">
          <Navigation size={16} aria-hidden="true" /> Cómo llegar
          <span className="visually-hidden"> a {s.nombre} (se abre en otra pestaña)</span>
        </a>
        {s.mapaEmbedUrl && (
          <button type="button" className="f-enlace f-enlace--chico f-ficha__boton" onClick={() => alVerEnMapa(s.id)}>
            <IconoMapa size={16} aria-hidden="true" /> Ver en el mapa
            <span className="visually-hidden"> de esta página: {s.nombre}</span>
          </button>
        )}
      </p>
    </li>
  )
}
