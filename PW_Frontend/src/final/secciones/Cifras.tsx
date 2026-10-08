import type { CSSProperties } from 'react'
import { obtenerCifras } from '../../api/servicios'
import { useRecurso } from '../../hooks/useRecurso'
import { Contador, Revelar } from '../movimiento'

// Franja marina con las cifras del colegio: cada número sube hasta su valor al entrar en pantalla.
// Si no hay cifras, o fallan, la franja no aparece: es complementaria.
export default function Cifras() {
  const r = useRecurso('cifras', obtenerCifras)
  if (r.estado !== 'listo' || r.datos.length === 0) return null

  return (
    <section className="f-cifras" aria-label="El colegio en cifras">
      <Revelar como="ul" efecto="escalonado" className="f-cifras__lista">
        {r.datos.map((c, i) => (
          <li key={c.id} className="f-cifra" style={{ '--i': i } as CSSProperties}>
            <span className="f-cifra__valor">
              <Contador valor={c.valor} sufijo={c.sufijo} />
            </span>
            <span className="f-cifra__etiqueta">{c.etiqueta}</span>
          </li>
        ))}
      </Revelar>
    </section>
  )
}
