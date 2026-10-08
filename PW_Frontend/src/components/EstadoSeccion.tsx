import { RotateCw } from 'lucide-react'

// Esqueleto mientras carga. Los bloques son decorativos; el texto oculto avisa a lectores de pantalla.
export function Cargando({
  que,
  lineas = 3,
  conTitulo = true,
  className = '',
}: {
  que: string
  lineas?: number
  conTitulo?: boolean
  className?: string
}) {
  return (
    <div className={`cargando ${className}`} role="status">
      <span className="visually-hidden">Cargando {que}…</span>
      {conTitulo && <span className="cargando__titulo" aria-hidden="true" />}
      {Array.from({ length: lineas }, (_, i) => (
        <span className="cargando__linea" aria-hidden="true" key={i} />
      ))}
    </div>
  )
}

// Error de una sola sección: el resto de la página sigue funcionando.
export function ErrorCarga({ que, reintentar, className = '' }: { que: string; reintentar: () => void; className?: string }) {
  return (
    <div className={`error-carga ${className}`} role="alert">
      <p className="error-carga__mensaje">No pudimos cargar {que}.</p>
      <p className="error-carga__ayuda">Revisa tu conexión e inténtalo de nuevo.</p>
      <button type="button" className="boton-secundario" onClick={reintentar}>
        <RotateCw size={18} aria-hidden="true" /> Reintentar
      </button>
    </div>
  )
}
