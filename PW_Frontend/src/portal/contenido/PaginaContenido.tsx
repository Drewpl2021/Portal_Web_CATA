import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ErrorDatos } from '../../api/servicios'
import type { PaginaContenido as Pagina } from '../../api/tipos'
import { useRecurso } from '../../hooks/useRecurso'
import { useRutaInterna } from '../../sitio/BaseRuta'
import type { GrupoMenu } from '../../sitio/mapa'
import CabeceraPagina, { CabeceraCargando, CabeceraError } from '../secciones/CabeceraPagina'
import Bloques from './Bloques'

interface Props {
  /** Página padre en las migas: { etiqueta: 'Nosotros', ruta: '/nosotros' }. */
  padre: { etiqueta: string; ruta: string }
  /** Grupo del mapa del sitio al que pertenece la página (sus hermanas forman el menú lateral). */
  grupo: GrupoMenu
  /** Ruta de esta página dentro del sitio: '/nosotros/himno'. */
  ruta: string
  /** Clave del recurso para useRecurso. */
  clave: string
  cargar: () => Promise<Pagina>
  /** Contenido propio de la página, después de los bloques (p. ej. el personal docente con su filtro). */
  extra?: ReactNode
}

// Layout reutilizable para subpáginas de contenido: cabecera con el grupo y la posición, migas,
// bloques de contenido con el menú del grupo a un lado, y anterior/siguiente al final.
// Para una página nueva basta con añadirla al mapa del sitio y servir sus bloques desde la API.
export default function PaginaContenido({ padre, grupo, ruta, clave, cargar, extra }: Props) {
  const r = useRecurso(clave, cargar)
  const indice = grupo.enlaces.findIndex((e) => e.ruta === ruta)
  const actual = grupo.enlaces[indice]!

  if (r.estado === 'cargando') return <CabeceraCargando />
  if (r.estado === 'error') {
    if (r.error instanceof ErrorDatos && r.error.noEncontrado) {
      return (
        <CabeceraPagina
          idTitulo="f-contenido-titulo"
          titulo="Página no encontrada"
          bajada={`Puede que el enlace esté mal escrito. Vuelve a ${padre.etiqueta} para ver todas sus páginas.`}
          acciones={[{ href: padre.ruta, interna: true, etiqueta: padre.etiqueta, icono: <ArrowLeft size={20} strokeWidth={2.5} aria-hidden="true" />, estilo: 'oro' }]}
          placa={null}
          figura={null}
        />
      )
    }
    return <CabeceraError titulo={actual.etiqueta} reintentar={r.reintentar} />
  }

  const p = r.datos
  return (
    <>
      <CabeceraPagina
        idTitulo="f-contenido-titulo"
        titulo={p.titulo}
        bajada={p.bajada}
        acciones={[]}
        placa={{ rotulo: grupo.titulo, valor: `${indice + 1}/${grupo.enlaces.length}` }}
        figura={null}
        compacta
      />
      <Migas padre={padre} grupo={grupo.titulo} actual={p.titulo} />

      <section className="f-seccion f-contenido" aria-label={`Contenido de ${p.titulo}`}>
        <div className="f-seccion__interior f-contenido__rejilla">
          <div className="f-contenido__cuerpo">
            {p.bloques.length === 0 && !extra ? (
              <p className="f-vacio">El contenido de esta página se publicará pronto.</p>
            ) : (
              <Bloques bloques={p.bloques} />
            )}
            {extra}
          </div>
          <MenuGrupo grupo={grupo} ruta={ruta} />
        </div>
      </section>

      <AnteriorSiguiente grupo={grupo} indice={indice} />
    </>
  )
}

function Migas({ padre, grupo, actual }: { padre: { etiqueta: string; ruta: string }; grupo: string; actual: string }) {
  const interna = useRutaInterna()
  return (
    <nav className="f-indice f-migas" aria-label="Ruta de navegación">
      <ol className="f-indice__lista f-migas__lista">
        <li>
          <Link className="f-indice__enlace" to={interna('/')}>
            Inicio
          </Link>
        </li>
        <li>
          <Link className="f-indice__enlace" to={interna(padre.ruta)}>
            {padre.etiqueta}
          </Link>
        </li>
        <li className="f-migas__grupo">{grupo}</li>
        <li>
          <span className="f-migas__actual" aria-current="page">
            {actual}
          </span>
        </li>
      </ol>
    </nav>
  )
}

function MenuGrupo({ grupo, ruta }: { grupo: GrupoMenu; ruta: string }) {
  const interna = useRutaInterna()
  return (
    <nav className="f-lateral" aria-labelledby="f-lateral-titulo">
      <h2 className="f-lateral__titulo" id="f-lateral-titulo">
        {grupo.titulo}
      </h2>
      <ul className="f-lateral__lista">
        {grupo.enlaces.map((e) => (
          <li key={e.ruta}>
            <Link className="f-lateral__enlace" to={interna(e.ruta)} aria-current={e.ruta === ruta ? 'page' : undefined}>
              {e.etiqueta}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function AnteriorSiguiente({ grupo, indice }: { grupo: GrupoMenu; indice: number }) {
  const interna = useRutaInterna()
  const anterior = grupo.enlaces[indice - 1]
  const siguiente = grupo.enlaces[indice + 1]
  if (!anterior && !siguiente) return null
  return (
    <nav className="f-seccion f-pasar" aria-label={`Más páginas de ${grupo.titulo}`}>
      <div className="f-seccion__interior f-pasar__interior">
        {anterior ? (
          <Link className="f-pasar__enlace f-pasar__enlace--anterior" to={interna(anterior.ruta)}>
            <span className="f-pasar__rotulo">
              <ArrowLeft size={18} strokeWidth={2.5} aria-hidden="true" /> Anterior
            </span>
            <span className="f-pasar__nombre">{anterior.etiqueta}</span>
          </Link>
        ) : (
          <span />
        )}
        {siguiente && (
          <Link className="f-pasar__enlace f-pasar__enlace--siguiente" to={interna(siguiente.ruta)}>
            <span className="f-pasar__rotulo">
              Siguiente <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
            </span>
            <span className="f-pasar__nombre">{siguiente.etiqueta}</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
