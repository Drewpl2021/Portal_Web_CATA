import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Comportamiento accesible del menú principal, compartido por todas las cabeceras.
 * Patrón de navegación con divulgación (WAI-ARIA): botones con aria-expanded, sin role="menu".
 * - Mega menú: clic o Enter/Espacio lo abren; Esc lo cierra y devuelve el foco al botón;
 *   se cierra al salir el foco, al hacer clic fuera o al cambiar de página.
 * - Menú móvil: al abrir, el foco va al primer enlace y el resto de la página queda inerte;
 *   Esc o el botón lo cierran y el foco vuelve a la hamburguesa.
 */
export function useNavegacion() {
  const ubicacion = useLocation()
  const idMega = useId()
  const idMovil = useId()

  const [megaAbierto, setMegaAbierto] = useState(false)
  const [movilAbierto, setMovilAbierto] = useState(false)

  const botonMega = useRef<HTMLButtonElement>(null)
  const panelMega = useRef<HTMLDivElement>(null)
  const botonMovil = useRef<HTMLButtonElement>(null)
  const panelMovil = useRef<HTMLDivElement>(null)

  // Cambiar de página cierra todo.
  useEffect(() => {
    setMegaAbierto(false)
    setMovilAbierto(false)
  }, [ubicacion.pathname])

  // Mega menú: Esc y clic fuera.
  useEffect(() => {
    if (!megaAbierto) return
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaAbierto(false)
        botonMega.current?.focus()
      }
    }
    const alPulsar = (e: PointerEvent) => {
      const t = e.target as Node
      if (!panelMega.current?.contains(t) && !botonMega.current?.contains(t)) setMegaAbierto(false)
    }
    document.addEventListener('keydown', alTeclear)
    document.addEventListener('pointerdown', alPulsar)
    return () => {
      document.removeEventListener('keydown', alTeclear)
      document.removeEventListener('pointerdown', alPulsar)
    }
  }, [megaAbierto])

  // Si el foco sale del botón y del panel, el mega menú se cierra.
  const alSalirFocoMega = useCallback((e: React.FocusEvent) => {
    const siguiente = e.relatedTarget as Node | null
    if (siguiente && (panelMega.current?.contains(siguiente) || botonMega.current?.contains(siguiente))) return
    if (siguiente) setMegaAbierto(false)
  }, [])

  // Menú móvil: foco, Esc, página inerte y sin scroll de fondo.
  useEffect(() => {
    if (!movilAbierto) return
    const fondo = Array.from(document.querySelectorAll<HTMLElement>('[data-fondo-menu]'))
    fondo.forEach((el) => el.setAttribute('inert', ''))
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelMovil.current?.querySelector<HTMLElement>('a, button')?.focus()

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMovilAbierto(false)
        botonMovil.current?.focus()
      }
    }
    document.addEventListener('keydown', alTeclear)
    return () => {
      fondo.forEach((el) => el.removeAttribute('inert'))
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', alTeclear)
    }
  }, [movilAbierto])

  // El menú móvil se cierra si la ventana pasa a escritorio.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1100px)')
    const alCambiar = () => mq.matches && setMovilAbierto(false)
    mq.addEventListener('change', alCambiar)
    return () => mq.removeEventListener('change', alCambiar)
  }, [])

  return {
    ruta: ubicacion.pathname,
    mega: {
      abierto: megaAbierto,
      alternar: () => setMegaAbierto((v) => !v),
      abrir: () => setMegaAbierto(true),
      cerrar: () => setMegaAbierto(false),
      boton: {
        ref: botonMega,
        'aria-expanded': megaAbierto,
        'aria-controls': idMega,
        onClick: () => setMegaAbierto((v) => !v),
        onBlur: alSalirFocoMega,
      },
      panel: { ref: panelMega, id: idMega, onBlur: alSalirFocoMega },
    },
    movil: {
      abierto: movilAbierto,
      cerrar: () => {
        setMovilAbierto(false)
        botonMovil.current?.focus()
      },
      boton: {
        ref: botonMovil,
        'aria-expanded': movilAbierto,
        'aria-controls': idMovil,
        'aria-label': movilAbierto ? 'Cerrar menú' : 'Abrir menú',
        onClick: () => setMovilAbierto((v) => !v),
      },
      panel: { ref: panelMovil, id: idMovil },
    },
  }
}
