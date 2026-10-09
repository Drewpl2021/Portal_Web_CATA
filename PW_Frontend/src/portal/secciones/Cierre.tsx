import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { obtenerSitio } from '../../api/servicios'
import { useRecurso } from '../../hooks/useRecurso'
import { useRutaInterna } from '../../sitio/BaseRuta'
import { Revelar } from '../movimiento'

// Cierre celeste: título blanco grande y dos acciones. Sin texto normal sobre el celeste.
export default function CierreFinal() {
  const sitio = useRecurso('sitio', obtenerSitio)
  const interna = useRutaInterna()
  const nombre = sitio.estado === 'listo' ? sitio.datos.nombreCorto : 'el colegio'

  return (
    <section className="f-seccion f-cierre" aria-labelledby="f-cierre-titulo">
      <div className="f-cierre__franjas" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="f-seccion__interior f-cierre__interior">
        <h2 className="f-titulo f-titulo--blanco f-titulo--enorme" id="f-cierre-titulo">
          <Revelar como="span" efecto="titulo" className="f-barrido">
            ¿Quieres conocer {nombre}?
          </Revelar>
        </h2>
        <div className="f-cierre__acciones">
          <Link to={interna('/matricula')} className="f-boton f-boton--oro">
            <span className="f-boton__texto">
              Proceso de matrícula <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
            </span>
          </Link>
          <Link to={interna('/contacto')} className="f-boton f-boton--blanco">
            <span className="f-boton__texto">Contáctanos</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
