import { useRef, useState, type CSSProperties } from 'react'
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, MessageCircle } from 'lucide-react'
import { obtenerCabeceraMatricula } from '../../api/servicios'
import type { CabeceraMatricula as Cabecera } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'

// Cabecera de Matrícula: titular, barras y dos botones que llevan a la solicitud y al proceso.
// A la derecha, el año del proceso en una placa marina inclinada con el recorte de un estudiante delante.
export default function CabeceraMatricula() {
  const r = useRecurso('matricula-cabecera', obtenerCabeceraMatricula)

  if (r.estado === 'cargando') {
    return (
      <section className="f-hero f-hero--pagina f-hero--estado" aria-busy="true">
        <div className="f-hero__interior">
          <Cargando que="la cabecera" lineas={3} className="f-cargando--claro" />
        </div>
      </section>
    )
  }
  if (r.estado === 'error') {
    return (
      <section className="f-hero f-hero--pagina f-hero--estado">
        <div className="f-hero__interior">
          <h1 className="f-hero__titulo">Matrícula</h1>
          <ErrorCarga que="la cabecera" reintentar={r.reintentar} className="f-error--claro" />
        </div>
      </section>
    )
  }
  return <Listo cabecera={r.datos} />
}

function Listo({ cabecera }: { cabecera: Cabecera }) {
  const seccion = useRef<HTMLElement>(null)
  const reducir = useReducedMotion()
  const [falloFigura, setFalloFigura] = useState(false)

  // Scroll: las franjas bajan y la placa del año sube un poco más lento que el texto.
  const { scrollYProgress } = useScroll({ target: seccion, offset: ['start start', 'end start'] })
  const yFranjas = useTransform(scrollYProgress, [0, 1], ['0rem', '6rem'])
  const yAnio = useTransform(scrollYProgress, [0, 1], ['0rem', '-2.5rem'])
  const tFranjas = useMotionTemplate`translateY(${yFranjas})`
  const tAnio = useMotionTemplate`translateY(${yAnio})`

  const figura = cabecera.figura && !falloFigura ? cabecera.figura : null
  const conComposicion = cabecera.anio !== null || figura !== null

  return (
    <section
      ref={seccion}
      className={`f-hero f-hero--pagina${conComposicion ? '' : ' f-hero--solo-texto'}`}
      aria-labelledby="f-matricula-titulo"
    >
      <motion.div className="f-hero__franjas" aria-hidden="true" style={reducir ? undefined : { transform: tFranjas }}>
        <span />
        <span />
        <span />
      </motion.div>

      <div className="f-hero__interior">
        <div className="f-hero__texto">
          <h1 className="f-hero__titulo" id="f-matricula-titulo">
            <span className="f-barrido">{cabecera.titulo}</span>
          </h1>
          <div className="f-hero__barras" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ '--i': i } as CSSProperties} />
            ))}
          </div>
          {cabecera.bajada && <p className="f-hero__bajada">{cabecera.bajada}</p>}
          <div className="f-hero__acciones">
            <a href="#solicitar" className="f-boton f-boton--oro">
              <span className="f-boton__texto">
                Solicitar información <MessageCircle size={20} strokeWidth={2.5} aria-hidden="true" />
              </span>
            </a>
            <a href="#proceso" className="f-boton f-boton--blanco">
              <span className="f-boton__texto">
                Ver requisitos <ArrowDown size={20} strokeWidth={2.5} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>

        {conComposicion && (
          // Composición de proporción fija: la placa, el año y el recorte se ubican en % de ella.
          <div className={`f-anio${figura ? '' : ' f-anio--sin-figura'}`}>
            {cabecera.anio !== null && (
              <motion.div className="f-anio__placa" style={reducir ? undefined : { transform: tAnio }}>
                <span className="f-anio__rotulo">Matrícula</span>
                <span className="f-anio__numero">{cabecera.anio}</span>
              </motion.div>
            )}
            {figura && (
              <img
                className="f-anio__figura"
                src={figura.url}
                alt={figura.alt}
                width={figura.ancho ?? undefined}
                height={figura.alto ?? undefined}
                onError={() => setFalloFigura(true)}
                {...{ fetchpriority: 'high' }}
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
