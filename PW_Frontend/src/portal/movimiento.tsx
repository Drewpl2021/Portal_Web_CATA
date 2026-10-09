import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'motion/react'
import NumberFlow from '@number-flow/react'
import type { Imagen } from '../api/tipos'

/**
 * Se cumple una sola vez, cuando el elemento entra en pantalla.
 * Sin IntersectionObserver, el contenido se considera visto desde el inicio.
 */
export function useVisto<T extends Element>(margen = '0px 0px -12% 0px') {
  const ref = useRef<T>(null)
  const [visto, setVisto] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisto(true)
      return
    }
    const io = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setVisto(true)
          io.disconnect()
        }
      },
      { rootMargin: margen, threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margen])
  return { ref, visto }
}

export type Efecto = 'titulo' | 'subir' | 'foto' | 'barras' | 'escalonado' | 'carriles'

/**
 * Revela su contenido al entrar en pantalla con transiciones CSS (transform y opacity).
 * Los estilos viven en final.css bajo [data-revelar]. El estado inicial oculto solo aplica
 * cuando la página activó html.f-anim, así que sin JavaScript todo se ve desde el principio.
 */
export function Revelar({
  como: Etiqueta = 'div',
  efecto,
  retraso = 0,
  className,
  style,
  children,
  ...resto
}: {
  como?: ElementType
  efecto: Efecto
  retraso?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
  id?: string
  'aria-labelledby'?: string
}) {
  const { ref, visto } = useVisto<HTMLElement>()
  return (
    <Etiqueta
      ref={ref}
      className={className}
      data-revelar={efecto}
      data-visto={visto ? '' : undefined}
      style={{ ...style, '--retraso': `${retraso}ms` } as CSSProperties}
      {...resto}
    >
      {children}
    </Etiqueta>
  )
}

/**
 * Foto grande con parallax suave: la imagen se desplaza un 6 % dentro de su marco al hacer scroll.
 * Con «reducir movimiento», queda quieta.
 */
export function FotoParallax({
  imagen,
  proporcion,
  className = '',
  sizes,
}: {
  imagen: Imagen
  proporcion: string
  className?: string
  sizes?: string
}) {
  const marco = useRef<HTMLDivElement>(null)
  const reducir = useReducedMotion()
  const [fallo, setFallo] = useState(false)
  const { scrollYProgress } = useScroll({ target: marco, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const transform = useMotionTemplate`translateY(${y})`
  if (fallo) return null

  return (
    <Revelar efecto="foto" className={`f-foto ${className}`}>
      <div ref={marco} className="f-foto__marco" style={{ aspectRatio: proporcion }}>
        <motion.div className="f-foto__capa" style={reducir ? undefined : { transform }}>
          <img
            src={imagen.url}
            alt={imagen.alt}
            width={imagen.ancho ?? undefined}
            height={imagen.alto ?? undefined}
            sizes={sizes}
            loading="lazy"
            decoding="async"
            onError={() => setFallo(true)}
          />
        </motion.div>
      </div>
    </Revelar>
  )
}

/**
 * Cifra que sube desde 0 hasta su valor cuando entra en pantalla (NumberFlow anima cada dígito).
 * El número animado es decorativo; el valor real se lee siempre en el texto oculto.
 */
export function Contador({ valor, sufijo }: { valor: number; sufijo: string | null }) {
  const { ref, visto } = useVisto<HTMLSpanElement>('0px 0px -20% 0px')
  return (
    <span ref={ref} className="f-contador">
      <span aria-hidden="true">
        <NumberFlow
          value={visto ? valor : 0}
          suffix={sufijo ?? undefined}
          locales="es-PE"
          format={{ useGrouping: false }}
          transformTiming={{ duration: 1100, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
          spinTiming={{ duration: 1100, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
        />
      </span>
      <span className="visually-hidden">
        {valor}
        {sufijo ?? ''}
      </span>
    </span>
  )
}
