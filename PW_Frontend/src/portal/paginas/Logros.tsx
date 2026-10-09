import type { CSSProperties } from 'react'
import { ArrowDown, Award } from 'lucide-react'
import { obtenerLogros } from '../../api/servicios'
import type { CategoriaLogro, Logro, Logros as DatosLogros } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import Imagen from '../../components/Imagen'
import { useRecurso } from '../../hooks/useRecurso'
import { Revelar } from '../movimiento'
import CabeceraPagina, { CabeceraCargando, CabeceraError } from '../secciones/CabeceraPagina'
import Cierre from '../secciones/Cierre'
import { FranjaCifras } from '../secciones/Cifras'
import Filtro, { useFiltroUrl } from '../secciones/Filtro'

export const CATEGORIA_LOGRO: Record<CategoriaLogro, string> = {
  academico: 'Académico',
  deportivo: 'Deportivo',
  artistico: 'Artístico',
  institucional: 'Institucional',
}

const contar = (n: number) => (n === 1 ? '1 logro' : `${n} logros`)

// Del más reciente al más antiguo; los que no tienen año, al final, en el orden de la API.
const ordenar = (logros: Logro[]) =>
  logros
    .map((l, i) => ({ l, i }))
    .sort((a, b) => (b.l.anio ?? -Infinity) - (a.l.anio ?? -Infinity) || a.i - b.i)
    .map((x) => x.l)

// Logros: cabecera, cifras, destacados y la lista con filtros por categoría y año (en la dirección).
export default function Logros() {
  const r = useRecurso('logros', obtenerLogros)

  return (
    <>
      {r.estado === 'cargando' && <CabeceraCargando />}
      {r.estado === 'error' && <CabeceraError titulo="Logros" reintentar={r.reintentar} />}
      {r.estado === 'listo' && (
        <>
          <CabeceraPagina
            idTitulo="f-logros-titulo"
            titulo={r.datos.titulo}
            bajada={r.datos.bajada}
            acciones={
              r.datos.logros.length > 0
                ? [{ href: '#lista', etiqueta: 'Ver los logros', icono: <ArrowDown size={20} strokeWidth={2.5} aria-hidden="true" />, estilo: 'oro' }]
                : []
            }
            placa={
              r.datos.logros.length > 0
                ? { rotulo: r.datos.logros.length === 1 ? 'Logro' : 'Logros', valor: String(r.datos.logros.length).padStart(2, '0') }
                : null
            }
            figura={null}
          />
          {r.datos.cifras.length > 0 && <FranjaCifras cifras={r.datos.cifras} etiqueta="Logros en cifras" />}
          <Destacados logros={ordenar(r.datos.logros.filter((l) => l.destacado))} />
        </>
      )}

      <section className="f-seccion f-logros" id="lista" aria-labelledby="f-lista-logros">
        <div className="f-seccion__interior">
          <h2 className="f-titulo" id="f-lista-logros">
            <Revelar como="span" efecto="titulo" className="f-barrido">
              Todos los logros
            </Revelar>
          </h2>
          {r.estado === 'cargando' && <Cargando que="los logros" lineas={5} conTitulo={false} />}
          {r.estado === 'error' && <ErrorCarga que="los logros" reintentar={r.reintentar} />}
          {r.estado === 'listo' && r.datos.logros.length === 0 && (
            <p className="f-vacio">Los logros del colegio se publicarán pronto.</p>
          )}
          {r.estado === 'listo' && r.datos.logros.length > 0 && <Lista datos={r.datos} />}
        </div>
      </section>

      <Cierre />
    </>
  )
}

// Fuente del dato (con enlace si es público) y aclaración visible si algo está por confirmar.
function FuenteYAclaracion({ logro: l, claro = false }: { logro: Logro; claro?: boolean }) {
  if (!l.fuente && !l.aclaracion) return null
  return (
    <div className={`f-logro__pie${claro ? ' f-logro__pie--claro' : ''}`}>
      {l.aclaracion && <p className="f-logro__aclaracion">{l.aclaracion}</p>}
      {l.fuente && (
        <p className="f-logro__fuente">
          Fuente:{' '}
          {l.fuente.url ? (
            <a href={l.fuente.url} target="_blank" rel="noreferrer">
              {l.fuente.etiqueta}
              <span className="visually-hidden"> (se abre en otra pestaña)</span>
            </a>
          ) : (
            l.fuente.etiqueta
          )}
        </p>
      )}
    </div>
  )
}

function Destacados({ logros }: { logros: Logro[] }) {
  if (logros.length === 0) return null
  return (
    <section className="f-seccion f-destacados-logros" aria-labelledby="f-destacados-titulo">
      <div className="f-seccion__interior">
        <h2 className="f-titulo" id="f-destacados-titulo">
          <Revelar como="span" efecto="titulo" className="f-barrido">
            Destacados
          </Revelar>
        </h2>
        <Revelar como="ul" efecto="carriles" className="f-podio">
          {logros.map((l, i) => (
            <li key={l.id} className={`f-podio__item${l.foto ? ' f-podio__item--foto' : ''}`} style={{ '--i': i } as CSSProperties}>
              <div className="f-podio__texto">
                <p className="f-podio__meta">
                  <Award size={20} strokeWidth={2.5} aria-hidden="true" />
                  {[CATEGORIA_LOGRO[l.categoria], l.anio, l.nivel].filter(Boolean).join(' · ')}
                </p>
                <h3 className="f-podio__titulo">{l.titulo}</h3>
                {l.descripcion && <p className="f-podio__descripcion">{l.descripcion}</p>}
                <FuenteYAclaracion logro={l} claro />
              </div>
              <Imagen imagen={l.foto} proporcion="3 / 2" className="f-podio__foto" sizes="(min-width: 900px) 28vw, 90vw" />
            </li>
          ))}
        </Revelar>
      </div>
    </section>
  )
}

