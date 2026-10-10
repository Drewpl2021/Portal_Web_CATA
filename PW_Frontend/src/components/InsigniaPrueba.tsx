import { useId, useState } from 'react'
import { FlaskConical } from 'lucide-react'
import { ESCENARIOS, origen } from '../api/servicios'

const NOMBRES: Record<(typeof ESCENARIOS)[number], string> = {
  tipico: 'Típico',
  corto: 'Textos cortos',
  largo: 'Textos muy largos',
  'sin-foto': 'Sin fotos',
  'alt-vacio': 'Fotos con alt vacío',
  vacio: 'Sin contenido',
  error: 'Error en todo',
}

// En desarrollo, visible siempre que la página use los JSON locales, para que nadie los confunda con
// contenido publicado. En la demo (npm run build:demo), que se usa para presentar la propuesta, se
// oculta: confunde en una presentación. Ahí aparece solo con ?pruebas en la dirección. Las marcas
// «Foto de prueba» y los avisos de datos por confirmar siguen a la vista en los dos casos.
const EN_LA_DEMO = import.meta.env.MODE === 'demo'
const visible = !EN_LA_DEMO || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('pruebas'))

export default function InsigniaPrueba() {
  const id = useId()
  const [abierta, setAbierta] = useState(false)
  if (origen.tipo !== 'local' || !visible) return null

  const cambiar = (escenario: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('escenario', escenario)
    window.location.assign(url)
  }

  return (
    <aside className="insignia-prueba" aria-label="Datos de prueba">
      <button type="button" aria-expanded={abierta} aria-controls={id} onClick={() => setAbierta((a) => !a)}>
        <FlaskConical size={16} aria-hidden="true" />
        Datos de prueba · {NOMBRES[origen.escenario]}
      </button>
      <div id={id} hidden={!abierta} className="insignia-prueba__panel">
        <label htmlFor={`${id}-escenario`}>Escenario</label>
        <select id={`${id}-escenario`} value={origen.escenario} onChange={(e) => cambiar(e.target.value)}>
          {ESCENARIOS.map((e) => (
            <option key={e} value={e}>
              {NOMBRES[e]}
            </option>
          ))}
        </select>
        <p>
          Sin <code>VITE_API_URL</code> la página lee <code>src/api/mock/</code>. Agrega <code>?retraso=1500</code> a la
          dirección para ver los estados de carga.
        </p>
      </div>
    </aside>
  )
}
