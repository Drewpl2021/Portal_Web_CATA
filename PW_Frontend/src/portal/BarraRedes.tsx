import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { obtenerSitio } from '../api/servicios'
import type { RedSocial } from '../api/tipos'
import { useRecurso } from '../hooks/useRecurso'
import { MARCAS } from './redes'

/** Icono blanco de la red (decorativo: el nombre va en el texto del enlace). */
export function IconoRed({ red }: { red: RedSocial['red'] }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={MARCAS[red].d} fill="currentColor" />
    </svg>
  )
}

// Texto del enlace: el nombre visible de la red y, para el lector de pantalla, de quién es,
// la aclaración si el dato aún no está confirmado y que se abre en otra pestaña.
function NombreAccesible({ red }: { red: RedSocial }) {
  return <span className="visually-hidden"> del colegio{red.aclaracion && `, ${red.aclaracion}`} (se abre en otra pestaña)</span>
}

/** Lista de redes con icono y nombre a la vista: pie de página y menú móvil. */
export function ListaRedes({ redes, className }: { redes: RedSocial[]; className?: string }) {
  if (redes.length === 0) return null
  return (
    <ul className={['f-lista-redes', className].filter(Boolean).join(' ')}>
      {redes.map((red) => (
        <li key={red.red}>
          <a className="f-lista-redes__enlace" href={red.url} target="_blank" rel="noreferrer">
            <span className="f-placa-red" style={{ '--marca': MARCAS[red.red].color } as CSSProperties}>
              <IconoRed red={red.red} />
            </span>
            <span className="f-lista-redes__texto">
              {MARCAS[red.red].nombre}
              <NombreAccesible red={red} />
              {red.aclaracion && (
                <span className="f-lista-redes__aclaracion" aria-hidden="true">
                  {red.aclaracion}
                </span>
              )}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

// Cuándo apartarse: al bajar por la página (el lector tiene la página para él; vuelve al subir)
// y mientras una composición a todo el ancho marcada con data-sin-barra-redes (el carrusel, la
// escena de Propuesta) pasa por debajo de la barra, para no tapar el texto de un afiche ni una foto.
function useApartarse(barra: React.RefObject<HTMLElement | null>, activa: boolean) {
  const [bajando, setBajando] = useState(false)
  const [tapa, setTapa] = useState<boolean | null>(null)
  useEffect(() => {
    if (!activa) return
    let anterior = window.scrollY
    let pendiente = false
    const medir = () => {
      pendiente = false
      const el = barra.current
      if (!el) return
      const y = window.scrollY
      const delta = y - anterior
      if (Math.abs(delta) >= 8) {
        setBajando(delta > 0 && y > 240)
        anterior = y
      }
      if (getComputedStyle(el).display === 'none') return setTapa(false)
      // Caja de la barra sin su transform (está centrada con translateY(-50%)), con un margen de 8 px.
      const arriba = el.offsetTop - el.offsetHeight / 2 - 8
      const abajo = arriba + el.offsetHeight + 16
      const izquierda = el.offsetLeft - 8
      const cruza = [...document.querySelectorAll('[data-sin-barra-redes]')].some((c) => {
        const r = c.getBoundingClientRect()
        return r.width > 0 && r.right > izquierda && r.top < abajo && r.bottom > arriba
      })
      setTapa(cruza)
    }
    const pedir = () => {
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(medir)
    }
    pedir()
    // Las composiciones aparecen al cargar sus datos o al cambiar de página, sin scroll de por medio.
    const cambios = new MutationObserver(pedir)
    cambios.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('scroll', pedir, { passive: true })
    window.addEventListener('resize', pedir)
    return () => {
      cambios.disconnect()
      window.removeEventListener('scroll', pedir)
      window.removeEventListener('resize', pedir)
    }
  }, [barra, activa])
  return { bajando, tapa }
}

/**
 * Barra flotante de redes oficiales, en el borde derecho. Solo aparece cuando el margen lateral
 * de la página le deja sitio (desde 1360 px, ver portal.css), así no tapa contenido ni controles;
 * y se aparta cuando pasa por debajo una composición a todo el ancho. En pantallas menores, las
 * redes están en el menú móvil y, siempre, en el pie.
 * Va después del pie en el orden del documento para no interrumpir la lectura con el teclado.
 */
export default function BarraRedes() {
  const r = useRecurso('sitio', obtenerSitio)
  const hay = r.estado === 'listo' && r.datos.redes.length > 0
  const barra = useRef<HTMLElement>(null)
  const { bajando, tapa } = useApartarse(barra, hay)
  // La entrada escalonada espera a la primera vez que la barra puede verse sin tapar nada.
  const [mostrada, setMostrada] = useState(false)
  useEffect(() => {
    if (tapa === false && !bajando) setMostrada(true)
  }, [tapa, bajando])
  // Escape recoge el nombre que se abrió al pasar el mouse (WCAG 1.4.13); se rearma al entrar o salir el mouse, o con el foco.
  const [recogida, setRecogida] = useState(false)
  // Como en los tooltips: el primer nombre se desliza; al pasar a otra red sin salir de la barra,
  // los siguientes aparecen al instante (recorrer la columna no debe sentirse lento).
  // data-recorriendo se pone poco después del primer hover, cuando su transición ya corre (cambiar
  // la duración no corta una transición en curso): así el primero se anima y los siguientes, que
  // encuentran la marca puesta, aparecen al instante. Va directo al DOM, sin volver a renderizar.
  const recorrido = useRef<number | null>(null)
  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setRecogida(true)
    }
    document.addEventListener('keydown', alPulsar)
    return () => document.removeEventListener('keydown', alPulsar)
  }, [])

  if (!hay) return null

  return (
    <nav
      ref={barra}
      className="f-barra-redes"
      aria-label="Redes sociales del colegio"
      data-mostrada={mostrada || undefined}
      data-oculta={bajando || tapa === true || undefined}
      data-recogida={recogida || undefined}
      onPointerEnter={() => setRecogida(false)}
      onPointerLeave={() => {
        setRecogida(false)
        if (recorrido.current !== null) window.clearTimeout(recorrido.current)
        recorrido.current = null
        barra.current?.removeAttribute('data-recorriendo')
      }}
      onFocus={() => {
        setRecogida(false)
        setMostrada(true)
      }}
    >
      <ul>
        {r.datos.redes.map((red, i) => (
          <li key={red.red} style={{ '--i': i, '--marca': MARCAS[red.red].color } as CSSProperties}>
            <a
              className="f-barra-redes__enlace"
              href={red.url}
              target="_blank"
              rel="noreferrer"
              onPointerEnter={(e) => {
                if (e.pointerType !== 'mouse') return
                if (recorrido.current !== null) return
                recorrido.current = window.setTimeout(() => barra.current?.setAttribute('data-recorriendo', ''), 50)
              }}
            >
              <span className="f-barra-redes__nombre">
                {MARCAS[red.red].nombre}
                {red.aclaracion && (
                  <span className="f-barra-redes__aclaracion" aria-hidden="true">
                    {red.aclaracion}
                  </span>
                )}
              </span>
              <NombreAccesible red={red} />
              <span className="f-placa-red f-barra-redes__placa" data-prueba={red.aclaracion ? '' : undefined}>
                <IconoRed red={red.red} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
