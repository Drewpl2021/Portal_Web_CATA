import { useCallback, useEffect, useState } from 'react'

export type EstadoRecurso<T> =
  | { estado: 'cargando' }
  | { estado: 'error'; error: unknown }
  | { estado: 'listo'; datos: T }

// Varias secciones piden el mismo recurso (p. ej. «sitio»): se comparte una sola petición.
const enCurso = new Map<string, Promise<unknown>>()

/**
 * Carga un recurso de la capa de servicios y expone su estado.
 * `clave` identifica el recurso; dos componentes con la misma clave comparten la petición.
 */
export function useRecurso<T>(clave: string, cargar: () => Promise<T>) {
  const [intento, setIntento] = useState(0)
  const [estado, setEstado] = useState<EstadoRecurso<T>>({ estado: 'cargando' })

  useEffect(() => {
    let vigente = true
    setEstado({ estado: 'cargando' })

    let promesa = enCurso.get(clave) as Promise<T> | undefined
    if (!promesa) {
      promesa = cargar()
      enCurso.set(clave, promesa)
      // Un error no se cachea: el siguiente intento vuelve a pedir.
      promesa.catch(() => enCurso.delete(clave))
    }

    promesa.then(
      (datos) => vigente && setEstado({ estado: 'listo', datos }),
      (error) => vigente && setEstado({ estado: 'error', error }),
    )
    return () => {
      vigente = false
    }
    // cargar se considera estable por clave
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, intento])

  const reintentar = useCallback(() => {
    enCurso.delete(clave)
    setIntento((n) => n + 1)
  }, [clave])

  return { ...estado, reintentar } as EstadoRecurso<T> & { reintentar: () => void }
}
