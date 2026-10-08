import { ArrowUpRight } from 'lucide-react'
import { obtenerNoticias, obtenerSitio } from '../api/servicios'
import { Cargando, ErrorCarga } from '../components/EstadoSeccion'
import Imagen from '../components/Imagen'
import { useRecurso } from '../hooks/useRecurso'
import { atributosExterno, enlaceTel, enlaceWhatsapp, fechaLegible } from '../lib/formato'

const LIMITE = 6

export default function Noticias() {
  const r = useRecurso('noticias', () => obtenerNoticias(LIMITE))
  const sitio = useRecurso('sitio', obtenerSitio)

  return (
    <section className="seccion noticias" id="noticias" aria-labelledby="noticias-titulo" aria-busy={r.estado === 'cargando'}>
      <h2 className="titulo-rotulo" id="noticias-titulo">
        Noticias y comunicados
      </h2>

      {r.estado === 'cargando' && <Cargando que="las noticias" lineas={4} conTitulo={false} />}
      {r.estado === 'error' && <ErrorCarga que="las noticias" reintentar={r.reintentar} />}

      {r.estado === 'listo' && r.datos.noticias.length === 0 && (
        <div className="noticias__vacio">
          <p>Todavía no hay noticias publicadas.</p>
          {sitio.estado === 'listo' && (
            <p>
              Si necesitas algo urgente, llama al <a href={enlaceTel(sitio.datos.telefono)}>{sitio.datos.telefono.visible}</a> o
              escribe por{' '}
              <a href={enlaceWhatsapp(sitio.datos.whatsapp)} target="_blank" rel="noreferrer">
                WhatsApp<span className="visually-hidden"> (se abre en otra pestaña)</span>
              </a>
              .
            </p>
          )}
        </div>
      )}

      {r.estado === 'listo' && r.datos.noticias.length > 0 && (
        <ol className="noticias__lista">
          {r.datos.noticias.map((n) => (
            <li className={`noticia${n.foto ? ' noticia--con-foto' : ''}`} key={n.id}>
              <article aria-labelledby={`noticia-${n.id}`}>
                <div className="noticia__texto">
                  <h3 className="noticia__titulo" id={`noticia-${n.id}`}>
                    {n.titulo}
                  </h3>
                  <p className="noticia__meta">
                    <span className={`noticia__tipo noticia__tipo--${n.tipo}`}>
                      {n.tipo === 'comunicado' ? 'Comunicado' : 'Noticia'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={n.fecha}>{fechaLegible(n.fecha)}</time>
                  </p>
                  {n.resumen && <p className="noticia__resumen">{n.resumen}</p>}
                  {n.enlace && (
                    <a className="enlace-flecha" href={n.enlace.url} {...atributosExterno(n.enlace.externo)}>
                      {n.enlace.etiqueta}
                      {n.enlace.externo && (
                        <>
                          <ArrowUpRight size={18} aria-hidden="true" />
                          <span className="visually-hidden"> (se abre en otra pestaña)</span>
                        </>
                      )}
                    </a>
                  )}
                </div>
                <Imagen imagen={n.foto} proporcion="3 / 2" className="noticia__foto" sizes="(min-width: 760px) 280px, 100vw" />
              </article>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
