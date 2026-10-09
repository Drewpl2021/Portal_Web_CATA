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
              </div>
              <Imagen imagen={l.foto} proporcion="3 / 2" className="f-podio__foto" sizes="(min-width: 900px) 28vw, 90vw" />
            </li>
          ))}
        </Revelar>
      </div>
    </section>
  )
}

function Lista({ datos }: { datos: DatosLogros }) {
  const logros = ordenar(datos.logros)
  const opcionesCategoria = (Object.keys(CATEGORIA_LOGRO) as CategoriaLogro[])
    .map((id) => ({ id, nombre: CATEGORIA_LOGRO[id], n: logros.filter((l) => l.categoria === id).length }))
    .filter((o) => o.n > 0)
  const anios = [...new Set(logros.map((l) => l.anio).filter((a): a is number => a !== null))].sort((a, b) => b - a)
  const opcionesAnio = anios.map((a) => ({ id: String(a), nombre: String(a), n: logros.filter((l) => l.anio === a).length }))

  const categoria = useFiltroUrl('categoria', opcionesCategoria)
  const anio = useFiltroUrl('anio', opcionesAnio)
  const visibles = logros.filter(
    (l) => (!categoria.activa || l.categoria === categoria.activa) && (!anio.activa || String(l.anio) === anio.activa),
  )
  const filtros = [categoria.activa && CATEGORIA_LOGRO[categoria.activa as CategoriaLogro], anio.activa && `de ${anio.activa}`].filter(Boolean)
  const resultado = `${contar(visibles.length)}${filtros.length ? ` · ${filtros.join(' ')}` : ''}`

  return (
    <>
      <div className="f-filtros">
        <Filtro etiqueta="Filtrar por categoría" opciones={opcionesCategoria} activa={categoria.activa} alElegir={categoria.elegir} total={logros.length} />
        <Filtro etiqueta="Filtrar por año" opciones={opcionesAnio} activa={anio.activa} alElegir={anio.elegir} total={logros.length} />
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
                anio.elegir(null)
              }}
            >
              Ver todos los logros
            </button>
          </p>
        </div>
      ) : (
        <Revelar como="ul" efecto="escalonado" className="f-logros__lista">
          {visibles.map((l, i) => (
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
                <h3 className="f-logro__titulo">{l.titulo}</h3>
                {l.descripcion && <p className="f-logro__descripcion">{l.descripcion}</p>}
              </div>
            </li>
          ))}
        </Revelar>
      )}
    </>
  )
}
