import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Link } from 'react-router-dom'
import type { Imagen } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { atributosExterno } from '../../lib/formato'
import { useRutaInterna } from '../../sitio/BaseRuta'

export interface AccionCabecera {
  href: string
  etiqueta: string
  icono: ReactNode
  estilo: 'oro' | 'blanco'
  /** true: `href` es una ruta del sitio (/proyectos) y se navega con el router. */
  interna?: boolean
}

export interface PlacaCabecera {
  rotulo: string
  valor: string
  /** Si la placa es un enlace (p. ej. el WhatsApp del colegio). */
  href?: string
  externo?: boolean
  /** Texto para lectores de pantalla cuando la placa es un enlace. */
  etiquetaEnlace?: string
}

interface Props {
  idTitulo: string
  titulo: string
  bajada: string | null
  acciones: AccionCabecera[]
  placa: PlacaCabecera | null
  figura: Imagen | null
  /** Foto rectangular (no recorte) en un marco blanco girado; solo si no hay placa ni recorte. */
  foto?: Imagen | null
  /** Datos breves bajo la bajada (categoría, estado, fecha…). */
  meta?: ReactNode
}

// Cabecera celeste de las páginas internas (Matrícula, Contacto, Proyectos): titular, barras, bajada y botones.
// A la derecha, una composición de proporción fija: una placa marina inclinada con un rótulo y un valor
// grande, y el recorte de un estudiante delante; o bien una foto enmarcada.
export default function CabeceraPagina({ idTitulo, titulo, bajada, acciones, placa, figura: figuraApi, foto: fotoApi = null, meta }: Props) {
  const seccion = useRef<HTMLElement>(null)
  const reducir = useReducedMotion()
  const interna = useRutaInterna()
  const [falloFigura, setFalloFigura] = useState(false)
  const [falloFoto, setFalloFoto] = useState(false)

  // Scroll: las franjas bajan y la placa sube un poco más lento que el texto.
  const { scrollYProgress } = useScroll({ target: seccion, offset: ['start start', 'end start'] })
  const yFranjas = useTransform(scrollYProgress, [0, 1], ['0rem', '6rem'])
  const yPlaca = useTransform(scrollYProgress, [0, 1], ['0rem', '-2.5rem'])
  const tFranjas = useMotionTemplate`translateY(${yFranjas})`
  const tPlaca = useMotionTemplate`translateY(${yPlaca})`

  const figura = figuraApi && !falloFigura ? figuraApi : null
  const conComposicion = placa !== null || figura !== null
  const foto = !conComposicion && fotoApi && !falloFoto ? fotoApi : null
  // Valores largos (un teléfono) usan un cuerpo menor que un año de cuatro cifras.
  const valorLargo = placa !== null && placa.valor.length > 5

  const contenidoPlaca = placa && (
    <>
      <span className="f-placa-cab__rotulo">{placa.rotulo}</span>
      <span className="f-placa-cab__valor">{placa.valor}</span>
      {placa.etiquetaEnlace && <span className="visually-hidden">{placa.etiquetaEnlace}</span>}
    </>
  )

  return (
    <section
      ref={seccion}
      className={`f-hero f-hero--pagina${conComposicion || foto ? '' : ' f-hero--solo-texto'}`}
      aria-labelledby={idTitulo}
    >
      <motion.div className="f-hero__franjas" aria-hidden="true" style={reducir ? undefined : { transform: tFranjas }}>
        <span />
        <span />
        <span />
      </motion.div>

      <div className="f-hero__interior">
        <div className="f-hero__texto">
          <h1 className="f-hero__titulo" id={idTitulo}>
            <span className="f-barrido">{titulo}</span>
          </h1>
          <div className="f-hero__barras" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ '--i': i } as CSSProperties} />
            ))}
          </div>
          {bajada && <p className="f-hero__bajada">{bajada}</p>}
          {meta && <div className="f-hero__meta">{meta}</div>}
          {acciones.length > 0 && (
            <div className="f-hero__acciones">
              {acciones.map((a) => {
                const clase = `f-boton f-boton--${a.estilo}`
                const texto = (
                  <span className="f-boton__texto">
                    {a.etiqueta} {a.icono}
                  </span>
                )
                return a.interna ? (
                  <Link key={a.href} to={interna(a.href)} className={clase}>
                    {texto}
                  </Link>
                ) : (
                  <a key={a.href} href={a.href} className={clase}>
                    {texto}
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {foto && (
          <div className="f-cab-foto">
            <img
              src={foto.url}
              alt={foto.alt}
              width={foto.ancho ?? undefined}
              height={foto.alto ?? undefined}
              onError={() => setFalloFoto(true)}
              {...{ fetchpriority: 'high' }}
            />
          </div>
        )}

        {conComposicion && (
          // Composición de proporción fija: la placa, el valor y el recorte se ubican en % de ella.
          <div className={`f-placa-cab${figura ? '' : ' f-placa-cab--sin-figura'}${valorLargo ? ' f-placa-cab--largo' : ''}`}>
            {placa && (
              <motion.div className="f-placa-cab__placa" style={reducir ? undefined : { transform: tPlaca }}>
                {placa.href ? (
                  <a className="f-placa-cab__enlace" href={placa.href} {...atributosExterno(Boolean(placa.externo))}>
                    {contenidoPlaca}
                  </a>
                ) : (
                  contenidoPlaca
                )}
              </motion.div>
            )}
            {figura && (
              <img
                className="f-placa-cab__figura"
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

// Estados de carga y error de la cabecera, con el título de respaldo como h1.
export function CabeceraCargando() {
  return (
    <section className="f-hero f-hero--pagina f-hero--estado" aria-busy="true">
      <div className="f-hero__interior">
        <Cargando que="la cabecera" lineas={3} className="f-cargando--claro" />
      </div>
    </section>
  )
}

export function CabeceraError({ titulo, reintentar }: { titulo: string; reintentar: () => void }) {
  return (
    <section className="f-hero f-hero--pagina f-hero--estado">
      <div className="f-hero__interior">
        <h1 className="f-hero__titulo">{titulo}</h1>
        <ErrorCarga que="la cabecera" reintentar={reintentar} className="f-error--claro" />
      </div>
    </section>
  )
}
