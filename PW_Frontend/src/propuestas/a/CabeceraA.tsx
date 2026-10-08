import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { obtenerSitio } from '../../api/servicios'
import { useRecurso } from '../../hooks/useRecurso'
import { MENU, NOSOTROS, estaActiva } from '../../sitio/mapa'
import { useNavegacion } from '../../sitio/useNavegacion'

const SALIDA = [0.23, 1, 0.32, 1] as const
const EMBLEMA = '/brand/emblema-cata-192.png'

// Cabecera «Polideportivo»: barra azul, una franja dorada que corre bajo el ítem señalado
// y un mega menú que cae como un tablero de equipo.
export default function CabeceraA({ base }: { base: string }) {
  const nav = useNavegacion()
  const sitio = useRecurso('sitio', obtenerSitio)
  const icrm = sitio.estado === 'listo' ? sitio.datos.portalAcademicoUrl : null
  const relativa = nav.ruta.slice(base.length) || '/'
  const activo = MENU.find((m) => estaActiva(m.ruta, relativa))?.ruta ?? null
  const [senalado, setSenalado] = useState<string | null>(null)
  const marcado = senalado ?? activo

  const href = (ruta: string) => (ruta === '/' ? base : base + ruta)

  return (
    <header className="pa-cab">
      <div className="pa-cab__barra">
        <Link to={base} className="pa-cab__marca">
          <img src={EMBLEMA} alt="" width="48" height="48" />
          <span className="pa-cab__sigla">CATA</span>
          <span className="pa-cab__nombre">
            Colegio Adventista
            <br />
            Túpac Amaru
          </span>
          <span className="visually-hidden">, ir a Inicio</span>
        </Link>

        <nav className="pa-nav" aria-label="Principal">
          <ul className="pa-nav__lista" onPointerLeave={() => setSenalado(null)}>
            {MENU.map((item) => {
              const esActivo = item.ruta === activo
              return (
                <li key={item.ruta} onPointerEnter={() => setSenalado(item.ruta)}>
                  {item.grupos ? (
                    <>
                    <button
                      type="button"
                      className="pa-nav__enlace"
                      data-activo={esActivo || undefined}
                      {...nav.mega.boton}
                    >
                      {item.etiqueta}
                      <ChevronDown className="pa-nav__flecha" size={16} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                      <AnimatePresence>
                        {nav.mega.abierto && (
                          <motion.div
                            className="pa-mega"
                            {...nav.mega.panel}
                            initial={{ clipPath: 'inset(0 0 100% 0)' }}
                            animate={{ clipPath: 'inset(0 0 0% 0)', transitionEnd: { clipPath: 'none' }, transition: { duration: 0.24, ease: SALIDA } }}
                            exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.16, ease: SALIDA } }}
                          >
                            <div className="pa-mega__interior">
                              {NOSOTROS.map((g, i) => (
                                <motion.section
                                  key={g.titulo}
                                  className="pa-mega__grupo"
                                  aria-labelledby={`pa-mega-${i}`}
                                  initial={{ opacity: 0, transform: 'translateY(8px)' }}
                                  animate={{ opacity: 1, transform: 'translateY(0px)', transitionEnd: { transform: 'none' }, transition: { duration: 0.24, ease: SALIDA, delay: 0.05 + i * 0.05 } }}
                                >
                                  <h2 className="pa-mega__titulo" id={`pa-mega-${i}`}>
                                    {g.titulo}
                                  </h2>
                                  <ul>
                                    {g.enlaces.map((e) => (
                                      <li key={e.ruta}>
                                        <Link
                                          to={href(e.ruta)}
                                          className="pa-mega__enlace"
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
                    <Link
                      to={href(item.ruta)}
                      className="pa-nav__enlace"
                      aria-current={esActivo ? 'page' : undefined}
                    >
                      {item.etiqueta}
                    </Link>
                  )}
                  {marcado === item.ruta && (
                    <motion.span
                      layoutId="pa-indicador"
                      className="pa-nav__indicador"
                      aria-hidden="true"
                      transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
                    />
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {icrm && (
          <a className="pa-icrm" href={icrm} target="_blank" rel="noreferrer">
            <span className="pa-icrm__texto">
              ICRM <ArrowUpRight size={18} strokeWidth={2.5} aria-hidden="true" />
            </span>
            <span className="visually-hidden"> portal académico (se abre en otra pestaña)</span>
          </a>
        )}

        <button type="button" className="pa-hamburguesa" data-abierto={nav.movil.abierto || undefined} {...nav.movil.boton}>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>


      <AnimatePresence>
        {nav.movil.abierto && (
          <motion.div
            className="pa-movil"
            {...nav.movil.panel}
            initial={{ opacity: 0, transform: 'translateY(-12px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)', transitionEnd: { transform: 'none' }, transition: { duration: 0.28, ease: SALIDA } }}
            exit={{ opacity: 0, transform: 'translateY(-8px)', transition: { duration: 0.16, ease: SALIDA } }}
          >
            <nav aria-label="Principal (móvil)">
              <ul className="pa-movil__lista">
                {MENU.map((item, i) => (
                  <motion.li
                    key={item.ruta}
                    initial={{ opacity: 0, transform: 'translateX(-16px)' }}
                    animate={{ opacity: 1, transform: 'translateX(0px)', transitionEnd: { transform: 'none' }, transition: { duration: 0.26, ease: SALIDA, delay: 0.04 + i * 0.04 } }}
                  >
                    {item.grupos ? (
                      <div className="pa-movil__grupo">
                        <h2 className="pa-movil__enlace pa-movil__enlace--titulo">{item.etiqueta}</h2>
                        {item.grupos.map((g) => (
                          <div key={g.titulo} className="pa-movil__subgrupo">
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
                      </div>
                    ) : (
                      <Link
                        to={href(item.ruta)}
                        className="pa-movil__enlace"
                        aria-current={item.ruta === activo ? 'page' : undefined}
                      >
                        {item.etiqueta}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
              {icrm && (
                <a className="pa-icrm pa-icrm--movil" href={icrm} target="_blank" rel="noreferrer">
                  <span className="pa-icrm__texto">
                    ICRM · Portal académico <ArrowUpRight size={18} strokeWidth={2.5} aria-hidden="true" />
                  </span>
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
