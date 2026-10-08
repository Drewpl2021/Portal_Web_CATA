import { useEffect, useId, useRef, useState } from 'react'

// Medalla traída de la propuesta B: el emblema al centro y el nombre del colegio girando a su alrededor.
// Es decorativa (aria-hidden): el nombre ya está escrito en la página.
export default function Medalla({
  nombre,
  anio,
  className = '',
}: {
  nombre: string
  anio: number | null
  className?: string
}) {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const [enPantalla, setEnPantalla] = useState(false)

  // El anillo solo gira mientras la medalla está en pantalla.
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((e) => setEnPantalla(e.some((x) => x.isIntersecting)))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const texto = `${nombre}${anio ? ` · desde ${anio}` : ''} · `
  return (
    <div ref={ref} className={`f-medalla ${className}`} data-en-pantalla={enPantalla || undefined} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="f-medalla__anillo">
        <defs>
          <path id={id} d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
        </defs>
        <text>
          <textPath href={`#${id}`} textLength="474">
            {texto.toUpperCase()}
          </textPath>
        </text>
      </svg>
      <img src="/brand/emblema-cata-192.png" alt="" width="96" height="96" />
    </div>
  )
}
