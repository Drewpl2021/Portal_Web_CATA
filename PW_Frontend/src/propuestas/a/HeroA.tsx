import { useRef, type CSSProperties, type PointerEvent } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { obtenerHero, obtenerSitio } from '../../api/servicios'
import type { Hero } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import EnlaceDestino from '../../sitio/EnlaceDestino'

export default function HeroA() {
  const hero = useRecurso('hero', obtenerHero)
  const sitio = useRecurso('sitio', obtenerSitio)

  if (hero.estado === 'cargando') {
    return (
      <section className="pa-hero pa-hero--estado" aria-busy="true">
        <Cargando que="la portada" lineas={3} />
      </section>
    )
  }
  if (hero.estado === 'error') {
    return (
      <section className="pa-hero pa-hero--estado">
        <ErrorCarga que="la portada" reintentar={hero.reintentar} />
      </section>
    )
  }
  return <HeroListo hero={hero.datos} anio={sitio.estado === 'listo' ? sitio.datos.anioFundacion : null} />
}

function HeroListo({ hero, anio }: { hero: Hero; anio: number | null }) {
  const seccion = useRef<HTMLElement>(null)
  const reducir = useReducedMotion()

  // Parallax al hacer scroll: las franjas bajan, el número sube y las figuras se quedan atrás.
  const { scrollYProgress } = useScroll({ target: seccion, offset: ['start start', 'end start'] })
  const yFranjas = useTransform(scrollYProgress, [0, 1], ['0px', '140px'])
  const yNumero = useTransform(scrollYProgress, [0, 1], ['0px', '-90px'])
  const yFiguras = useTransform(scrollYProgress, [0, 1], ['0px', '60px'])

  // Las figuras siguen al puntero con un resorte suave (solo con mouse).
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 120, damping: 18 })
  const sy = useSpring(py, { stiffness: 120, damping: 18 })
  // Transform completo (acelerado por GPU), no los atajos x/y.
  const tFranjas = useMotionTemplate`translateY(${yFranjas})`
  const tNumero = useMotionTemplate`translateY(${yNumero})`
  const tFiguras = useMotionTemplate`translateY(${yFiguras})`
  const tGrupo = useMotionTemplate`translate(${sx}px, ${sy}px)`

  const alMover = (e: PointerEvent<HTMLElement>) => {
    if (reducir || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width - 0.5) * -16)
    py.set(((e.clientY - r.top) / r.height - 0.5) * -10)
  }

  const recortes = hero.figuras.filter((f) => f.tipo === 'recorte')
  const fotos = hero.figuras.filter((f) => f.tipo === 'foto')
  const conFiguras = hero.figuras.length > 0
  const palabras = hero.titulo.split(/\s+/)

  return (
    <section
      ref={seccion}
      className={`pa-hero${conFiguras ? '' : ' pa-hero--solo-texto'}`}
      aria-labelledby="pa-hero-titulo"
      onPointerMove={alMover}
      onPointerLeave={() => {
        px.set(0)
        py.set(0)
      }}
    >
      <motion.div className="pa-hero__franjas" aria-hidden="true" style={reducir ? undefined : { transform: tFranjas }}>
        <span />
        <span />
        <span />
      </motion.div>

      {anio && (
        <motion.span className="pa-hero__numero" aria-hidden="true" style={reducir ? undefined : { transform: tNumero }}>
          {anio}
        </motion.span>
      )}

      <div className="pa-hero__texto">
        <h1 className="pa-hero__titulo" id="pa-hero-titulo">
          {palabras.map((p, i) => (
            <span className="pa-palabra" key={i}>
              <span style={{ '--i': i } as CSSProperties}>{p}</span>{' '}
            </span>
          ))}
        </h1>
        {hero.bajada && <p className="pa-hero__bajada">{hero.bajada}</p>}
        <div className="pa-hero__acciones">
          <EnlaceDestino destino={hero.accionPrincipal.destino} className="pa-boton pa-boton--oro">
            <span className="pa-boton__texto">
              {hero.accionPrincipal.etiqueta} <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
            </span>
          </EnlaceDestino>
          {hero.accionSecundaria && (
            <EnlaceDestino destino={hero.accionSecundaria.destino} className="pa-boton pa-boton--linea">
              <span className="pa-boton__texto">{hero.accionSecundaria.etiqueta}</span>
            </EnlaceDestino>
          )}
        </div>
      </div>

      {conFiguras && (
        <motion.div className="pa-hero__figuras" style={reducir ? undefined : { transform: tFiguras }}>
          <motion.div className="pa-hero__grupo" style={reducir ? undefined : { transform: tGrupo }}>
            {recortes.map((f, i) => (
              <img
                key={f.imagen.url}
                className={`pa-recorte pa-recorte--${i}`}
                src={f.imagen.url}
                alt={f.imagen.alt}
                width={f.imagen.ancho ?? undefined}
                height={f.imagen.alto ?? undefined}
                style={{ '--i': i } as CSSProperties}
                {...(i === 0 ? { fetchpriority: 'high' } : {})}
              />
            ))}
            {fotos.slice(0, 1).map((f) => (
              <figure key={f.imagen.url} className={`pa-tarjeta${recortes.length ? '' : ' pa-tarjeta--sola'}`}>
                <img
                  src={f.imagen.url}
                  alt={f.imagen.alt}
                  width={f.imagen.ancho ?? undefined}
                  height={f.imagen.alto ?? undefined}
                />
              </figure>
            ))}
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
