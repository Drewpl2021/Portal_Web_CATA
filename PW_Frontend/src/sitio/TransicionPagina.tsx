import type { ReactNode } from 'react'
import { motion } from 'motion/react'

// Transición entre páginas: la nueva entra subiendo apenas y la anterior se va más rápido.
// Con «reducir movimiento» activado, MotionConfig deja solo el fundido.
const SALIDA = [0.23, 1, 0.32, 1] as const

export default function TransicionPagina({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, transform: 'translateY(12px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)', transitionEnd: { transform: 'none' }, transition: { duration: 0.28, ease: SALIDA } }}
      exit={{ opacity: 0, transform: 'translateY(-6px)', transition: { duration: 0.16, ease: SALIDA } }}
    >
      {children}
    </motion.div>
  )
}
