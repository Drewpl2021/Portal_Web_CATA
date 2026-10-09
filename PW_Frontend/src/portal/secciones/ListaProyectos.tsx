import type { Proyectos } from '../../api/tipos'
import { Revelar } from '../movimiento'
import Filtro, { useFiltroUrl } from './Filtro'
import TarjetaProyecto from './TarjetaProyecto'

const contar = (n: number) => (n === 1 ? '1 proyecto' : `${n} proyectos`)

// Lista de proyectos con filtro por categoría (?categoria=…). Solo se ofrecen categorías con proyectos.
export default function ListaProyectos({ datos }: { datos: Proyectos }) {
  const nombreDe = (id: string) => datos.categorias.find((c) => c.id === id)?.nombre ?? null
  const opciones = datos.categorias
    .map((c) => ({ id: c.id, nombre: c.nombre, n: datos.proyectos.filter((p) => p.categoria === c.id).length }))
    .filter((o) => o.n > 0)
  const { activa, elegir } = useFiltroUrl('categoria', opciones)
  const visibles = activa ? datos.proyectos.filter((p) => p.categoria === activa) : datos.proyectos

  return (
    <>
      <Filtro
        etiqueta="Filtrar por categoría"
        opciones={opciones}
        activa={activa}
        alElegir={elegir}
        total={datos.proyectos.length}
        resultado={activa ? `${contar(visibles.length)} en ${nombreDe(activa)}` : contar(visibles.length)}
      />
      <Revelar como="ul" efecto="escalonado" className="f-proyectos__lista">
        {visibles.map((p, i) => (
          <TarjetaProyecto key={p.id} proyecto={p} categoria={nombreDe(p.categoria)} i={i} />
        ))}
      </Revelar>
    </>
  )
}
