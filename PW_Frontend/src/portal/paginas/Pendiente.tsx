// Páginas del mapa del sitio que todavía no se construyen.
export default function Pendiente({ titulo }: { titulo: string }) {
  return (
    <div className="f-seccion">
      <div className="f-seccion__interior">
        <h1 className="f-titulo">{titulo}</h1>
        <p className="f-vacio f-pendiente__texto">Esta página está en construcción.</p>
      </div>
    </div>
  )
}
