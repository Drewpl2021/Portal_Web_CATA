import { useRef, type CSSProperties } from 'react'
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { obtenerHero, obtenerSitio } from '../../api/servicios'
import type { Hero, Sitio } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import EnlaceDestino from '../../sitio/EnlaceDestino'

export default function HeroC() {
  const hero = useRecurso('hero', obtenerHero)
  const sitio = useRecurso('sitio', obtenerSitio)

  if (hero.estado === 'cargando') {
    return (
      <section className="pc-hero pc-hero--estado" aria-busy="true">
        <Cargando que="la portada" lineas={3} />
      </section>
    )
  }
  if (hero.estado === 'error') {
    return (
      <section className="pc-hero pc-hero--estado">
        <ErrorCarga que="la portada" reintentar={hero.reintentar} />
      </section>
    )
  }
  return <HeroListo hero={hero.datos} sitio={sitio.estado === 'listo' ? sitio.datos : null} />
}

function HeroListo({ hero, sitio }: { hero: Hero; sitio: Sitio | null }) {
  const seccion = useRef<HTMLElement>(null)
  const reducir = useReducedMotion()

  // El anillo del emblema gira con el scroll, como una pieza más de la retícula.
  const { scrollYProgress } = useScroll({ target: seccion, offset: ['start start', 'end start'] })
  const grados = useTransform(scrollYProgress, [0, 1], [0, 120])
  const giro = useMotionTemplate`rotate(${grados}deg)`

  const recorte = hero.figuras.find((f) => f.tipo === 'recorte')
  const foto = hero.figuras.find((f) => f.tipo === 'foto')
  const principal = recorte ?? foto

  return (
    <section
      ref={seccion}
      className={`pc-hero${principal ? '' : ' pc-hero--solo-texto'}`}
      aria-labelledby="pc-hero-titulo"
    >
      <h1 className="pc-hero__titulo" id="pc-hero-titulo">
        {hero.titulo}
      </h1>

      <div className="pc-hero__barras" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ '--i': i } as CSSProperties} />
        ))}
      </div>

      <div className="pc-hero__texto">
        {hero.bajada && <p className="pc-hero__bajada">{hero.bajada}</p>}
        <div className="pc-hero__acciones">
          <EnlaceDestino destino={hero.accionPrincipal.destino} className="pc-boton pc-boton--bloque">
            {hero.accionPrincipal.etiqueta}
            <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
          </EnlaceDestino>
          {hero.accionSecundaria && (
            <EnlaceDestino destino={hero.accionSecundaria.destino} className="pc-boton pc-boton--texto">
              {hero.accionSecundaria.etiqueta}
            </EnlaceDestino>
          )}
        </div>
      </div>

      {principal && (
        <div className={`pc-hero__bloque${recorte ? '' : ' pc-hero__bloque--foto'}`}>
          <motion.svg
            className="pc-hero__anillo"
            viewBox="0 0 200 200"
            aria-hidden="true"
            style={reducir ? undefined : { transform: giro }}
          >
            <circle cx="100" cy="100" r="86" pathLength="1" />
            <circle className="pc-hero__anillo-fino" cx="100" cy="100" r="64" pathLength="1" />
          </motion.svg>
          <img
            className={recorte ? 'pc-hero__recorte' : 'pc-hero__foto-principal'}
            src={principal.imagen.url}
            alt={principal.imagen.alt}
            width={principal.imagen.ancho ?? undefined}
            height={principal.imagen.alto ?? undefined}
          />
        </div>
      )}

      {recorte && foto && (
        <figure className="pc-hero__fragmento">
          <img
            src={foto.imagen.url}
            alt={foto.imagen.alt}
            width={foto.imagen.ancho ?? undefined}
            height={foto.imagen.alto ?? undefined}
          />
        </figure>
      )}

      {sitio && (
        <p className="pc-hero__pie">
          <span>{sitio.ciudad}</span>
          <span>Desde {sitio.anioFundacion}</span>
          {sitio.subtitulo && <span>{sitio.subtitulo}</span>}
        </p>
      )}
    </section>
  )
}
