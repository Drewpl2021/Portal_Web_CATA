import { useState } from 'react'
import type { Imagen as ImagenApi } from '../api/tipos'

interface Props {
  imagen: ImagenApi | null
  /** Proporción del espacio, p. ej. "4 / 3". Sin proporción, la imagen se muestra completa. */
  proporcion?: string
  className?: string
  sizes?: string
  prioridad?: boolean
}

// Muestra una imagen de la API. Si no hay imagen o no carga, no deja hueco.
export default function Imagen({ imagen, proporcion, className = '', sizes, prioridad = false }: Props) {
  const [fallo, setFallo] = useState(false)
  if (!imagen || fallo) return null

  const decorativa = imagen.alt.trim() === ''

  return (
    <div
      className={`imagen ${proporcion ? 'imagen--recortada' : ''} ${className}`}
      style={proporcion ? { aspectRatio: proporcion } : undefined}
    >
      <img
        src={imagen.url}
        alt={decorativa ? '' : imagen.alt}
        width={imagen.ancho ?? undefined}
        height={imagen.alto ?? undefined}
        sizes={sizes}
        loading={prioridad ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFallo(true)}
      />
    </div>
  )
}
