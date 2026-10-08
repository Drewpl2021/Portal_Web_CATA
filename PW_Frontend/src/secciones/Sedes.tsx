import { MapPin, Phone } from 'lucide-react'
import { obtenerSedes } from '../api/servicios'
import { Cargando, ErrorCarga } from '../components/EstadoSeccion'
import Imagen from '../components/Imagen'
import { useRecurso } from '../hooks/useRecurso'
import { enlaceMapa, enlaceTel } from '../lib/formato'

const NUMEROS = ['Ninguna', 'Una', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho']

export default function Sedes() {
  const r = useRecurso('sedes', obtenerSedes)

  const titulo =
    r.estado === 'listo' && r.datos.length > 1 ? `${NUMEROS[r.datos.length] ?? r.datos.length} sedes` : 'Sedes'

  return (
    <section className="sedes" id="sedes" aria-labelledby="sedes-titulo" aria-busy={r.estado === 'cargando'}>
      <div className="sedes__marco">
        <h2 className="titulo-rotulo sedes__titulo" id="sedes-titulo">
          {r.estado === 'listo' && r.datos.length === 1 ? 'Sede' : titulo}
        </h2>
        {r.estado === 'cargando' && <Cargando que="las sedes" lineas={4} conTitulo={false} className="cargando--oscuro" />}
        {r.estado === 'error' && <ErrorCarga que="las sedes" reintentar={r.reintentar} className="error-carga--oscuro" />}
        {r.estado === 'listo' && r.datos.length === 0 && (
          <p className="vacio vacio--oscuro">Las direcciones de las sedes se publicarán pronto.</p>
        )}
        {r.estado === 'listo' && r.datos.length > 0 && (
          <ol className={`sedes__linea${r.datos.length > 4 ? ' sedes__linea--muchas' : ''}`}>
            {r.datos.map((s) => (
              <li className="sede" key={s.id}>
                <span className="sede__punto" aria-hidden="true" />
                <h3 className="sede__nombre">{s.nombre}</h3>
                <Imagen imagen={s.foto} proporcion="4 / 3" className="sede__foto" sizes="(min-width: 1080px) 22vw, (min-width: 760px) 45vw, 100vw" />
                <p className="sede__direccion">{s.direccion}</p>
                {(s.referencia || s.distrito) && (
                  <p className="sede__referencia">
                    {s.referencia}
                    {s.referencia && s.distrito && <br />}
                    {s.distrito}
                  </p>
                )}
                {s.nota && <p className="sede__nota">{s.nota}</p>}
                <p className="sede__acciones">
                  <a href={enlaceMapa(s)} target="_blank" rel="noreferrer">
                    <MapPin size={16} aria-hidden="true" /> Cómo llegar
                    <span className="visually-hidden"> a {s.nombre} (se abre en otra pestaña)</span>
                  </a>
                  {s.telefono && (
                    <a href={enlaceTel(s.telefono)}>
                      <Phone size={16} aria-hidden="true" />
                      <span className="visually-hidden">Llamar a {s.nombre}: </span>
                      {s.telefono.visible}
                    </a>
                  )}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
