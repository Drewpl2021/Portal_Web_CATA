// Índice de una página interna: franja marina con enlaces a cada sección.
export default function IndicePagina({ secciones }: { secciones: { id: string; etiqueta: string }[] }) {
  return (
    <nav className="f-indice" aria-label="En esta página">
      <ul className="f-indice__lista">
        {secciones.map((s) => (
          <li key={s.id}>
            <a className="f-indice__enlace" href={`#${s.id}`}>
              {s.etiqueta}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
