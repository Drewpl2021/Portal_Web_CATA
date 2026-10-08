import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { obtenerAvisoVigente } from '../api/servicios'
import Imagen from '../components/Imagen'
import { useRecurso } from '../hooks/useRecurso'
import { atributosExterno } from '../lib/formato'

// Un solo aviso a la vez, nunca en carrusel. Sin aviso vigente, o si falla, la placa no aparece:
// es complementario y no debe interrumpir la portada.
export default function Aviso() {
  const aviso = useRecurso('aviso', obtenerAvisoVigente)
  if (aviso.estado !== 'listo' || !aviso.datos) return null
  const { titulo, texto, imagen, enlace } = aviso.datos

  return (
    <section className="aviso" aria-labelledby="aviso-titulo">
      <div className={`aviso__marco${imagen ? ' aviso__marco--con-imagen' : ''}`}>
        <Imagen imagen={imagen} className="aviso__imagen" sizes="(min-width: 1080px) 60vw, 100vw" />
        <div className="aviso__texto">
          <h2 className="aviso__titulo" id="aviso-titulo">
            {titulo}
          </h2>
          {texto && <p>{texto}</p>}
          {enlace && (
            <a className="enlace-flecha" href={enlace.url} {...atributosExterno(enlace.externo)}>
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
