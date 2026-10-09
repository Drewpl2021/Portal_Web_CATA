import type { CSSProperties } from 'react'
import { Info } from 'lucide-react'
import { obtenerAcademia } from '../../api/servicios'
import type { Academia, ModalidadCiclo } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import { fechaLegible } from '../../lib/formato'
import { Revelar } from '../movimiento'
import Filtro, { useFiltroUrl } from './Filtro'

const MODALIDAD: Record<ModalidadCiclo, string> = { presencial: 'Presencial', virtual: 'Virtual' }
const soles = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })
const contar = (n: number) => (n === 1 ? '1 ciclo' : `${n} ciclos`)

// Academia preuniversitaria: el aviso de Matrícula para lo que falta, el filtro por universidad (?universidad=…)
// y cada ciclo en una ficha como las de Contacto. Precio y fechas solo aparecen si están publicados.
export default function AcademiaPropuesta() {
  const r = useRecurso('propuesta-academia', obtenerAcademia)

  return (
    <section className="f-seccion f-academia" id="academia" aria-labelledby="f-academia-titulo">
      <div className="f-seccion__interior">
        <h2 className="f-titulo" id="f-academia-titulo">
          <Revelar como="span" efecto="titulo" className="f-barrido">
            {r.estado === 'listo' ? r.datos.titulo : 'Academia preuniversitaria'}
          </Revelar>
        </h2>
        {r.estado === 'cargando' && <Cargando que="la academia" lineas={4} conTitulo={false} />}
        {r.estado === 'error' && <ErrorCarga que="la academia" reintentar={r.reintentar} />}
        {r.estado === 'listo' && <Cuerpo datos={r.datos} />}
      </div>
    </section>
  )
}

function Cuerpo({ datos }: { datos: Academia }) {
  const opciones = datos.universidades.map((u) => ({ id: u.id, nombre: u.nombre, n: u.ciclos.length }))
  const { activa, elegir } = useFiltroUrl('universidad', opciones)
  const visibles = activa ? datos.universidades.filter((u) => u.id === activa) : datos.universidades
  const total = datos.universidades.reduce((n, u) => n + u.ciclos.length, 0)

  return (
    <div className="f-academia__cuerpo">
      {datos.descripcion && <p className="f-proceso__resumen">{datos.descripcion}</p>}
      {datos.aclaracion && (
        <p className="f-aviso">
          <Info size={22} strokeWidth={2.5} aria-hidden="true" />
          <span>{datos.aclaracion}</span>
        </p>
      )}
      {datos.universidades.length === 0 ? (
        <p className="f-vacio">Los ciclos de la academia se publicarán pronto.</p>
      ) : (
        <>
          <Filtro
            etiqueta="Filtrar por universidad"
            opciones={opciones}
            activa={activa}
            alElegir={elegir}
            total={total}
            resultado={activa ? `${contar(visibles[0]!.ciclos.length)} · ${visibles[0]!.nombre}` : contar(total)}
          />
          {visibles.map((u) => (
            <section key={u.id} className="f-grupo-personas" aria-labelledby={`f-universidad-${u.id}`}>
              <h3 className="f-grupo-personas__titulo" id={`f-universidad-${u.id}`}>
                <span>{u.nombre}</span>
                <span className="f-grupo-personas__n">{contar(u.ciclos.length)}</span>
              </h3>
              <Revelar como="ul" efecto="escalonado" className="f-fichas f-fichas--ciclos">
                {u.ciclos.map((c, i) => (
                  <li key={c.id} className="f-ficha" style={{ '--i': i } as CSSProperties}>
                    <div className="f-ficha__cabeza">
                      <span className="f-ficha__numero" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h4 className="f-ficha__nombre">{c.nombre}</h4>
                    </div>
                    <ul className="f-meta" aria-label="Modalidades y turno">
                      {c.modalidades.map((m) => (
                        <li key={m}>{MODALIDAD[m]}</li>
                      ))}
                      {c.turno && <li>Turno: {c.turno}</li>}
                    </ul>
                    {(c.precio !== null || c.precioVirtual !== null || c.inicio || c.fin) && (
                      <dl className="f-funciones">
                        {c.precio !== null && (
                          <div>
                            <dt>Precio</dt>
                            <dd>{soles.format(c.precio)} (pago único)</dd>
                          </div>
                        )}
                        {c.precioVirtual !== null && (
                          <div>
                            <dt>Virtual</dt>
                            <dd>{soles.format(c.precioVirtual)}</dd>
                          </div>
                        )}
                        {c.inicio && (
                          <div>
                            <dt>Inicio</dt>
                            <dd>
                              <time dateTime={c.inicio}>{fechaLegible(c.inicio)}</time>
                            </dd>
                          </div>
                        )}
                        {c.fin && (
                          <div>
                            <dt>Fin</dt>
                            <dd>
                              <time dateTime={c.fin}>{fechaLegible(c.fin)}</time>
                            </dd>
                          </div>
                        )}
                      </dl>
                    )}
                  </li>
                ))}
              </Revelar>
            </section>
          ))}
        </>
      )}
    </div>
  )
}
