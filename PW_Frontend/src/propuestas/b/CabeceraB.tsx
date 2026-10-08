import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { obtenerSitio } from '../../api/servicios'
import { useRecurso } from '../../hooks/useRecurso'
import { MENU, NOSOTROS, estaActiva } from '../../sitio/mapa'
import { useNavegacion } from '../../sitio/useNavegacion'

const SALIDA = [0.23, 1, 0.32, 1] as const
const EMBLEMA = '/brand/emblema-cata-192.png'

// Cabecera «Desfile»: blanca y ceremonial, subrayado dorado que se despliega como una cinta
// y un mega menú que baja colgado de su barra dorada.
export default function CabeceraB({ base }: { base: string }) {
  const nav = useNavegacion()
  const sitio = useRecurso('sitio', obtenerSitio)
  const icrm = sitio.estado === 'listo' ? sitio.datos.portalAcademicoUrl : null
  const relativa = nav.ruta.slice(base.length) || '/'
  const activo = MENU.find((m) => estaActiva(m.ruta, relativa))?.ruta ?? null
  const href = (ruta: string) => (ruta === '/' ? base : base + ruta)

  return (
    <header className="pb-cab">
      <div className="pb-cab__barra">
        <Link to={base} className="pb-cab__marca">
          <img src={EMBLEMA} alt="" width="56" height="56" />
          <span className="pb-cab__textos">
            <span className="pb-cab__linea1">Colegio Adventista</span>
            <span className="pb-cab__linea2">Túpac Amaru</span>
          </span>
          <span className="visually-hidden">, ir a Inicio</span>
        </Link>

        <nav className="pb-nav" aria-label="Principal">
          <ul className="pb-nav__lista">
            {MENU.map((item) => {
              const esActivo = item.ruta === activo
              return (
                <li key={item.ruta}>
                  {item.grupos ? (
                    <>
                    <button type="button" className="pb-nav__enlace" data-activo={esActivo || undefined} {...nav.mega.boton}>
                      {item.etiqueta}
                      <ChevronDown className="pb-nav__flecha" size={16} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                      <AnimatePresence>
                        {nav.mega.abierto && (
                          <motion.div
                            className="pb-mega"
                            {...nav.mega.panel}
                            initial={{ opacity: 0, transform: 'translateY(-10px)' }}
                            animate={{ opacity: 1, transform: 'translateY(0px)', transitionEnd: { transform: 'none' }, transition: { duration: 0.22, ease: SALIDA } }}
                            exit={{ opacity: 0, transform: 'translateY(-6px)', transition: { duration: 0.14, ease: SALIDA } }}
                          >
                            <div className="pb-mega__interior">
                              {NOSOTROS.map((g, i) => (
                                <motion.section
                                  key={g.titulo}
                                  className="pb-mega__grupo"
                                  aria-labelledby={`pb-mega-${i}`}
                                  initial={{ opacity: 0, transform: 'translateY(-14px) rotate(-1.5deg)' }}
                                  animate={{
                                    opacity: 1,
                                    transform: 'translateY(0px) rotate(0deg)', transitionEnd: { transform: 'none' }, transition: { type: 'spring', duration: 0.5, bounce: 0.25, delay: 0.04 + i * 0.06 },
                                  }}
                                >
                                  <h2 className="pb-mega__titulo" id={`pb-mega-${i}`}>
                                    {g.titulo}
                                  </h2>
                                  <ul>
                                    {g.enlaces.map((e) => (
                                      <li key={e.ruta}>
                                        <Link
                                          to={href(e.ruta)}
                                          className="pb-mega__enlace"
                                          aria-current={relativa === e.ruta ? 'page' : undefined}
                                          onClick={nav.mega.cerrar}
                                        >
                                          {e.etiqueta}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </motion.section>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link to={href(item.ruta)} className="pb-nav__enlace" aria-current={esActivo ? 'page' : undefined}>
                      {item.etiqueta}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {icrm && (
          <a className="pb-icrm" href={icrm} target="_blank" rel="noreferrer">
            <span className="pb-icrm__medalla" aria-hidden="true" />
            ICRM
            <ArrowUpRight size={18} strokeWidth={2.5} aria-hidden="true" />
            <span className="visually-hidden"> portal académico (se abre en otra pestaña)</span>
          </a>
        )}

        <button type="button" className="pb-hamburguesa" data-abierto={nav.movil.abierto || undefined} {...nav.movil.boton}>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>


      <AnimatePresence>
        {nav.movil.abierto && (
          <motion.div
            className="pb-movil"
            {...nav.movil.panel}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)', transitionEnd: { clipPath: 'none' }, transition: { duration: 0.3, ease: SALIDA } }}
            exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.18, ease: SALIDA } }}
          >
            <nav aria-label="Principal (móvil)">
              <ul className="pb-movil__lista">
                {MENU.map((item) =>
                  item.grupos ? (
                    <li key={item.ruta} className="pb-movil__grupo">
                      <h2 className="pb-movil__enlace">{item.etiqueta}</h2>
                      {item.grupos.map((g) => (
                        <div key={g.titulo} className="pb-movil__subgrupo">
                          <h3>{g.titulo}</h3>
                          <ul>
                            {g.enlaces.map((e) => (
                              <li key={e.ruta}>
                                <Link to={href(e.ruta)} aria-current={relativa === e.ruta ? 'page' : undefined}>
                                  {e.etiqueta}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </li>
                  ) : (
                    <li key={item.ruta}>
                      <Link
                        to={href(item.ruta)}
                        className="pb-movil__enlace"
                        aria-current={item.ruta === activo ? 'page' : undefined}
                      >
                        {item.etiqueta}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
              {icrm && (
                <a className="pb-icrm pb-icrm--movil" href={icrm} target="_blank" rel="noreferrer">
                  <span className="pb-icrm__medalla" aria-hidden="true" />
                  ICRM · Portal académico
                  <ArrowUpRight size={18} strokeWidth={2.5} aria-hidden="true" />
                  <span className="visually-hidden"> (se abre en otra pestaña)</span>
                </a>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
