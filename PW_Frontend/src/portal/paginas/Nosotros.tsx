import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { obtenerNosotros, obtenerSitio } from '../../api/servicios'
import { useRecurso } from '../../hooks/useRecurso'
import { useRutaInterna } from '../../sitio/BaseRuta'
import { NOSOTROS, subpaginaPublicada } from '../../sitio/mapa'
import { Revelar } from '../movimiento'
import CabeceraPagina, { CabeceraCargando, CabeceraError } from '../secciones/CabeceraPagina'
import Cierre from '../secciones/Cierre'

// Índice de Nosotros: las tres columnas del mega menú (Institución, Gestión, Documentos), cada una con
// sus subpáginas. Las columnas y rutas son estructura del sitio (mapa.ts); las frases llegan de la API.
export default function Nosotros() {
  const r = useRecurso('nosotros', obtenerNosotros)
  const sitio = useRecurso('sitio', obtenerSitio)
  const interna = useRutaInterna()
  const resumenDe = (ruta: string) =>
    r.estado === 'listo' ? (r.datos.paginas.find((p) => `/nosotros/${p.slug}` === ruta)?.resumen ?? null) : null

  return (
    <>
      {r.estado === 'cargando' && <CabeceraCargando />}
      {r.estado === 'error' && <CabeceraError titulo="Nosotros" reintentar={r.reintentar} />}
      {r.estado === 'listo' && (
        <CabeceraPagina
          idTitulo="f-nosotros-titulo"
          titulo={r.datos.titulo}
          bajada={r.datos.bajada}
          acciones={[{ href: '#secciones', etiqueta: 'Conócenos', icono: <ArrowDown size={20} strokeWidth={2.5} aria-hidden="true" />, estilo: 'oro' }]}
          placa={sitio.estado === 'listo' ? { rotulo: 'Desde', valor: String(sitio.datos.anioFundacion) } : null}
          figura={null}
        />
      )}

      {/* Las columnas no dependen de la API: se muestran aunque las frases no carguen. */}
      <section className="f-seccion f-nosotros" id="secciones" aria-label="Secciones de Nosotros">
        <div className="f-seccion__interior">
          <Revelar efecto="escalonado" className="f-nosotros__columnas">
            {NOSOTROS.map((g, i) => (
              <section key={g.titulo} className="f-columna" aria-labelledby={`f-columna-${i}`} style={{ '--i': i } as CSSProperties}>
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
                    const lista = subpaginaPublicada(e.ruta)
                    const resumen = resumenDe(e.ruta)
                    return (
                      <li key={e.ruta}>
                        <Link className={`f-subpagina${lista ? '' : ' f-subpagina--pronto'}`} to={interna(e.ruta)}>
                          <span className="f-subpagina__nombre">
                            {e.etiqueta}
                            {!lista && <span className="f-subpagina__pronto">Próximamente</span>}
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
