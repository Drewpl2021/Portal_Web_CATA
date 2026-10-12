/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base de la API del módulo Portal web en RR.HH. Vacía = datos de prueba locales. */
  readonly VITE_API_URL?: string
  /** Escenario de datos de prueba por defecto (tipico, corto, largo, sin-foto, alt-vacio, vacio, error). */
  readonly VITE_MOCK_ESCENARIO?: string
  /** Retraso simulado en milisegundos para los datos de prueba. */
  readonly VITE_MOCK_RETRASO?: string
}

// La navegación del sitio que se descargó al compilar (vite.config.ts): el valor inicial del menú.
declare module 'virtual:navegacion-inicial' {
  const navegacion: import('./api/tipos').Navegacion
  export default navegacion
}
