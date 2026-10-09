import { useEffect, useRef, type ReactNode } from 'react'
import { motion } from 'motion/react'

// Transición entre páginas: la nueva entra subiendo apenas y la anterior se va más rápido.
// Con «reducir movimiento» activado, MotionConfig deja solo el fundido.
const SALIDA = [0.23, 1, 0.32, 1] as const

// Tras navegar dentro del sitio, el foco pasa al contenido de la página nueva para que el lector
// de pantalla la anuncie y el teclado siga desde ahí. En la primera carga no se mueve.
let enfocarAlMontar = false
export const pedirFocoEnPaginaNueva = () => {
  enfocarAlMontar = true
}

export default function TransicionPagina({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!enfocarAlMontar) return
    enfocarAlMontar = false
    ref.current?.querySelector<HTMLElement>('#contenido')?.focus({ preventScroll: true })
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, transform: 'translateY(12px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)', transitionEnd: { transform: 'none' }, transition: { duration: 0.28, ease: SALIDA } }}
      exit={{ opacity: 0, transform: 'translateY(-6px)', transition: { duration: 0.16, ease: SALIDA } }}
    >
      {children}
    </motion.div>
  )
}
