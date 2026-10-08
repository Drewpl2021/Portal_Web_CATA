/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base de la API del módulo Portal web en RR.HH. Vacía = datos de prueba locales. */
  readonly VITE_API_URL?: string
  /** Escenario de datos de prueba por defecto (tipico, corto, largo, sin-foto, alt-vacio, vacio, error). */
  readonly VITE_MOCK_ESCENARIO?: string
  /** Retraso simulado en milisegundos para los datos de prueba. */
  readonly VITE_MOCK_RETRASO?: string
}
