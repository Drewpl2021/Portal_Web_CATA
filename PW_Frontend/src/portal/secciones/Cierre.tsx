import { ArrowRight } from 'lucide-react'
import { obtenerCierre } from '../../api/servicios'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import EnlaceDestino from '../../sitio/EnlaceDestino'
import { Revelar } from '../movimiento'

// Cierre celeste: título blanco grande y hasta dos acciones (GET /v1/portada/cierre). Sin texto normal
// sobre el celeste. Si falla, solo esta sección muestra su error.
export default function CierreFinal() {
  const r = useRecurso('cierre', obtenerCierre)

  return (
    <section className="f-seccion f-cierre" aria-labelledby={r.estado === 'listo' ? 'f-cierre-titulo' : undefined} aria-label={r.estado === 'listo' ? undefined : 'Cierre'}>
      <div className="f-cierre__franjas" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="f-seccion__interior f-cierre__interior">
        {r.estado === 'cargando' && <Cargando que="el cierre" lineas={1} className="f-cargando--claro" />}
        {r.estado === 'error' && <ErrorCarga que="esta sección" reintentar={r.reintentar} className="f-error--claro" />}
        {r.estado === 'listo' && (
          <>
            <h2 className="f-titulo f-titulo--blanco f-titulo--enorme" id="f-cierre-titulo">
              <Revelar como="span" efecto="titulo" className="f-barrido">
                {r.datos.titulo}
              </Revelar>
            </h2>
            {r.datos.acciones.length > 0 && (
              <div className="f-cierre__acciones">
                {r.datos.acciones.map((a, i) => (
                  <EnlaceDestino key={i} destino={a.destino} className={`f-boton ${i === 0 ? 'f-boton--oro' : 'f-boton--blanco'}`}>
                    <span className="f-boton__texto">
                      {a.etiqueta}
                      {i === 0 && (
                        <>
                          {' '}
                          <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
                        </>
                      )}
                    </span>
                  </EnlaceDestino>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
