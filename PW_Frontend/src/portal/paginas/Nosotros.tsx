import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { obtenerNosotros, obtenerSitio } from '../../api/servicios'
import { useRecurso } from '../../hooks/useRecurso'
import { useRutaInterna } from '../../sitio/BaseRuta'
import { useMapa } from '../../sitio/mapa'
import { Revelar } from '../movimiento'
import CabeceraPagina, { CabeceraCargando, CabeceraError } from '../secciones/CabeceraPagina'
import Cierre from '../secciones/Cierre'

// Índice de Nosotros: las columnas del mega menú (Institución, Gestión, Documentos), cada una con sus
// subpáginas. Las columnas llegan de /v1/navegacion y las frases de /v1/nosotros.
export default function Nosotros() {
  const r = useRecurso('nosotros', obtenerNosotros)
  const sitio = useRecurso('sitio', obtenerSitio)
  const interna = useRutaInterna()
  const { nosotros, titulos, etiquetaDe } = useMapa()
  const resumenDe = (ruta: string) =>
    r.estado === 'listo' ? (r.datos.paginas.find((p) => `/nosotros/${p.slug}` === ruta)?.resumen ?? null) : null

  return (
    <>
      {r.estado === 'cargando' && <CabeceraCargando />}
      {r.estado === 'error' && <CabeceraError titulo={etiquetaDe('nosotros')} reintentar={r.reintentar} />}
      {r.estado === 'listo' && (
        <CabeceraPagina
          idTitulo="f-nosotros-titulo"
          titulo={r.datos.titulo}
          bajada={r.datos.bajada}
          acciones={[{ href: '#secciones', etiqueta: titulos.nosotros.accion, icono: <ArrowDown size={20} strokeWidth={2.5} aria-hidden="true" />, estilo: 'oro' }]}
          placa={sitio.estado === 'listo' ? { rotulo: titulos.nosotros.rotuloAnio, valor: String(sitio.datos.anioFundacion) } : null}
          figura={null}
        />
      )}

      {/* Las columnas no esperan a las frases: se muestran aunque /v1/nosotros no cargue. */}
      <section className="f-seccion f-nosotros" id="secciones" aria-label="Secciones de Nosotros">
        <div className="f-seccion__interior">
          <Revelar efecto="escalonado" className="f-nosotros__columnas">
            {nosotros.map((g, i) => (
              <section key={g.id} className="f-columna" aria-labelledby={`f-columna-${i}`} style={{ '--i': i } as CSSProperties}>
                <div className="f-columna__cabeza">
                  <span className="f-ficha__numero f-columna__numero" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="f-columna__titulo" id={`f-columna-${i}`}>
                    {g.titulo}
                  </h2>
                </div>
                <ul className="f-columna__lista">
                  {g.enlaces.map((e) => {
                    const resumen = resumenDe(e.ruta)
                    return (
                      <li key={e.ruta}>
                        <Link className="f-subpagina" to={interna(e.ruta)}>
                          <span className="f-subpagina__nombre">
                            {e.etiqueta}
                          </span>
                          {resumen && <span className="f-subpagina__resumen">{resumen}</span>}
                          <ArrowRight className="f-subpagina__flecha" size={20} strokeWidth={2.5} aria-hidden="true" />
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </Revelar>
        </div>
      </section>

      <Cierre />
    </>
  )
}
