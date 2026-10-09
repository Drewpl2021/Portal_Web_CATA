import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { EstadoProyecto, ProyectoResumen } from '../../api/tipos'
import Imagen from '../../components/Imagen'
import { fechaLegible } from '../../lib/formato'
import { useRutaInterna } from '../../sitio/BaseRuta'

export const ESTADO_PROYECTO: Record<EstadoProyecto, string> = {
  'en-curso': 'En curso',
  proximo: 'Próximamente',
  finalizado: 'Finalizado',
}

// Categoría, estado, niveles y fecha de un proyecto. Cada dato falta sin dejar hueco.
export function MetaProyecto({
  categoria,
  proyecto: p,
  claro = false,
}: {
  categoria: string | null
  proyecto: Pick<ProyectoResumen, 'estado' | 'niveles' | 'fecha'>
  claro?: boolean
}) {
  const hayAlgo = categoria || p.estado || p.niveles.length > 0 || p.fecha
  if (!hayAlgo) return null
  return (
    <ul className={`f-meta${claro ? ' f-meta--claro' : ''}`}>
      {categoria && <li className="f-meta__categoria">{categoria}</li>}
      {p.estado && <li className={`f-meta__estado f-meta__estado--${p.estado}`}>{ESTADO_PROYECTO[p.estado]}</li>}
      {p.niveles.length > 0 && <li>{p.niveles.join(' · ')}</li>}
      {p.fecha && (
        <li>
          <time dateTime={p.fecha}>{fechaLegible(p.fecha)}</time>
        </li>
      )}
    </ul>
  )
}

// Tarjeta de proyecto: foto con corte inclinado, datos y título que enlaza al detalle.
// El enlace es el título; su área se extiende a toda la tarjeta.
export default function TarjetaProyecto({
  proyecto: p,
  categoria,
  i,
  nivelTitulo = 3,
}: {
  proyecto: ProyectoResumen
  categoria: string | null
  i: number
  nivelTitulo?: 2 | 3
}) {
  const interna = useRutaInterna()
  const Titulo = nivelTitulo === 2 ? 'h2' : 'h3'
  return (
    <li className={`f-tarjeta f-proyecto${p.foto ? '' : ' f-proyecto--sin-foto'}`} style={{ '--i': i } as CSSProperties}>
      <Imagen imagen={p.foto} proporcion="3 / 2" className="f-proyecto__foto" sizes="(min-width: 900px) 40vw, 92vw" />
      <div className="f-proyecto__texto">
        <MetaProyecto categoria={categoria} proyecto={p} />
        <Titulo className="f-proyecto__titulo">
          <Link className="f-proyecto__enlace" to={interna(`/proyectos/${p.slug}`)}>
            {p.titulo}
          </Link>
        </Titulo>
        {p.lema && <p className="f-proyecto__lema">{p.lema}</p>}
        <p className="f-proyecto__resumen">{p.resumen}</p>
        <span className="f-proyecto__mas" aria-hidden="true">
          Ver proyecto <ArrowRight size={18} strokeWidth={2.5} />
        </span>
      </div>
    </li>
  )
}
