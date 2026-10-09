import { useState } from 'react'
import { MapPin, Navigation } from 'lucide-react'
import { obtenerSedes } from '../../api/servicios'
import type { Sede } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import { enlaceMapa } from '../../lib/formato'
import { Revelar } from '../movimiento'

const proveedor = (url: string) => (url.includes('openstreetmap.org') ? 'OpenStreetMap' : 'Google Maps')

// Mapa de las sedes. No se carga nada de terceros hasta que la persona pulsa «Mostrar el mapa»:
// así la página no pierde velocidad y Google no recibe la visita sin permiso.
export default function MapaSedes({ seleccion, alElegir }: { seleccion: string | null; alElegir: (id: string) => void }) {
  const r = useRecurso('sedes', obtenerSedes)

  return (
    <section className="f-seccion f-niveles f-mapa" id="mapa" aria-labelledby="f-mapa-titulo">
      <div className="f-seccion__interior">
        <h2 className="f-titulo f-titulo--blanco" id="f-mapa-titulo">
          <Revelar como="span" efecto="titulo" className="f-barrido">
            Ubícanos
          </Revelar>
        </h2>
        {r.estado === 'cargando' && <Cargando que="el mapa" lineas={3} conTitulo={false} className="f-cargando--claro" />}
        {r.estado === 'error' && <ErrorCarga que="el mapa" reintentar={r.reintentar} className="f-error--claro" />}
        {r.estado === 'listo' && r.datos.length === 0 && (
          <p className="f-vacio f-vacio--claro">Las ubicaciones de las sedes se publicarán pronto.</p>
        )}
        {r.estado === 'listo' && r.datos.length > 0 && (
          <Mapa sedes={r.datos} seleccion={seleccion} alElegir={alElegir} />
        )}
      </div>
    </section>
  )
}

function Mapa({ sedes, seleccion, alElegir }: { sedes: Sede[]; seleccion: string | null; alElegir: (id: string) => void }) {
  // El permiso vale para toda la visita: al cambiar de sede, el mapa nuevo carga solo.
  const [permitido, setPermitido] = useState(false)
  const sede = sedes.find((s) => s.id === seleccion) ?? sedes[0]!

  return (
    <div className={`f-mapa__cuerpo${sedes.length > 1 ? '' : ' f-mapa__cuerpo--una'}`}>
      {sedes.length > 1 && (
        <ul className="f-mapa__sedes" aria-label="Elige una sede">
          {sedes.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                id={`f-mapa-sede-${s.id}`}
                className="f-mapa__sede"
                aria-pressed={s.id === sede.id}
                onClick={() => alElegir(s.id)}
              >
                <span className="f-mapa__sede-texto">{s.nombre}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="f-mapa__marco">
        {sede.mapaEmbedUrl && permitido ? (
          <iframe
            key={sede.mapaEmbedUrl}
            className="f-mapa__iframe"
            src={sede.mapaEmbedUrl}
            title={`Mapa de ${sede.nombre}, ${proveedor(sede.mapaEmbedUrl)}`}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        ) : (
          <div className="f-mapa__aviso">
            <div className="f-mapa__franjas" aria-hidden="true">
              <span />
              <span />
            </div>
            <MapPin className="f-mapa__pin" size={44} strokeWidth={2.25} aria-hidden="true" />
            <h3 className="f-mapa__nombre">{sede.nombre}</h3>
            <p className="f-mapa__direccion">{[sede.direccion, sede.distrito].filter(Boolean).join(' · ')}</p>
            {sede.mapaEmbedUrl ? (
              <>
                <button type="button" className="f-boton f-boton--oro f-mapa__mostrar" onClick={() => setPermitido(true)}>
                  <span className="f-boton__texto">Mostrar el mapa</span>
                </button>
                <p className="f-mapa__privacidad">
                  El mapa lo muestra {proveedor(sede.mapaEmbedUrl)} y se carga solo si lo pides. Al mostrarlo,{' '}
                  {proveedor(sede.mapaEmbedUrl) === 'Google Maps' ? 'Google' : 'OpenStreetMap'} puede guardar cookies en tu
                  navegador.
                </p>
              </>
            ) : (
              <p className="f-mapa__privacidad">Esta sede todavía no tiene un mapa en la página.</p>
            )}
          </div>
        )}
      </div>

      <p className="f-mapa__llegar">
        <a className="f-enlace f-enlace--blanco" href={enlaceMapa(sede)} target="_blank" rel="noreferrer">
          <Navigation size={20} aria-hidden="true" /> Cómo llegar a {sede.nombre}
          <span className="visually-hidden"> (se abre en otra pestaña)</span>
        </a>
      </p>
    </div>
  )
}
