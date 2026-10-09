import { useRef, type CSSProperties, type PointerEvent } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { obtenerCabeceraPropuesta, obtenerSitio } from '../../api/servicios'
import type { Hero, Sitio } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import EnlaceDestino from '../../sitio/EnlaceDestino'
import Medalla from '../Medalla'

// Cabecera de Propuesta Educativa: titular, barras, botones y la escena de los alumnos
// delante del anillo del emblema, con la medalla girando dentro del anillo.
export default function CabeceraPropuesta() {
  const cabecera = useRecurso('propuesta-cabecera', obtenerCabeceraPropuesta)
  const sitio = useRecurso('sitio', obtenerSitio)

  if (cabecera.estado === 'cargando') {
    return (
      <section className="f-hero f-hero--estado" aria-busy="true">
        <div className="f-hero__interior">
          <Cargando que="la cabecera" lineas={3} className="f-cargando--claro" />
        </div>
      </section>
    )
  }
  if (cabecera.estado === 'error') {
    return (
      <section className="f-hero f-hero--estado">
        <div className="f-hero__interior">
          <h1 className="f-hero__titulo">Propuesta Educativa</h1>
          <ErrorCarga que="la cabecera" reintentar={cabecera.reintentar} className="f-error--claro" />
        </div>
      </section>
    )
  }
  return <Listo hero={cabecera.datos} sitio={sitio.estado === 'listo' ? sitio.datos : null} />
}

function Listo({ hero, sitio }: { hero: Hero; sitio: Sitio | null }) {
  const seccion = useRef<HTMLElement>(null)
  const reducir = useReducedMotion()

  // Scroll: las franjas bajan, la escena se queda atrás y el anillo del emblema gira.
  const { scrollYProgress } = useScroll({ target: seccion, offset: ['start start', 'end start'] })
  const yFranjas = useTransform(scrollYProgress, [0, 1], ['0rem', '7rem'])
  const yEscena = useTransform(scrollYProgress, [0, 1], ['0rem', '3rem'])
  const giro = useTransform(scrollYProgress, [0, 1], [0, 140])
  const tFranjas = useMotionTemplate`translateY(${yFranjas})`
  const tEscena = useMotionTemplate`translateY(${yEscena})`
  const tAnillo = useMotionTemplate`rotate(${giro}deg)`

  // Puntero: los alumnos lo siguen con un resorte suave (solo con mouse). En % de la escena, para escalar con ella.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 120, damping: 18 })
  const sy = useSpring(py, { stiffness: 120, damping: 18 })
  const tAlumnos = useMotionTemplate`translate(${sx}%, ${sy}%)`

  const alMover = (e: PointerEvent<HTMLElement>) => {
    if (reducir || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width - 0.5) * -2.4)
    py.set(((e.clientY - r.top) / r.height - 0.5) * -1.6)
  }

  const recortes = hero.figuras.filter((f) => f.tipo === 'recorte').slice(0, 2)
  const foto = recortes.length === 0 ? hero.figuras.find((f) => f.tipo === 'foto') : undefined
  const conEscena = recortes.length > 0 || Boolean(foto)

  return (
    <section
      ref={seccion}
      className={`f-hero${conEscena ? '' : ' f-hero--solo-texto'}`}
      aria-labelledby="f-hero-titulo"
      onPointerMove={alMover}
      onPointerLeave={() => {
        px.set(0)
        py.set(0)
      }}
    >
      <motion.div className="f-hero__franjas" aria-hidden="true" style={reducir ? undefined : { transform: tFranjas }}>
        <span />
        <span />
        <span />
      </motion.div>

      <div className="f-hero__interior">
        <div className="f-hero__texto">
          <h1 className="f-hero__titulo" id="f-hero-titulo">
            <span className="f-barrido">{hero.titulo}</span>
          </h1>
          <div className="f-hero__barras" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ '--i': i } as CSSProperties} />
            ))}
          </div>
          {hero.bajada && <p className="f-hero__bajada">{hero.bajada}</p>}
          <div className="f-hero__acciones">
            <EnlaceDestino destino={hero.accionPrincipal.destino} className="f-boton f-boton--oro">
              <span className="f-boton__texto">
                {hero.accionPrincipal.etiqueta} <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
              </span>
            </EnlaceDestino>
            {hero.accionSecundaria && (
              <EnlaceDestino destino={hero.accionSecundaria.destino} className="f-boton f-boton--blanco">
                <span className="f-boton__texto">{hero.accionSecundaria.etiqueta}</span>
              </EnlaceDestino>
            )}
          </div>
        </div>

        {conEscena && (
          // La escena tiene proporción fija y todo se ubica en % de ella: escala y se mueve como un solo grupo.
          <motion.div className="f-escena" style={reducir ? undefined : { transform: tEscena }}>
            <div className="f-escena__anillo">
              <motion.svg viewBox="0 0 200 200" aria-hidden="true" style={reducir ? undefined : { transform: tAnillo }}>
                <circle cx="100" cy="100" r="92" />
                <circle className="f-escena__anillo-fino" cx="100" cy="100" r="74" strokeDasharray="6 10" />
              </motion.svg>
              {sitio && <Medalla nombre={sitio.nombre} anio={sitio.anioFundacion} className="f-escena__medalla" />}
            </div>

            <motion.div className="f-escena__alumnos" style={reducir ? undefined : { transform: tAlumnos }}>
              {recortes.map((f, i) => (
                <img
                  key={f.imagen.url}
                  className={`f-recorte f-recorte--${i}`}
                  src={f.imagen.url}
                  alt={f.imagen.alt}
                  width={f.imagen.ancho ?? undefined}
                  height={f.imagen.alto ?? undefined}
                  style={{ '--i': i } as CSSProperties}
                  {...(i === 0 ? { fetchpriority: 'high' } : {})}
                />
              ))}
              {foto && (
                <img
                  className="f-escena__foto"
                  src={foto.imagen.url}
                  alt={foto.imagen.alt}
                  width={foto.imagen.ancho ?? undefined}
                  height={foto.imagen.alto ?? undefined}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
