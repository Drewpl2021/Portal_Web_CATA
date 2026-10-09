import { ArrowDown, MessageCircle } from 'lucide-react'
import { obtenerCabeceraMatricula } from '../../api/servicios'
import { useRecurso } from '../../hooks/useRecurso'
import CabeceraPagina, { CabeceraCargando, CabeceraError } from './CabeceraPagina'

// Cabecera de Matrícula: el año del proceso en la placa y el recorte de un estudiante delante.
export default function CabeceraMatricula() {
  const r = useRecurso('matricula-cabecera', obtenerCabeceraMatricula)
  if (r.estado === 'cargando') return <CabeceraCargando />
  if (r.estado === 'error') return <CabeceraError titulo="Matrícula" reintentar={r.reintentar} />

  const c = r.datos
  return (
    <CabeceraPagina
      idTitulo="f-matricula-titulo"
      titulo={c.titulo}
      bajada={c.bajada}
      acciones={[
        { href: '#solicitar', etiqueta: 'Solicitar información', icono: <MessageCircle size={20} strokeWidth={2.5} aria-hidden="true" />, estilo: 'oro' },
        { href: '#proceso', etiqueta: 'Ver requisitos', icono: <ArrowDown size={20} strokeWidth={2.5} aria-hidden="true" />, estilo: 'blanco' },
      ]}
      placa={c.anio !== null ? { rotulo: 'Matrícula', valor: String(c.anio) } : null}
      figura={c.figura}
    />
  )
}
