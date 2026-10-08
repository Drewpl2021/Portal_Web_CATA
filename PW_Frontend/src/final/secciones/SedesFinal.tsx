import type { CSSProperties } from 'react'
import { MapPin, Phone } from 'lucide-react'
import { obtenerSedes } from '../../api/servicios'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import Imagen from '../../components/Imagen'
import { useRecurso } from '../../hooks/useRecurso'
import { enlaceMapa, enlaceTel } from '../../lib/formato'
import { Revelar } from '../movimiento'

const NUMEROS = ['Ninguna', 'Una', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho']

export default function SedesFinal() {
  const r = useRecurso('sedes', obtenerSedes)
  const titulo =
    r.estado === 'listo' && r.datos.length > 1 ? `${NUMEROS[r.datos.length] ?? r.datos.length} sedes en San Román` : 'Sedes'

  return (
    <section className="f-seccion f-sedes" aria-labelledby="f-sedes-titulo">
      <div className="f-seccion__interior">
        <h2 className="f-titulo" id="f-sedes-titulo">
          <Revelar como="span" efecto="titulo" className="f-barrido">
            {r.estado === 'listo' && r.datos.length === 1 ? 'Sede' : titulo}
          </Revelar>
        </h2>
        {r.estado === 'cargando' && <Cargando que="las sedes" lineas={4} conTitulo={false} />}
        {r.estado === 'error' && <ErrorCarga que="las sedes" reintentar={r.reintentar} />}
        {r.estado === 'listo' && r.datos.length === 0 && (
          <p className="f-vacio">Las direcciones de las sedes se publicarán pronto.</p>
        )}
        {r.estado === 'listo' && r.datos.length > 0 && (
          <Revelar como="ul" efecto="escalonado" className="f-sedes__lista">
            {r.datos.map((s, i) => (
              <li key={s.id} className="f-tarjeta f-sede" style={{ '--i': i } as CSSProperties}>
                <Imagen imagen={s.foto} proporcion="4 / 3" className="f-sede__foto" sizes="(min-width: 1100px) 25vw, (min-width: 700px) 50vw, 100vw" />
                <div className="f-sede__texto">
                  <h3 className="f-sede__nombre">{s.nombre}</h3>
                  <p className="f-sede__direccion">{s.direccion}</p>
                  {(s.referencia || s.distrito) && (
                    <p className="f-sede__detalle">
                      {s.referencia}
                      {s.referencia && s.distrito && <br />}
                      {s.distrito}
                    </p>
                  )}
                  {s.nota && <p className="f-sede__detalle">{s.nota}</p>}
                  <p className="f-sede__acciones">
                    <a className="f-enlace f-enlace--chico" href={enlaceMapa(s)} target="_blank" rel="noreferrer">
                      <MapPin size={16} aria-hidden="true" /> Cómo llegar
                      <span className="visually-hidden"> a {s.nombre} (se abre en otra pestaña)</span>
                    </a>
                    {s.telefono && (
                      <a className="f-enlace f-enlace--chico" href={enlaceTel(s.telefono)}>
                        <Phone size={16} aria-hidden="true" />
                        <span className="visually-hidden">Llamar a {s.nombre}: </span>
                        {s.telefono.visible}
                      </a>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </Revelar>
        )}
      </div>
    </section>
  )
}
