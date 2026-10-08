import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { obtenerNoticias, obtenerSitio } from '../../api/servicios'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import Imagen from '../../components/Imagen'
import { useRecurso } from '../../hooks/useRecurso'
import { atributosExterno, enlaceTel, enlaceWhatsapp, fechaLegible } from '../../lib/formato'
import { Revelar } from '../movimiento'

const LIMITE = 6

export default function NoticiasFinal() {
  const r = useRecurso('noticias', () => obtenerNoticias(LIMITE))
  const sitio = useRecurso('sitio', obtenerSitio)

  return (
    <section className="f-seccion f-noticias" aria-labelledby="f-noticias-titulo">
      <div className="f-seccion__interior">
        <h2 className="f-titulo" id="f-noticias-titulo">
          <Revelar como="span" efecto="titulo" className="f-barrido">
            Noticias y comunicados
          </Revelar>
        </h2>
        {r.estado === 'cargando' && <Cargando que="las noticias" lineas={4} conTitulo={false} />}
        {r.estado === 'error' && <ErrorCarga que="las noticias" reintentar={r.reintentar} />}
        {r.estado === 'listo' && r.datos.noticias.length === 0 && (
          <div className="f-vacio">
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
          <Revelar como="ul" efecto="escalonado" className="f-noticias__lista">
            {r.datos.noticias.map((n, i) => (
              <li key={n.id} className={`f-tarjeta f-noticia${n.foto ? '' : ' f-noticia--placa'}`} style={{ '--i': i } as CSSProperties}>
                <article aria-labelledby={`f-noticia-${n.id}`}>
                  <Imagen imagen={n.foto} proporcion="3 / 2" className="f-noticia__foto" sizes="(min-width: 900px) 33vw, 100vw" />
                  <div className="f-noticia__texto">
                    <h3 className="f-noticia__titulo" id={`f-noticia-${n.id}`}>
                      {n.titulo}
                    </h3>
                    <p className="f-noticia__meta">
                      <span className={n.tipo === 'comunicado' ? 'f-noticia__tipo' : undefined}>
                        {n.tipo === 'comunicado' ? 'Comunicado' : 'Noticia'}
                      </span>
                      <span aria-hidden="true"> · </span>
                      <time dateTime={n.fecha}>{fechaLegible(n.fecha)}</time>
                    </p>
                    {n.resumen && <p className="f-noticia__resumen">{n.resumen}</p>}
                    {n.enlace && (
                      <a className="f-enlace f-enlace--chico" href={n.enlace.url} {...atributosExterno(n.enlace.externo)}>
                        {n.enlace.etiqueta}
                        {n.enlace.externo && (
                          <>
                            <ArrowUpRight size={16} aria-hidden="true" />
                            <span className="visually-hidden"> (se abre en otra pestaña)</span>
                          </>
                        )}
                      </a>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </Revelar>
        )}
      </div>
    </section>
  )
}
