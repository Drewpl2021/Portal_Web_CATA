import { useRef, type CSSProperties, type PointerEvent } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { obtenerHero, obtenerSitio } from '../../api/servicios'
import type { Hero, Sitio } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import EnlaceDestino from '../../sitio/EnlaceDestino'
import Medalla from '../Medalla'

export default function HeroFinal() {
  const hero = useRecurso('hero', obtenerHero)
  const sitio = useRecurso('sitio', obtenerSitio)

  if (hero.estado === 'cargando') {
    return (
      <section className="f-hero f-hero--estado" aria-busy="true">
        <Cargando que="la portada" lineas={3} className="f-cargando--claro" />
      </section>
    )
  }
  if (hero.estado === 'error') {
    return (
      <section className="f-hero f-hero--estado">
        <ErrorCarga que="la portada" reintentar={hero.reintentar} className="f-error--claro" />
      </section>
    )
  }
  return <HeroListo hero={hero.datos} sitio={sitio.estado === 'listo' ? sitio.datos : null} />
}

function HeroListo({ hero, sitio }: { hero: Hero; sitio: Sitio | null }) {
  const seccion = useRef<HTMLElement>(null)
  const reducir = useReducedMotion()

  // Scroll: las franjas bajan, las figuras se quedan atrás y el anillo del emblema gira.
  const { scrollYProgress } = useScroll({ target: seccion, offset: ['start start', 'end start'] })
  const yFranjas = useTransform(scrollYProgress, [0, 1], ['0px', '120px'])
  const yFiguras = useTransform(scrollYProgress, [0, 1], ['0px', '50px'])
  const giro = useTransform(scrollYProgress, [0, 1], [0, 140])
  const tFranjas = useMotionTemplate`translateY(${yFranjas})`
  const tFiguras = useMotionTemplate`translateY(${yFiguras})`
  const tAnillo = useMotionTemplate`rotate(${giro}deg)`

  // Puntero: las figuras lo siguen con un resorte suave (solo con mouse).
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 120, damping: 18 })
  const sy = useSpring(py, { stiffness: 120, damping: 18 })
  const tGrupo = useMotionTemplate`translate(${sx}px, ${sy}px)`

  const alMover = (e: PointerEvent<HTMLElement>) => {
    if (reducir || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width - 0.5) * -16)
    py.set(((e.clientY - r.top) / r.height - 0.5) * -10)
  }

  // Los recortes son los protagonistas; si no hay, se usa la primera foto.
  const recortes = hero.figuras.filter((f) => f.tipo === 'recorte').slice(0, 2)
  const foto = recortes.length === 0 ? hero.figuras.find((f) => f.tipo === 'foto') : undefined
  const conFiguras = recortes.length > 0 || Boolean(foto)

  return (
    <section
      ref={seccion}
      className={`f-hero${conFiguras ? '' : ' f-hero--solo-texto'}`}
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

      {conFiguras && (
        <motion.div className="f-hero__figuras" style={reducir ? undefined : { transform: tFiguras }}>
          <motion.svg
            className="f-hero__anillo"
            viewBox="0 0 200 200"
            aria-hidden="true"
            style={reducir ? undefined : { transform: tAnillo }}
          >
            <circle cx="100" cy="100" r="88" />
            <circle className="f-hero__anillo-fino" cx="100" cy="100" r="68" strokeDasharray="6 10" />
          </motion.svg>

          <motion.div className="f-hero__grupo" style={reducir ? undefined : { transform: tGrupo }}>
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
                className="f-hero__foto"
                src={foto.imagen.url}
                alt={foto.imagen.alt}
                width={foto.imagen.ancho ?? undefined}
                height={foto.imagen.alto ?? undefined}
              />
            )}
          </motion.div>

          {sitio && <Medalla nombre={sitio.nombre} anio={sitio.anioFundacion} className="f-hero__medalla" />}
        </motion.div>
      )}
    </section>
  )
}
