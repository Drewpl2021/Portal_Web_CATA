import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { obtenerContacto } from '../../api/servicios'
import type { Red } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import { Revelar } from '../movimiento'

const NOMBRE: Record<Red, string> = {
  facebook: 'Facebook',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  x: 'X',
  linkedin: 'LinkedIn',
}

// Redes del colegio (y su correo general, si lo hay) como placas marinas inclinadas con el nombre
// de la red en tipografía ancha. Sin logotipos de terceros: el nombre se lee igual.
export default function RedesSociales() {
  const r = useRecurso('contacto', obtenerContacto)
  const vacio = r.estado === 'listo' && r.datos.redes.length === 0 && !r.datos.correo

  return (
    <section className="f-seccion f-redes" id="redes" aria-labelledby="f-redes-titulo">
      <div className="f-seccion__interior">
        <h2 className="f-titulo" id="f-redes-titulo">
          <Revelar como="span" efecto="titulo" className="f-barrido">
            Síguenos
          </Revelar>
        </h2>
        {r.estado === 'cargando' && <Cargando que="las redes del colegio" lineas={3} conTitulo={false} />}
        {r.estado === 'error' && <ErrorCarga que="las redes del colegio" reintentar={r.reintentar} />}
        {vacio && <p className="f-vacio">Las redes del colegio se publicarán pronto.</p>}
        {r.estado === 'listo' && !vacio && (
          <Revelar como="ul" efecto="escalonado" className="f-redes__lista">
            {r.datos.redes.map((red, i) => (
              <li key={red.url} style={{ '--i': i } as CSSProperties}>
                <a className="f-red" href={red.url} target="_blank" rel="noreferrer">
                  <span className="f-red__nombre">{NOMBRE[red.red]}</span>
                  <span className="f-red__cuenta">{red.cuenta}</span>
                  <ArrowUpRight className="f-red__flecha" size={26} strokeWidth={2.5} aria-hidden="true" />
                  <span className="visually-hidden"> (se abre en otra pestaña)</span>
                </a>
              </li>
            ))}
            {r.datos.correo && (
              <li style={{ '--i': r.datos.redes.length } as CSSProperties}>
                <a className="f-red f-red--correo" href={`mailto:${r.datos.correo}`}>
                  <span className="f-red__nombre">Correo</span>
                  <span className="f-red__cuenta">{r.datos.correo}</span>
                  <ArrowUpRight className="f-red__flecha" size={26} strokeWidth={2.5} aria-hidden="true" />
                </a>
              </li>
            )}
          </Revelar>
        )}
      </div>
    </section>
  )
}
