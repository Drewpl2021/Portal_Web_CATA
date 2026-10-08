import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Plus } from 'lucide-react'
import { obtenerSitio } from '../../api/servicios'
import { useRecurso } from '../../hooks/useRecurso'
import { MENU, NOSOTROS, estaActiva } from '../../sitio/mapa'
import { useNavegacion } from '../../sitio/useNavegacion'

const SALIDA = [0.23, 1, 0.32, 1] as const
const EMBLEMA = '/brand/emblema-cata-192.png'

// Cabecera «Muro de afiches»: tipográfica y alineada a la retícula.
// Un cuadrado celeste marca el ítem señalado y se desliza entre posiciones de la retícula.
export default function CabeceraC({ base }: { base: string }) {
  const nav = useNavegacion()
  const sitio = useRecurso('sitio', obtenerSitio)
  const icrm = sitio.estado === 'listo' ? sitio.datos.portalAcademicoUrl : null
  const relativa = nav.ruta.slice(base.length) || '/'
  const activo = MENU.find((m) => estaActiva(m.ruta, relativa))?.ruta ?? null
  const [senalado, setSenalado] = useState<string | null>(null)
  const marcado = senalado ?? activo
  const href = (ruta: string) => (ruta === '/' ? base : base + ruta)

  return (
    <header className="pc-cab">
      <div className="pc-cab__barra">
        <Link to={base} className="pc-cab__marca">
          <img src={EMBLEMA} alt="" width="44" height="44" />
          <span className="pc-cab__sigla">CATA</span>
          <span className="pc-cab__nombre">
            Colegio Adventista
            <br />
            Túpac Amaru, Juliaca
          </span>
          <span className="visually-hidden">, ir a Inicio</span>
        </Link>

        <nav className="pc-nav" aria-label="Principal">
          <ul className="pc-nav__lista" onPointerLeave={() => setSenalado(null)}>
            {MENU.map((item) => {
              const esActivo = item.ruta === activo
              return (
                <li key={item.ruta} onPointerEnter={() => setSenalado(item.ruta)}>
                  {marcado === item.ruta && (
                    <motion.span
                      layoutId="pc-cuadro"
                      className="pc-nav__cuadro"
                      aria-hidden="true"
                      transition={{ type: 'spring', duration: 0.28, bounce: 0 }}
                    />
                  )}
                  {item.grupos ? (
                    <>
                    <button type="button" className="pc-nav__enlace" data-activo={esActivo || undefined} {...nav.mega.boton}>
                      {item.etiqueta}
                      <Plus className="pc-nav__mas" size={14} strokeWidth={3} aria-hidden="true" />
                    </button>
                      <AnimatePresence>
                        {nav.mega.abierto && (
                          <motion.div
                            className="pc-mega"
                            {...nav.mega.panel}
                            initial={{ clipPath: 'inset(0 0 100% 0)' }}
                            animate={{ clipPath: 'inset(0 0 0% 0)', transitionEnd: { clipPath: 'none' }, transition: { duration: 0.24, ease: SALIDA } }}
                            exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.15, ease: SALIDA } }}
                          >
                            <div className="pc-mega__reticula">
                              {NOSOTROS.map((g, i) => (
                                <motion.section
                                  key={g.titulo}
                                  className="pc-mega__grupo"
                                  aria-labelledby={`pc-mega-${i}`}
                                  initial={{ opacity: 0, transform: 'translateY(10px)' }}
                                  animate={{ opacity: 1, transform: 'translateY(0px)', transitionEnd: { transform: 'none' }, transition: { duration: 0.22, ease: SALIDA, delay: 0.06 + i * 0.05 } }}
                                >
                                  <h2 className="pc-mega__titulo" id={`pc-mega-${i}`}>
                                    {g.titulo}
                                  </h2>
                                  <ul>
                                    {g.enlaces.map((e) => (
                                      <li key={e.ruta}>
                                        <Link
                                          to={href(e.ruta)}
                                          className="pc-mega__enlace"
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
                              <div className="pc-mega__forma" aria-hidden="true">
                                <span className="pc-forma-circulo" />
                                <span className="pc-forma-barra" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link to={href(item.ruta)} className="pc-nav__enlace" aria-current={esActivo ? 'page' : undefined}>
                      {item.etiqueta}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {icrm && (
          <a className="pc-icrm" href={icrm} target="_blank" rel="noreferrer">
            ICRM
            <ArrowUpRight size={20} strokeWidth={2.5} aria-hidden="true" />
            <span className="visually-hidden"> portal académico (se abre en otra pestaña)</span>
          </a>
        )}

        <button type="button" className="pc-hamburguesa" data-abierto={nav.movil.abierto || undefined} {...nav.movil.boton}>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>


      <AnimatePresence>
        {nav.movil.abierto && (
          <motion.div
            className="pc-movil"
            {...nav.movil.panel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2, ease: SALIDA } }}
            exit={{ opacity: 0, transition: { duration: 0.14, ease: SALIDA } }}
          >
            <nav aria-label="Principal (móvil)">
              <ul className="pc-movil__lista">
                {MENU.map((item, i) => (
                  <motion.li
                    key={item.ruta}
                    initial={{ opacity: 0, transform: 'translateY(14px)' }}
                    animate={{ opacity: 1, transform: 'translateY(0px)', transitionEnd: { transform: 'none' }, transition: { duration: 0.24, ease: SALIDA, delay: 0.03 + i * 0.035 } }}
                  >
                    {item.grupos ? (
                      <>
                        <h2 className="pc-movil__enlace">{item.etiqueta}</h2>
                        <div className="pc-movil__grupos">
                          {item.grupos.map((g) => (
                            <div key={g.titulo} className="pc-movil__subgrupo">
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
                      </>
                    ) : (
                      <Link to={href(item.ruta)} className="pc-movil__enlace" aria-current={item.ruta === activo ? 'page' : undefined}>
                        {item.etiqueta}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
              {icrm && (
                <a className="pc-icrm pc-icrm--movil" href={icrm} target="_blank" rel="noreferrer">
                  ICRM · Portal académico
                  <ArrowUpRight size={20} strokeWidth={2.5} aria-hidden="true" />
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
