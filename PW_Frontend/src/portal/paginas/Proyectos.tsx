import { ArrowDown, MessageCircle } from 'lucide-react'
import { obtenerProyectos } from '../../api/servicios'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import { useMapa } from '../../sitio/mapa'
import { Revelar } from '../movimiento'
import CabeceraPagina, { CabeceraCargando, CabeceraError } from '../secciones/CabeceraPagina'
import Cierre from '../secciones/Cierre'
import ListaProyectos from '../secciones/ListaProyectos'

// Proyectos: cabecera con el número de proyectos publicados, lista con filtro por categoría y el cierre.
export default function Proyectos() {
  const r = useRecurso('proyectos', obtenerProyectos)
  const { titulos, etiquetaDe } = useMapa()

  return (
    <>
      {r.estado === 'cargando' && <CabeceraCargando />}
      {r.estado === 'error' && <CabeceraError titulo={etiquetaDe('proyectos')} reintentar={r.reintentar} />}
      {r.estado === 'listo' && (
        <CabeceraPagina
          idTitulo="f-proyectos-titulo"
          titulo={r.datos.titulo}
          bajada={r.datos.bajada}
          acciones={[
            ...(r.datos.proyectos.length > 0
              ? [{ href: '#lista', etiqueta: titulos.proyectos.accion, icono: <ArrowDown size={20} strokeWidth={2.5} aria-hidden="true" />, estilo: 'oro' as const }]
              : []),
            {
              href: '/contacto',
              interna: true,
              etiqueta: titulos.proyectos.contacto,
              icono: <MessageCircle size={20} strokeWidth={2.5} aria-hidden="true" />,
              estilo: r.datos.proyectos.length > 0 ? ('blanco' as const) : ('oro' as const),
            },
          ]}
          placa={
            r.datos.proyectos.length > 0
              ? { rotulo: r.datos.proyectos.length === 1 ? titulos.proyectos.rotuloUno : titulos.proyectos.rotulo, valor: String(r.datos.proyectos.length).padStart(2, '0') }
              : null
          }
          figura={null}
        />
      )}

      <section className="f-seccion f-proyectos" id="lista" aria-labelledby="f-lista-titulo">
        <div className="f-seccion__interior">
          <h2 className="f-titulo" id="f-lista-titulo">
            <Revelar como="span" efecto="titulo" className="f-barrido">
              {titulos.proyectos.lista}
            </Revelar>
          </h2>
          {r.estado === 'cargando' && <Cargando que="los proyectos" lineas={5} conTitulo={false} />}
          {r.estado === 'error' && <ErrorCarga que="los proyectos" reintentar={r.reintentar} />}
          {r.estado === 'listo' && r.datos.proyectos.length === 0 && (
            <p className="f-vacio">Los proyectos del colegio se publicarán pronto.</p>
          )}
          {r.estado === 'listo' && r.datos.proyectos.length > 0 && <ListaProyectos datos={r.datos} />}
        </div>
      </section>

      <Cierre />
    </>
  )
}
