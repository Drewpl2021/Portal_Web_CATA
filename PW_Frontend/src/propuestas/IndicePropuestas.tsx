import { Link } from 'react-router-dom'
import './indice.css'

const PROPUESTAS = [
  {
    ruta: '/propuesta-a',
    letra: 'A',
    nombre: 'Polideportivo',
    idea: 'La energía de un día de olimpiadas: franjas diagonales como de camiseta, alumnos grandes al frente y tipografía ancha.',
  },
  {
    ruta: '/propuesta-b',
    letra: 'B',
    nombre: 'Desfile',
    idea: 'El orgullo de la escolta: estandartes que cuelgan y se mecen, azul profundo y dorado de ceremonia.',
  },
  {
    ruta: '/propuesta-c',
    letra: 'C',
    nombre: 'Muro de afiches',
    idea: 'Un afiche suizo moderno: retícula estricta, titular enorme, fotos recortadas en bloques y formas del emblema.',
  },
]

export default function IndicePropuestas() {
  return (
    <main className="indice">
      <h1>Propuestas de cabecera y portada</h1>
      <p>Tres direcciones distintas para la cabecera con menú y el hero de Inicio. Elige una para construir el resto del sitio.</p>
      <ul>
        {PROPUESTAS.map((p) => (
          <li key={p.ruta}>
            <Link to={p.ruta}>
              <span className="indice__letra" aria-hidden="true">
                {p.letra}
              </span>
              <span>
                <strong>
                  <span className="visually-hidden">Propuesta {p.letra}: </span>
                  {p.nombre}
                </strong>
                <span className="indice__idea">{p.idea}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

// Barra para saltar entre propuestas, al pie de cada una.
export function CambiarPropuesta({ actual }: { actual: 'A' | 'B' | 'C' }) {
  return (
    <nav className="cambiar-propuesta" aria-label="Cambiar de propuesta">
      <span>Propuesta {actual}</span>
      <ul>
        {PROPUESTAS.map((p) => (
          <li key={p.letra}>
            <Link to={p.ruta} aria-current={p.letra === actual ? 'page' : undefined}>
              {p.letra} · {p.nombre}
            </Link>
          </li>
        ))}
        <li>
          <Link to="/propuestas">Ver las tres</Link>
        </li>
      </ul>
    </nav>
  )
}

// Contenido provisional de las páginas internas mientras no se elige una propuesta.
export function PaginaPendiente({ titulo }: { titulo: string }) {
  return (
    <div className="pendiente">
      <h1>{titulo}</h1>
      <p>Esta página se construirá cuando elijas una propuesta. Por ahora sirve para probar el menú y la transición entre páginas.</p>
    </div>
  )
}
