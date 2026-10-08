import { createContext, useContext } from 'react'

// Prefijo de las rutas internas: '' en el sitio real, '/propuesta-final' mientras se revisa.
const BaseRuta = createContext('')

export const ProveedorBaseRuta = BaseRuta.Provider

export function useRutaInterna() {
  const base = useContext(BaseRuta)
  return (ruta: string) => (ruta === '/' ? base || '/' : base + ruta)
}