// Década de un año: 2007 → 2000. Los logros sin año van aparte, al final.
const decadaDe = (anio: number | null) => (anio === null ? null : Math.floor(anio / 10) * 10)
const nombreDecada = (d: number) => `${d}–${d + 9}`

function Lista({ datos }: { datos: DatosLogros }) {
  const logros = ordenar(datos.logros)
  const opcionesCategoria = (Object.keys(CATEGORIA_LOGRO) as CategoriaLogro[])
    .map((id) => ({ id, nombre: CATEGORIA_LOGRO[id], n: logros.filter((l) => l.categoria === id).length }))
    .filter((o) => o.n > 0)
  const decadas = [...new Set(logros.map((l) => decadaDe(l.anio)).filter((d): d is number => d !== null))].sort((a, b) => b - a)
  const opcionesDecada = decadas.map((d) => ({ id: String(d), nombre: nombreDecada(d), n: logros.filter((l) => decadaDe(l.anio) === d).length }))

  const categoria = useFiltroUrl('categoria', opcionesCategoria)
  const decada = useFiltroUrl('decada', opcionesDecada)
  const visibles = logros.filter(
    (l) => (!categoria.activa || l.categoria === categoria.activa) && (!decada.activa || String(decadaDe(l.anio)) === decada.activa),
  )
  const filtros = [
    categoria.activa && CATEGORIA_LOGRO[categoria.activa as CategoriaLogro],
    decada.activa && `de ${nombreDecada(Number(decada.activa))}`,
  ].filter(Boolean)
  const resultado = `${contar(visibles.length)}${filtros.length ? ` · ${filtros.join(' ')}` : ''}`

  // Agrupados por década, de la más reciente a la más antigua; los que no tienen año, al final.
  const grupos = [...decadas.map((d) => ({ id: String(d), nombre: nombreDecada(d), logros: visibles.filter((l) => decadaDe(l.anio) === d) })), { id: 'sin-anio', nombre: 'Sin año', logros: visibles.filter((l) => l.anio === null) }].filter(
    (g) => g.logros.length > 0,
  )

  return (
    <>
      <div className="f-filtros">
        <Filtro etiqueta="Filtrar por categoría" opciones={opcionesCategoria} activa={categoria.activa} alElegir={categoria.elegir} total={logros.length} />
        <Filtro etiqueta="Filtrar por década" opciones={opcionesDecada} activa={decada.activa} alElegir={decada.elegir} total={logros.length} />
      </div>
      <p className="f-filtro__resultado" aria-live="polite">
        {resultado}
      </p>
      {visibles.length === 0 ? (
        <div className="f-vacio">
          <p>No hay logros con esos filtros.</p>
          <p>
            <button
              type="button"
              className="f-enlace f-enlace--chico f-ficha__boton"
              onClick={() => {
                categoria.elegir(null)
                decada.elegir(null)
              }}
            >
              Ver todos los logros
            </button>
          </p>
        </div>
      ) : (
        grupos.map((g) => (
          <section key={g.id} className="f-grupo-personas f-decada" aria-labelledby={`f-decada-${g.id}`}>
            <h3 className="f-grupo-personas__titulo" id={`f-decada-${g.id}`}>
              <span>{g.nombre}</span>
              <span className="f-grupo-personas__n">{contar(g.logros.length)}</span>
            </h3>
            <Revelar como="ul" efecto="escalonado" className="f-logros__lista">
              {g.logros.map((l, i) => (
                <li key={l.id} className={`f-logro${l.foto ? ' f-logro--foto' : ''}`} style={{ '--i': i } as CSSProperties}>
                  <Imagen imagen={l.foto} proporcion="3 / 2" className="f-logro__foto" sizes="(min-width: 900px) 25vw, 92vw" />
                  <div className="f-logro__texto">
                    <div className="f-logro__cabeza">
                      {l.anio !== null && <span className="f-logro__anio">{l.anio}</span>}
                      <span className="f-meta">
                        <span className="f-meta__item f-meta__categoria">{CATEGORIA_LOGRO[l.categoria]}</span>
                        {l.nivel && <span className="f-meta__item">{l.nivel}</span>}
                      </span>
                    </div>
                    <h4 className="f-logro__titulo">{l.titulo}</h4>
                    {l.descripcion && <p className="f-logro__descripcion">{l.descripcion}</p>}
                    <FuenteYAclaracion logro={l} />
                  </div>
                </li>
              ))}
            </Revelar>
          </section>
        ))
      )}
    </>
  )
}
