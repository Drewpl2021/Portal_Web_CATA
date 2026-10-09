// Rutas internas del sitio. Al principio servía para anteponer un prefijo de revisión a las rutas
// (las propuestas de diseño); hoy las rutas van tal cual. Se mantiene para no tocar todos los enlaces.
export function useRutaInterna() {
  return (ruta: string) => ruta
}
