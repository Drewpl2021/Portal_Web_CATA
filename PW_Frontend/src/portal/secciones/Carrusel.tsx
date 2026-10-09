import { useCallback, useEffect, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Fade from 'embla-carousel-fade'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { obtenerBanners } from '../../api/servicios'
import type { Banner, CategoriaBanner } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import { fechaLegible } from '../../lib/formato'
import EnlaceDestino from '../../sitio/EnlaceDestino'

const AVANCE_MS = 6000

const CATEGORIA: Record<CategoriaBanner, string> = {
  aviso: 'Aviso',
  matricula: 'Matrícula',
  evento: 'Evento',
  noticia: 'Noticia',
}

// Carrusel de Inicio con lo último que publica el colegio. Solo va en Inicio.
export default function Carrusel() {
  const r = useRecurso('banners', obtenerBanners)

  if (r.estado === 'cargando') {
    return (
      <section className="f-carrusel f-carrusel--estado" aria-busy="true">
        <Cargando que="las novedades" lineas={2} className="f-cargando--claro" />
      </section>
    )
  }
  if (r.estado === 'error') {
    return (
      <section className="f-carrusel f-carrusel--estado">
        <ErrorCarga que="las novedades" reintentar={r.reintentar} className="f-error--claro" />
      </section>
    )
  }
  // Sin banners, la sección desaparece sin dejar hueco.
  if (r.datos.length === 0) return null
  return <CarruselListo banners={r.datos} />
}

const prefiereReducir = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function CarruselListo({ banners }: { banners: Banner[] }) {
  const varios = banners.length > 1
  // Con «reducir movimiento» las diapositivas se funden en vez de deslizarse.
  const [reducido] = useState(prefiereReducir)
  const [vista, api] = useEmblaCarousel({ loop: varios, watchDrag: varios, duration: 28 }, reducido ? [Fade()] : [])
  const raiz = useRef<HTMLElement>(null)

  const [actual, setActual] = useState(0)
  // Con «reducir movimiento» el carrusel no avanza solo; la persona puede activarlo con Reproducir.
  const [reproduciendo, setReproduciendo] = useState(() => !prefiereReducir())
  const [retenido, setRetenido] = useState(false)
  const [pestanaVisible, setPestanaVisible] = useState(true)
  const [ciclo, setCiclo] = useState(0)

  const avanza = varios && reproduciendo && !retenido && pestanaVisible

  useEffect(() => {
    if (!api) return
    const alSeleccionar = () => setActual(api.selectedScrollSnap())
    api.on('select', alSeleccionar)
    return () => {
      api.off('select', alSeleccionar)
    }
  }, [api])

  useEffect(() => {
    const alCambiar = () => setPestanaVisible(!document.hidden)
    document.addEventListener('visibilitychange', alCambiar)
    return () => document.removeEventListener('visibilitychange', alCambiar)
  }, [])

  // Cada vez que vuelve a avanzar, el conteo de 6 s empieza de nuevo (y la barra del indicador también).
  useEffect(() => {
    if (avanza) setCiclo((c) => c + 1)
  }, [avanza, actual])

  useEffect(() => {
    if (!api || !avanza) return
    const t = window.setTimeout(() => api.scrollNext(), AVANCE_MS)
    return () => window.clearTimeout(t)
  }, [api, avanza, ciclo])

  const ir = useCallback((i: number) => api?.scrollTo(i), [api])

  const alTeclear = (e: KeyboardEvent<HTMLElement>) => {
    if (!varios) return
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      api?.scrollPrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      api?.scrollNext()
    }
  }

  const alSalirFoco = (e: FocusEvent<HTMLElement>) => {
    if (!raiz.current?.contains(e.relatedTarget as Node | null)) setRetenido(false)
  }

  return (
    <section
      ref={raiz}
      className="f-carrusel"
      aria-roledescription="carrusel"
      aria-label="Novedades del colegio"
      onKeyDown={alTeclear}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setRetenido(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setRetenido(false)}
      onFocus={() => setRetenido(true)}
      onBlur={alSalirFoco}
    >
      {/* A todo el ancho: mientras está bajo la barra de redes, la barra se aparta (BarraRedes). */}
      <div className="f-carrusel__vista" ref={vista} data-sin-barra-redes>
        {/* Mientras avanza solo, los cambios no se anuncian; detenido, se anuncian con cortesía. */}
        <div className="f-carrusel__pista" aria-live={avanza ? 'off' : 'polite'}>
          {banners.map((b, i) => (
            <Diapositiva key={b.id} banner={b} indice={i} total={banners.length} activa={i === actual} />
          ))}
        </div>
      </div>

      {varios && (
        <div className="f-carrusel__controles">
          <button type="button" className="f-carrusel__boton" onClick={() => api?.scrollPrev()} aria-label="Novedad anterior">
            <ChevronLeft size={22} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <div className="f-carrusel__puntos">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                className="f-punto"
                onClick={() => ir(i)}
                aria-label={`Ir a la novedad ${i + 1} de ${banners.length}: ${b.titulo}`}
                aria-current={i === actual ? 'true' : undefined}
              >
                <span className="f-punto__pista" aria-hidden="true">
                  {i === actual && (
                    <span
                      key={ciclo}
                      className="f-punto__barra"
                      data-corriendo={avanza || undefined}
                      style={{ '--avance': `${AVANCE_MS}ms` } as CSSProperties}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
          <button type="button" className="f-carrusel__boton" onClick={() => api?.scrollNext()} aria-label="Novedad siguiente">
            <ChevronRight size={22} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <button type="button" className="f-carrusel__pausa" onClick={() => setReproduciendo((v) => !v)}>
            {reproduciendo ? <Pause size={18} strokeWidth={2.5} aria-hidden="true" /> : <Play size={18} strokeWidth={2.5} aria-hidden="true" />}
            <span>{reproduciendo ? 'Pausar' : 'Reproducir'}</span>
          </button>
        </div>
      )}
    </section>
  )
}

function Diapositiva({ banner: b, indice, total, activa }: { banner: Banner; indice: number; total: number; activa: boolean }) {
  const foco = b.puntoFocal ?? { x: 50, y: 50 }
  return (
    <div
      className={`f-banner${activa ? ' f-banner--activa' : ''}`}
      role="group"
      aria-roledescription="diapositiva"
      aria-label={`${indice + 1} de ${total}`}
      // Las novedades que no se ven no reciben foco ni se leen.
      {...(activa ? {} : { inert: '' })}
    >
      <img
        className={`f-banner__imagen${b.imagenMovil ? ' f-banner__imagen--escritorio' : ''}`}
        src={b.imagen.url}
        alt={b.imagen.alt}
        width={b.imagen.ancho ?? undefined}
        height={b.imagen.alto ?? undefined}
        style={{ objectPosition: `${foco.x}% ${foco.y}%` }}
        loading={indice === 0 ? 'eager' : 'lazy'}
        decoding="async"
      />
      {b.imagenMovil && (
        <img
          className="f-banner__imagen f-banner__imagen--movil"
          src={b.imagenMovil.url}
          alt={b.imagenMovil.alt}
          width={b.imagenMovil.ancho ?? undefined}
          height={b.imagenMovil.alto ?? undefined}
          loading="lazy"
          decoding="async"
        />
      )}
      <div className={`f-banner__placa f-banner__placa--${b.alineacion}`}>
        <h2 className="f-banner__titulo">{b.titulo}</h2>
        <p className="f-banner__meta">
          {CATEGORIA[b.categoria]}
          {b.fecha && (
            <>
              <span aria-hidden="true"> · </span>
              <time dateTime={b.fecha}>{fechaLegible(b.fecha)}</time>
            </>
          )}
        </p>
        {b.accion && (
          <EnlaceDestino destino={b.accion.destino} className="f-boton f-boton--oro f-banner__accion">
            <span className="f-boton__texto">
              {b.accion.etiqueta} <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
            </span>
          </EnlaceDestino>
        )}
      </div>
    </div>
  )
}
