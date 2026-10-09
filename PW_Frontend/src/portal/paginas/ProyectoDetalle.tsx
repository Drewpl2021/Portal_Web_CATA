import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { ErrorDatos, obtenerProyecto, obtenerProyectos } from '../../api/servicios'
import type { Proyecto, SeccionProyecto } from '../../api/tipos'
import Imagen from '../../components/Imagen'
import { useRecurso } from '../../hooks/useRecurso'
import { useRutaInterna } from '../../sitio/BaseRuta'
import { Revelar } from '../movimiento'
import CabeceraPagina, { CabeceraCargando, CabeceraError } from '../secciones/CabeceraPagina'
import Cierre from '../secciones/Cierre'
import TarjetaProyecto, { MetaProyecto } from '../secciones/TarjetaProyecto'

const volver = { href: '/proyectos', interna: true, etiqueta: 'Todos los proyectos', icono: <ArrowLeft size={20} strokeWidth={2.5} aria-hidden="true" />, estilo: 'blanco' as const }

// Detalle de un proyecto: cabecera con la foto, descripción, secciones (listas y ejes numerados),
// galería y otros proyectos. Un slug que no existe muestra «Proyecto no encontrado».
export default function ProyectoDetalle() {
  const { slug = '' } = useParams()
  const r = useRecurso(`proyecto:${slug}`, () => obtenerProyecto(slug))

  if (r.estado === 'cargando') return <CabeceraCargando />
  if (r.estado === 'error') {
    if (r.error instanceof ErrorDatos && r.error.noEncontrado) {
      return (
        <CabeceraPagina
          idTitulo="f-proyecto-titulo"
          titulo="Proyecto no encontrado"
          bajada="Puede que el enlace esté mal escrito o que el proyecto ya no esté publicado."
          acciones={[{ ...volver, estilo: 'oro' }]}
          placa={null}
          figura={null}
        />
      )
    }
    return <CabeceraError titulo="Proyecto" reintentar={r.reintentar} />
  }
  return <Detalle proyecto={r.datos} />
}

function Detalle({ proyecto: p }: { proyecto: Proyecto }) {
  return (
    <>
      <CabeceraPagina
        idTitulo="f-proyecto-titulo"
        titulo={p.titulo}
        bajada={p.lema}
        meta={<MetaProyecto categoria={p.categoriaNombre} proyecto={p} claro />}
        acciones={[volver]}
        placa={null}
        figura={null}
        foto={p.foto}
      />

      <section className="f-seccion f-proyecto-cuerpo" aria-labelledby="f-proyecto-sobre">
        <div className="f-seccion__interior">
          <h2 className="f-titulo f-titulo--chico" id="f-proyecto-sobre">
            <Revelar como="span" efecto="titulo" className="f-barrido">
              Sobre el proyecto
            </Revelar>
          </h2>
          <div className="f-proyecto-cuerpo__descripcion">
            {p.descripcion.map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </div>
          <Secciones secciones={p.secciones} />
        </div>
      </section>

      {p.galeria.length > 0 && (
        <section className="f-seccion f-galeria" aria-labelledby="f-galeria-titulo">
          <div className="f-seccion__interior">
            <h2 className="f-titulo f-titulo--chico" id="f-galeria-titulo">
              <Revelar como="span" efecto="titulo" className="f-barrido">
                Galería
              </Revelar>
            </h2>
            <Revelar como="ul" efecto="escalonado" className="f-galeria__lista">
              {p.galeria.map((foto, i) => (
                <li key={`${foto.url}-${i}`} style={{ '--i': i } as CSSProperties}>
                  <Imagen imagen={foto} proporcion="3 / 2" sizes="(min-width: 900px) 30vw, 92vw" />
                </li>
              ))}
            </Revelar>
          </div>
        </section>
      )}

      <OtrosProyectos actual={p.slug} />
      <Cierre />
    </>
  )
}

// Las listas seguidas se agrupan en una cuadrícula de placas; cada sección numerada ocupa todo el ancho.
function Secciones({ secciones }: { secciones: SeccionProyecto[] }) {
  const grupos: SeccionProyecto[][] = []
  for (const s of secciones) {
    const ultimo = grupos[grupos.length - 1]
    if (s.tipo === 'lista' && ultimo && ultimo[0]!.tipo === 'lista') ultimo.push(s)
    else grupos.push([s])
  }

  return (
    <>
      {grupos.map((grupo, g) =>
        grupo[0]!.tipo === 'numerada' ? (
          <div key={g} className="f-proyecto-cuerpo__numerada">
            <h2 className="f-subtitulo">{grupo[0]!.titulo}</h2>
            <Revelar como="ol" efecto="escalonado" className="f-pasos f-pasos--ejes">
              {grupo[0]!.items.map((item, i) => (
                <li key={i} className="f-paso" style={{ '--i': i } as CSSProperties}>
                  <span className="f-paso__numero" aria-hidden="true">
                    {i + 1}
                  </span>
                  {item.titulo ? (
                    <h3 className="f-paso__titulo">{item.titulo}</h3>
                  ) : null}
                  <p className={item.titulo ? 'f-paso__detalle' : 'f-paso__detalle f-paso__detalle--solo'}>{item.texto}</p>
                </li>
              ))}
            </Revelar>
          </div>
        ) : (
          <Revelar key={g} efecto="escalonado" className="f-listas">
            {grupo.map((lista, i) => (
              <div key={i} className="f-lista" style={{ '--i': i } as CSSProperties}>
                <h2 className="f-lista__titulo">{lista.titulo}</h2>
                <ul className="f-lista__items">
                  {lista.items.map((item, j) => (
                    <li key={j}>
                      <span className="f-lista__marca" aria-hidden="true">
                        <Check size={16} strokeWidth={3} />
                      </span>
                      <span>
                        {item.titulo && <strong>{item.titulo}: </strong>}
                        {item.texto}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Revelar>
        ),
      )}
    </>
  )
}

// Hasta tres proyectos más, de la misma lista. Si la lista no carga o no hay otros, la sección no aparece.
function OtrosProyectos({ actual }: { actual: string }) {
  const r = useRecurso('proyectos', obtenerProyectos)
  const interna = useRutaInterna()
  if (r.estado !== 'listo') return null
  const otros = r.datos.proyectos.filter((p) => p.slug !== actual).slice(0, 3)
  if (otros.length === 0) return null

  return (
    <section className="f-seccion f-otros" aria-labelledby="f-otros-titulo">
      <div className="f-seccion__interior">
        <div className="f-seccion__cabeza">
          <h2 className="f-titulo f-titulo--chico" id="f-otros-titulo">
            <Revelar como="span" efecto="titulo" className="f-barrido">
              Más proyectos
            </Revelar>
          </h2>
          <Link className="f-enlace" to={interna('/proyectos')}>
            Ver todos los proyectos
          </Link>
        </div>
        <Revelar como="ul" efecto="escalonado" className="f-proyectos__lista f-proyectos__lista--fijo">
          {otros.map((p, i) => (
            <TarjetaProyecto
              key={p.id}
              proyecto={p}
              categoria={r.datos.categorias.find((c) => c.id === p.categoria)?.nombre ?? null}
              i={i}
            />
          ))}
        </Revelar>
      </div>
    </section>
  )
}
