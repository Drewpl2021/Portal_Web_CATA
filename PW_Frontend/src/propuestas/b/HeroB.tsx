import { useId, type CSSProperties, type PointerEvent } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { obtenerHero, obtenerSitio } from '../../api/servicios'
import type { FiguraHero, Hero, Sitio } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import EnlaceDestino from '../../sitio/EnlaceDestino'

export default function HeroB() {
  const hero = useRecurso('hero', obtenerHero)
  const sitio = useRecurso('sitio', obtenerSitio)

  if (hero.estado === 'cargando') {
    return (
      <section className="pb-hero pb-hero--estado" aria-busy="true">
        <Cargando que="la portada" lineas={3} />
      </section>
    )
  }
  if (hero.estado === 'error') {
    return (
      <section className="pb-hero pb-hero--estado">
        <ErrorCarga que="la portada" reintentar={hero.reintentar} />
      </section>
    )
  }
  return <HeroListo hero={hero.datos} sitio={sitio.estado === 'listo' ? sitio.datos : null} />
}

// Orden de los estandartes: la foto al centro, los recortes a los lados.
function ordenar(figuras: FiguraHero[]) {
  const fotos = figuras.filter((f) => f.tipo === 'foto')
  const recortes = figuras.filter((f) => f.tipo === 'recorte')
  return [recortes[0], fotos[0], recortes[1]].filter(Boolean) as FiguraHero[]
}

function HeroListo({ hero, sitio }: { hero: Hero; sitio: Sitio | null }) {
  const reducir = useReducedMotion()

  // El puntero es el viento de Juliaca: los estandartes se inclinan hacia donde se mueve.
  const viento = useMotionValue(0)
  const vientoSuave = useSpring(viento, { stiffness: 60, damping: 12 })
  const giro = useMotionTemplate`rotate(${vientoSuave}deg)`

  const alMover = (e: PointerEvent<HTMLElement>) => {
    if (reducir || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    viento.set(((e.clientX - r.left) / r.width - 0.5) * 5)
  }

  const estandartes = ordenar(hero.figuras)
  const palabras = hero.titulo.split(/\s+/)

  return (
    <section
      className={`pb-hero${estandartes.length ? '' : ' pb-hero--solo-texto'}`}
      aria-labelledby="pb-hero-titulo"
      onPointerMove={alMover}
      onPointerLeave={() => viento.set(0)}
    >
      <div className="pb-hero__texto">
        <h1 className="pb-hero__titulo" id="pb-hero-titulo">
          {palabras.map((p, i) => (
            <span key={i} className="pb-palabra" style={{ '--i': i } as CSSProperties}>
              {p}{' '}
            </span>
          ))}
        </h1>
        {hero.bajada && <p className="pb-hero__bajada">{hero.bajada}</p>}
        <div className="pb-hero__acciones">
          <EnlaceDestino destino={hero.accionPrincipal.destino} className="pb-boton pb-boton--oro">
            {hero.accionPrincipal.etiqueta}
            <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
          </EnlaceDestino>
          {hero.accionSecundaria && (
            <EnlaceDestino destino={hero.accionSecundaria.destino} className="pb-boton pb-boton--linea">
              {hero.accionSecundaria.etiqueta}
            </EnlaceDestino>
          )}
        </div>
      </div>

      {estandartes.length > 0 && (
        <div className="pb-desfile">
          <span className="pb-desfile__barra" aria-hidden="true" />
          <ul className="pb-desfile__lista">
            {estandartes.map((f, i) => (
              <li key={f.imagen.url} className="pb-estandarte" style={{ '--i': i } as CSSProperties}>
                <motion.div className="pb-estandarte__viento" style={reducir ? undefined : { transform: giro }}>
                  <div className={`pb-estandarte__tela pb-estandarte__tela--${i % 3}`}>
                    <img
                      className={f.tipo === 'recorte' ? 'pb-estandarte__recorte' : 'pb-estandarte__foto'}
                      src={f.imagen.url}
                      alt={f.imagen.alt}
                      width={f.imagen.ancho ?? undefined}
                      height={f.imagen.alto ?? undefined}
                    />
                  </div>
                </motion.div>
              </li>
            ))}
          </ul>
          {sitio && <Medalla sitio={sitio} />}
        </div>
      )}
    </section>
  )
}

// Medalla con el nombre del colegio girando alrededor del emblema. Decorativa: el nombre ya está en la página.
function Medalla({ sitio }: { sitio: Sitio }) {
  const id = useId()
  const texto = `${sitio.nombre} · desde ${sitio.anioFundacion} · `
  return (
    <div className="pb-medalla" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="pb-medalla__anillo">
        <defs>
          <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text>
          <textPath href={`#${id}`} textLength="486">
            {texto.toUpperCase()}
          </textPath>
        </text>
      </svg>
      <img src="/brand/emblema-cata-192.png" alt="" width="96" height="96" />
    </div>
  )
}
