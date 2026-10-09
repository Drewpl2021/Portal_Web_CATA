import { obtenerDocentes } from '../../api/servicios'
import type { Docentes } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import Filtro, { useFiltroUrl } from '../secciones/Filtro'
import { TarjetasPersonas } from './Bloques'

const contar = (n: number) => (n === 1 ? '1 docente' : `${n} docentes`)

// Personal docente agrupado por nivel, con el filtro de Proyectos (?nivel=…). Con «Todos», cada nivel
// es una sección con su encabezado; con un nivel elegido, solo esa sección.
export default function EquipoDocente() {
  const r = useRecurso('docentes', obtenerDocentes)

  if (r.estado === 'cargando') return <Cargando que="el personal docente" lineas={4} conTitulo={false} />
  if (r.estado === 'error') return <ErrorCarga que="el personal docente" reintentar={r.reintentar} />
  if (r.datos.docentes.length === 0) return <p className="f-vacio">La lista del personal docente se publicará pronto.</p>
  return <Equipo datos={r.datos} />
}

function Equipo({ datos }: { datos: Docentes }) {
  const grupos = datos.niveles
    .map((n) => ({ ...n, docentes: datos.docentes.filter((d) => d.nivel === n.id) }))
    .filter((g) => g.docentes.length > 0)
  const opciones = grupos.map((g) => ({ id: g.id, nombre: g.nombre, n: g.docentes.length }))
  const { activa, elegir } = useFiltroUrl('nivel', opciones)
  const visibles = activa ? grupos.filter((g) => g.id === activa) : grupos
  const nombre = grupos.find((g) => g.id === activa)?.nombre

  return (
    <div className="f-bloque f-equipo">
      <Filtro
        etiqueta="Filtrar por nivel"
        opciones={opciones}
        activa={activa}
        alElegir={elegir}
        total={datos.docentes.length}
        resultado={activa ? `${contar(visibles[0]!.docentes.length)} de ${nombre}` : contar(datos.docentes.length)}
      />
      {visibles.map((g) => (
        <section key={g.id} className="f-grupo-personas" aria-labelledby={`f-nivel-${g.id}`}>
          <h2 className="f-grupo-personas__titulo" id={`f-nivel-${g.id}`}>
            <span>{g.nombre}</span>
            <span className="f-grupo-personas__n">{contar(g.docentes.length)}</span>
          </h2>
          <TarjetasPersonas personas={g.docentes} />
        </section>
      ))}
    </div>
  )
}
