import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { obtenerSitio } from '../api/servicios'
import { useRecurso } from '../hooks/useRecurso'
import { MENU, NOSOTROS, estaActiva } from '../sitio/mapa'
import { useNavegacion } from '../sitio/useNavegacion'
import { useRutaInterna } from '../sitio/BaseRuta'
import { ListaRedes } from './BarraRedes'

const SALIDA = [0.23, 1, 0.32, 1] as const
const EMBLEMA = `${import.meta.env.BASE_URL}brand/emblema-cata-192.png`

// Al terminar, Motion limpia el transform para no dejar capas ni bloques contenedores sueltos.
const entra = (y: number, retraso = 0, duracion = 0.22) => ({
  initial: { opacity: 0, transform: `translateY(${y}px)` },
  animate: {
    opacity: 1,
    transform: 'translateY(0px)',
    transitionEnd: { transform: 'none' },
    transition: { duration: duracion, ease: SALIDA, delay: retraso },
  },
})

export default function Cabecera({ base = '' }: { base?: string }) {
  const nav = useNavegacion()
  const interna = useRutaInterna()
  const sitio = useRecurso('sitio', obtenerSitio)
  // Solo un enlace a la plataforma académica: el portal no replica su inicio de sesión ni pide datos.
  const portal = sitio.estado === 'listo' ? sitio.datos.portalAcademico : null
  const redes = sitio.estado === 'listo' ? sitio.datos.redes : []
  const relativa = nav.ruta.slice(base.length) || '/'
  const activo = MENU.find((m) => estaActiva(m.ruta, relativa))?.ruta ?? null
  const [senalado, setSenalado] = useState<string | null>(null)
  const marcado = senalado ?? activo

  return (
    <header className="f-cab">
      <div className="f-cab__barra">
        <Link to={interna('/')} className="f-cab__marca">
          <img src={EMBLEMA} alt="" width="48" height="48" />
          <span className="f-cab__sigla">CATA</span>
          <span className="f-cab__nombre">
            Colegio Adventista
            <br />
            Túpac Amaru
          </span>
          <span className="visually-hidden">, ir a Inicio</span>
        </Link>

        <nav className="f-nav" aria-label="Principal">
          <ul className="f-nav__lista" onPointerLeave={() => setSenalado(null)}>
            {MENU.map((item) => {
              const esActivo = item.ruta === activo
              return (
                <li key={item.ruta} onPointerEnter={() => setSenalado(item.ruta)}>
                  {item.grupos ? (
                    <>
                      <button type="button" className="f-nav__enlace" data-activo={esActivo || undefined} {...nav.mega.boton}>
                        {item.etiqueta}
                        <ChevronDown className="f-nav__flecha" size={16} strokeWidth={2.5} aria-hidden="true" />
                      </button>
                      <AnimatePresence>
                        {nav.mega.abierto && (
                          <motion.div
                            className="f-mega"
                            {...nav.mega.panel}
                            initial={{ opacity: 0, transform: 'translateY(-8px)' }}
                            animate={{
                              opacity: 1,
                              transform: 'translateY(0px)',
                              transitionEnd: { transform: 'none' },
                              transition: { duration: 0.22, ease: SALIDA },
                            }}
                            exit={{ opacity: 0, transform: 'translateY(-6px)', transition: { duration: 0.14, ease: SALIDA } }}
                          >
                            <div className="f-mega__interior">
                              {NOSOTROS.map((g, i) => (
                                <motion.section
                                  key={g.titulo}
                                  className="f-mega__grupo"
                                  aria-labelledby={`f-mega-${i}`}
                                  {...entra(10, 0.04 + i * 0.05)}
                                >
                                  <h2 className="f-mega__titulo" id={`f-mega-${i}`}>
                                    {g.titulo}
                                  </h2>
                                  <ul>
                                    {g.enlaces.map((e) => (
                                      <li key={e.ruta}>
                                        <Link
                                          to={interna(e.ruta)}
                                          className="f-mega__enlace"
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
                    <Link to={interna(item.ruta)} className="f-nav__enlace" aria-current={esActivo ? 'page' : undefined}>
                      {item.etiqueta}
                    </Link>
                  )}
                  {marcado === item.ruta && (
                    <motion.span
                      layoutId="f-indicador"
                      className="f-nav__indicador"
                      aria-hidden="true"
                      transition={{ type: 'spring', duration: 0.22, bounce: 0 }}
                    />
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {portal && (
          <a className="f-portal-academico" href={portal.url} target="_blank" rel="noreferrer">
            <span className="f-portal-academico__texto">
              {portal.nombre} <ArrowUpRight size={18} strokeWidth={2.5} aria-hidden="true" />
            </span>
            <span className="visually-hidden"> portal académico (se abre en otra pestaña)</span>
          </a>
        )}

        <button type="button" className="f-hamburguesa" data-abierto={nav.movil.abierto || undefined} {...nav.movil.boton}>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence>
        {nav.movil.abierto && (
          <motion.div
            className="f-movil"
            {...nav.movil.panel}
            initial={{ opacity: 0, transform: 'translateY(-12px)' }}
            animate={{
              opacity: 1,
              transform: 'translateY(0px)',
              transitionEnd: { transform: 'none' },
              transition: { duration: 0.26, ease: SALIDA },
            }}
            exit={{ opacity: 0, transform: 'translateY(-8px)', transition: { duration: 0.16, ease: SALIDA } }}
          >
            <nav aria-label="Principal (móvil)">
              <ul className="f-movil__lista">
                {MENU.map((item, i) => (
                  <motion.li key={item.ruta} {...entra(12, 0.03 + i * 0.035, 0.24)}>
                    {item.grupos ? (
                      <div className="f-movil__grupo">
                        <h2 className="f-movil__enlace">{item.etiqueta}</h2>
                        {item.grupos.map((g) => (
                          <div key={g.titulo} className="f-movil__subgrupo">
                            <h3>{g.titulo}</h3>
                            <ul>
                              {g.enlaces.map((e) => (
                                <li key={e.ruta}>
                                  <Link to={interna(e.ruta)} aria-current={relativa === e.ruta ? 'page' : undefined}>
                                    {e.etiqueta}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Link to={interna(item.ruta)} className="f-movil__enlace" aria-current={item.ruta === activo ? 'page' : undefined}>
                        {item.etiqueta}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
              {portal && (
                <a className="f-portal-academico f-portal-academico--movil" href={portal.url} target="_blank" rel="noreferrer">
                  <span className="f-portal-academico__texto">
                    {portal.nombre} · Portal académico <ArrowUpRight size={18} strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <span className="visually-hidden"> (se abre en otra pestaña)</span>
                </a>
              )}
              {/* En pantallas sin barra flotante, las redes viven aquí y en el pie. */}
              {redes.length > 0 && (
                <div className="f-movil__redes">
                  <h2 className="f-movil__subtitulo">Síguenos</h2>
                  <ListaRedes redes={redes} />
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
