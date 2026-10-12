import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { obtenerContacto, obtenerSitio } from '../../api/servicios'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import { useMapa } from '../../sitio/mapa'
import { Revelar } from '../movimiento'
import { MARCAS } from '../redes'

// Redes del colegio (de /v1/sitio, las mismas de la barra flotante y el pie) y su correo general
// (de /v1/contacto), como placas marinas inclinadas con el nombre de la red en tipografía ancha.
const CORREO = 'Correo'

export default function RedesSociales() {
  const c = useRecurso('contacto', obtenerContacto)
  const s = useRecurso('sitio', obtenerSitio)
  const { titulos } = useMapa()
  const reintentar = () => {
    if (c.estado === 'error') c.reintentar()
    if (s.estado === 'error') s.reintentar()
  }
  const r =
    c.estado === 'error' || s.estado === 'error'
      ? ({ estado: 'error', reintentar } as const)
      : c.estado === 'listo' && s.estado === 'listo'
        ? ({ estado: 'listo', datos: { redes: s.datos.redes, correo: c.datos.correo } } as const)
        : ({ estado: 'cargando' } as const)
  const vacio = r.estado === 'listo' && r.datos.redes.length === 0 && !r.datos.correo
  // El nombre más largo de la lista: con él se calcula un tamaño de letra que entra en todas las placas.
  const letras =
    r.estado === 'listo'
      ? Math.max(...r.datos.redes.map((red) => MARCAS[red.red].nombre.length), r.datos.correo ? CORREO.length : 0)
      : 0

  return (
    <section className="f-seccion f-redes" id="redes" aria-labelledby="f-redes-titulo">
      <div className="f-seccion__interior">
        <h2 className="f-titulo" id="f-redes-titulo">
          <Revelar como="span" efecto="titulo" className="f-barrido">
            {titulos.contacto.redes}
          </Revelar>
        </h2>
        {r.estado === 'cargando' && <Cargando que="las redes del colegio" lineas={3} conTitulo={false} />}
        {r.estado === 'error' && <ErrorCarga que="las redes del colegio" reintentar={r.reintentar} />}
        {vacio && <p className="f-vacio">Las redes del colegio se publicarán pronto.</p>}
        {r.estado === 'listo' && !vacio && (
          <Revelar como="ul" efecto="escalonado" className="f-redes__lista">
            {r.datos.redes.map((red, i) => (
              <li key={red.red} style={{ '--i': i, '--letras': letras } as CSSProperties}>
                <a className="f-red" href={red.url} target="_blank" rel="noreferrer">
                  <span className="f-red__nombre">{MARCAS[red.red].nombre}</span>
                  <span className="f-red__cuenta">{red.cuenta}</span>
                  {red.aclaracion && <span className="f-red__aclaracion">{red.aclaracion}</span>}
                  <ArrowUpRight className="f-red__flecha" size={26} strokeWidth={2.5} aria-hidden="true" />
                  <span className="visually-hidden"> (se abre en otra pestaña)</span>
                </a>
              </li>
            ))}
            {r.datos.correo && (
              <li style={{ '--i': r.datos.redes.length, '--letras': letras } as CSSProperties}>
                <a className="f-red f-red--correo" href={`mailto:${r.datos.correo}`}>
                  <span className="f-red__nombre">{CORREO}</span>
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
