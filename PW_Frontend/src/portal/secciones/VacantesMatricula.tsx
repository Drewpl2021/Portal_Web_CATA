import type { CSSProperties } from 'react'
import { MessageCircle } from 'lucide-react'
import { obtenerVacantes } from '../../api/servicios'
import type { EstadoVacante, VacantesNivel } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import { fechaLegible } from '../../lib/formato'
import { Contador, Revelar } from '../movimiento'

const ESTADO: Record<EstadoVacante, string> = {
  disponible: 'Vacantes disponibles',
  pocas: 'Últimas vacantes',
  agotadas: 'Vacantes agotadas',
  consultar: 'Consulta las vacantes',
}

// Niveles y vacantes como carriles inclinados sobre el campo celeste, igual que los niveles de Inicio.
// El estado siempre se dice con texto; el número solo aparece si el colegio lo publica.
export default function VacantesMatricula() {
  const r = useRecurso('matricula-vacantes', obtenerVacantes)

  return (
    <section className="f-seccion f-niveles f-vacantes" id="vacantes" aria-labelledby="f-vacantes-titulo">
      <div className="f-seccion__interior">
        <div className="f-seccion__cabeza">
          <h2 className="f-titulo f-titulo--blanco" id="f-vacantes-titulo">
            <Revelar como="span" efecto="titulo" className="f-barrido">
              Niveles y vacantes
            </Revelar>
          </h2>
          {r.estado === 'listo' && r.datos.actualizado && (
            <p className="f-vacantes__fecha">Actualizado el {fechaLegible(r.datos.actualizado)}</p>
          )}
        </div>
        {r.estado === 'cargando' && <Cargando que="las vacantes" lineas={4} conTitulo={false} className="f-cargando--claro" />}
        {r.estado === 'error' && <ErrorCarga que="las vacantes" reintentar={r.reintentar} className="f-error--claro" />}
        {r.estado === 'listo' && (
          <>
            {r.datos.niveles.length === 0 ? (
              <p className="f-vacio f-vacio--claro">Las vacantes de cada nivel se publicarán pronto.</p>
            ) : (
              <Revelar como="ul" efecto="carriles" className="f-carriles">
                {r.datos.niveles.map((n, i) => (
                  <Carril key={n.id} nivel={n} i={i} />
                ))}
              </Revelar>
            )}
            {r.datos.nota && <p className="f-vacantes__nota">{r.datos.nota}</p>}
            <div className="f-vacantes__accion">
              <a href="#solicitar" className="f-boton f-boton--oro">
                <span className="f-boton__texto">
                  Preguntar por un grado <MessageCircle size={20} strokeWidth={2.5} aria-hidden="true" />
                </span>
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function Carril({ nivel, i }: { nivel: VacantesNivel; i: number }) {
  // El número solo acompaña a «disponible» y «pocas»; «agotadas» y «consultar» se dicen solo con texto.
  const conNumero = nivel.vacantes !== null && (nivel.estado === 'disponible' || nivel.estado === 'pocas')
  return (
    <li
      className={`f-carril f-carril--vacante f-carril--${i % 2 === 0 ? 'marino' : 'blanco'}`}
      style={{ '--i': i } as CSSProperties}
    >
      <h3 className="f-carril__nombre">{nivel.nivel}</h3>
      <div className="f-carril__datos">{nivel.detalle && <p className="f-carril__rango">{nivel.detalle}</p>}</div>
      <p className={`f-estado f-estado--${nivel.estado}`}>
        {conNumero ? (
          <>
            <span className="f-estado__numero">
              <Contador valor={nivel.vacantes!} sufijo={null} />
            </span>
            <span className="f-estado__texto">
              {nivel.vacantes === 1 ? 'vacante' : 'vacantes'}
              {nivel.estado === 'pocas' && <span className="f-estado__detalle">Últimas vacantes</span>}
            </span>
          </>
        ) : (
          <span className="f-estado__texto">{ESTADO[nivel.estado]}</span>
        )}
      </p>
    </li>
  )
}
