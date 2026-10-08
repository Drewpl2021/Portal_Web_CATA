import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { obtenerAvisoVigente } from '../../api/servicios'
import { useRecurso } from '../../hooks/useRecurso'
import { atributosExterno } from '../../lib/formato'
import { Revelar } from '../movimiento'

// Un solo aviso vigente, nunca en carrusel. Sin aviso, o si falla, no aparece.
export default function AvisoFinal() {
  const r = useRecurso('aviso', obtenerAvisoVigente)
  if (r.estado !== 'listo' || !r.datos) return null
  const { titulo, texto, imagen, enlace } = r.datos

  return (
    <section className="f-seccion f-aviso" aria-labelledby="f-aviso-titulo">
      <div className={`f-aviso__interior${imagen ? ' f-aviso__interior--imagen' : ''}`}>
        {imagen && (
          <Revelar efecto="foto" className="f-aviso__imagen">
            <img src={imagen.url} alt={imagen.alt} width={imagen.ancho ?? undefined} height={imagen.alto ?? undefined} loading="lazy" />
          </Revelar>
        )}
        <div className="f-aviso__texto">
          <h2 className="f-titulo f-titulo--chico" id="f-aviso-titulo">
            <Revelar como="span" efecto="titulo" className="f-barrido">
              {titulo}
            </Revelar>
          </h2>
          {texto && <p>{texto}</p>}
          {enlace && (
            <a className="f-enlace" href={enlace.url} {...atributosExterno(enlace.externo)}>
              {enlace.etiqueta}
              {enlace.externo ? (
                <>
                  <ArrowUpRight size={18} aria-hidden="true" />
                  <span className="visually-hidden"> (se abre en otra pestaña)</span>
                </>
              ) : (
                <ArrowRight size={18} aria-hidden="true" />
              )}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
