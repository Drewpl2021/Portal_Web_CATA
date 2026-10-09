import { useId, type CSSProperties, type ReactNode } from 'react'
import { ArrowUpRight, Check, File, FileSpreadsheet, FileText, Globe, Palette, Presentation, Quote } from 'lucide-react'
import type { Bloque, FormatoEnlace, NodoOrganigrama, Persona } from '../../api/tipos'
import Imagen from '../../components/Imagen'
import { pesoLegible } from '../../lib/formato'
import { Revelar } from '../movimiento'

// Renderizador de bloques de contenido. Cada tipo de bloque del contrato tiene su pieza aquí; las páginas
// de Nosotros (y las que vengan) solo entregan su lista de bloques.

type BloqueDe<T extends Bloque['tipo']> = Extract<Bloque, { tipo: T }>

function TituloBloque({ children }: { children: ReactNode }) {
  return (
    <h2 className="f-titulo f-titulo--chico f-bloque__titulo">
      <Revelar como="span" efecto="titulo" className="f-barrido">
        {children}
      </Revelar>
    </h2>
  )
}

function Texto({ b }: { b: BloqueDe<'texto'> }) {
  return (
    <div className="f-bloque f-prosa">
      {b.titulo && <TituloBloque>{b.titulo}</TituloBloque>}
      {b.parrafos.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {b.firma && (
        <p className="f-firma">
          <span className="f-firma__nombre">{b.firma.nombre}</span>
          {b.firma.detalle && <span className="f-firma__detalle">{b.firma.detalle}</span>}
        </p>
      )}
    </div>
  )
}

// Misión, Visión, lema: los destacados seguidos se muestran lado a lado.
function Destacados({ bloques }: { bloques: BloqueDe<'destacado'>[] }) {
  return (
    <Revelar efecto="carriles" className="f-bloque f-destacados">
      {bloques.map((b, i) => (
        <div key={i} className="f-destacado" style={{ '--i': i } as CSSProperties}>
          <h2 className="f-destacado__rotulo">{b.rotulo}</h2>
          <p className="f-destacado__texto">{b.texto}</p>
        </div>
      ))}
    </Revelar>
  )
}

function Lista({ b }: { b: BloqueDe<'lista'> }) {
  if (b.estilo === 'tarjetas') {
    return (
      <div className="f-bloque">
        {b.titulo && <TituloBloque>{b.titulo}</TituloBloque>}
        <Revelar como="ul" efecto="escalonado" className="f-tarjetas-texto">
          {b.items.map((item, i) => (
            <li key={i} className="f-tarjeta-texto" style={{ '--i': i } as CSSProperties}>
              {item.titulo && <h3 className="f-tarjeta-texto__titulo">{item.titulo}</h3>}
              <p className="f-tarjeta-texto__texto">{item.texto}</p>
              {item.fuente && <p className="f-tarjeta-texto__fuente">{item.fuente}</p>}
            </li>
          ))}
        </Revelar>
      </div>
    )
  }
  return (
    <div className="f-bloque f-lista f-lista--bloque">
      {b.titulo && <h2 className="f-lista__titulo">{b.titulo}</h2>}
      <ItemsVerificados items={b.items} />
    </div>
  )
}

/** Lista con marca de verificación dorada. La usan los bloques, los requisitos de Matrícula y los proyectos. */
export function ItemsVerificados({ items }: { items: (string | { titulo: string | null; texto: string; fuente?: string | null })[] }) {
  return (
    <ul className="f-lista__items">
      {items.map((item, i) => {
        const { titulo, texto, fuente } = typeof item === 'string' ? { titulo: null, texto: item, fuente: null } : item
        return (
          <li key={i}>
            <span className="f-lista__marca" aria-hidden="true">
              <Check size={16} strokeWidth={3} />
            </span>
            <span>
              {titulo && <strong>{titulo}: </strong>}
              {texto}
              {fuente && <span className="f-lista__fuente"> ({fuente})</span>}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function Hitos({ b }: { b: BloqueDe<'hitos'> }) {
  return (
    <div className="f-bloque">
      {b.titulo && <TituloBloque>{b.titulo}</TituloBloque>}
      <Revelar como="ol" efecto="escalonado" className="f-cronograma f-hitos">
        {b.items.map((h, i) => (
          <li key={i} className="f-hito" style={{ '--i': i } as CSSProperties}>
            <span className={`f-hito__fecha f-hitos__fecha${h.fecha.length > 11 ? ' f-hitos__fecha--larga' : ''}`}>{h.fecha}</span>
            <p className="f-hito__texto f-hitos__texto">{h.texto}</p>
          </li>
        ))}
      </Revelar>
    </div>
  )
}

function ImagenBloque({ b }: { b: BloqueDe<'imagen'> }) {
  return (
    <figure className="f-bloque f-figura-api">
      <Imagen imagen={b.imagen} className="f-figura-api__imagen" sizes="(min-width: 900px) 28rem, 92vw" />
      {b.pie && <figcaption className="f-figura-api__pie">{b.pie}</figcaption>}
      {b.transcripcion && (
        <details className="f-transcripcion">
          <summary className="f-transcripcion__resumen">Leer la transcripción</summary>
          <div className="f-transcripcion__texto">
            {b.transcripcion.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </details>
      )}
    </figure>
  )
}

const iniciales = (nombre: string) =>
  nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')

function FotoPersona({ persona: p, grande = false }: { persona: Pick<Persona, 'nombre' | 'foto'>; grande?: boolean }) {
  return (
    <div className={`f-persona__foto${grande ? ' f-persona__foto--grande' : ''}`}>
      {p.foto ? (
        <Imagen imagen={p.foto} proporcion="1 / 1" sizes="12rem" />
      ) : (
        <span className="f-persona__iniciales" aria-hidden="true">
          {iniciales(p.nombre)}
        </span>
      )}
    </div>
  )
}

/** Tarjetas de personas (foto redonda o iniciales, nombre y cargo). También las usa Personal Docente. */
export function TarjetasPersonas({ personas, nivelNombre = 3 }: { personas: Pick<Persona, 'id' | 'nombre' | 'cargo' | 'foto'>[]; nivelNombre?: 3 | 4 }) {
  const Nombre = nivelNombre === 4 ? 'h4' : 'h3'
  return (
    <Revelar como="ul" efecto="escalonado" className="f-personas">
      {personas.map((p, i) => (
        <li key={p.id} className="f-persona" style={{ '--i': i } as CSSProperties}>
          <FotoPersona persona={p} />
          <Nombre className="f-persona__nombre">{p.nombre}</Nombre>
          <p className="f-persona__cargo">{p.cargo}</p>
        </li>
      ))}
    </Revelar>
  )
}

// Con título, cada grupo de personas es una sección con su encabezado (p. ej. las áreas de Administración).
function Personas({ b }: { b: BloqueDe<'personas'> }) {
  const id = useId()
  if (!b.titulo) {
    return (
      <div className="f-bloque">
        <TarjetasPersonas personas={b.personas} />
      </div>
    )
  }
  return (
    <section className="f-bloque f-grupo-personas" aria-labelledby={`${id}-titulo`}>
      <h2 className="f-grupo-personas__titulo" id={`${id}-titulo`}>
        <span>{b.titulo}</span>
        <span className="f-grupo-personas__n">{b.personas.length === 1 ? '1 persona' : `${b.personas.length} personas`}</span>
      </h2>
      <TarjetasPersonas personas={b.personas} />
    </section>
  )
}

function Mensaje({ b }: { b: BloqueDe<'mensaje'> }) {
  return (
    <div className={`f-bloque f-mensaje${b.foto ? '' : ' f-mensaje--sin-foto'}`}>
      {b.foto && <FotoPersona persona={{ nombre: b.firma.nombre, foto: b.foto }} grande />}
      <div className="f-mensaje__carta">
        <Quote className="f-mensaje__comillas" size={44} strokeWidth={2.5} aria-hidden="true" />
        {b.titulo && <p className="f-mensaje__saludo">{b.titulo}</p>}
        <div className="f-prosa">
          {b.parrafos.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="f-firma">
          <span className="f-firma__nombre">{b.firma.nombre}</span>
          {b.firma.detalle && <span className="f-firma__detalle">{b.firma.detalle}</span>}
        </p>
      </div>
    </div>
  )
}

function Letra({ b }: { b: BloqueDe<'letra'> }) {
  return (
    <div className="f-bloque" id="letra">
      {b.titulo && <TituloBloque>{b.titulo}</TituloBloque>}
      <Revelar efecto="escalonado" className="f-letra">
        {b.partes.map((parte, i) => (
          <div key={i} className={`f-letra__parte${/^coro$/i.test(parte.titulo) ? ' f-letra__parte--coro' : ''}`} style={{ '--i': i } as CSSProperties}>
            <h3 className="f-letra__titulo">{parte.titulo}</h3>
            <p className="f-letra__versos">
              {parte.versos.map((v, j) => (
                <span key={j} className="f-letra__verso">
                  {v}
                </span>
              ))}
            </p>
          </div>
        ))}
      </Revelar>
    </div>
  )
}

// Reproductor nativo: teclado y lector de pantalla incluidos, sin reproducción automática
// y sin descargar nada hasta que la persona lo pide (preload="none").
function Audio({ b, hayLetra }: { b: BloqueDe<'audio'>; hayLetra: boolean }) {
  const id = useId()
  return (
    <figure className="f-bloque f-audio" aria-labelledby={`${id}-titulo`}>
      <figcaption>
        <span className="f-audio__titulo" id={`${id}-titulo`}>
          {b.titulo}
        </span>
        {b.descripcion && <span className="f-audio__descripcion">{b.descripcion}</span>}
      </figcaption>
      <audio className="f-audio__control" controls preload="none" aria-labelledby={`${id}-titulo`}>
        <source src={b.url} type={b.formato} />
        Tu navegador no puede reproducir este audio.{' '}
        <a href={b.url}>Descárgalo aquí</a>.
      </audio>
      {hayLetra && (
        <p className="f-audio__letra">
          <a className="f-enlace f-enlace--chico" href="#letra">
            Leer la letra
          </a>
        </p>
      )}
    </figure>
  )
}

function Nodo({ nodo, raiz = false }: { nodo: NodoOrganigrama; raiz?: boolean }) {
  return (
    <li className={`f-arbol__item${raiz ? ' f-arbol__item--raiz' : ''}`}>
      <div className="f-arbol__nodo">
        <span className="f-arbol__cargo">{nodo.cargo}</span>
        {nodo.detalle && <span className="f-arbol__detalle">{nodo.detalle}</span>}
      </div>
      {nodo.hijos.length > 0 && (
        <ul className="f-arbol__hijos">
          {nodo.hijos.map((h, i) => (
            <Nodo key={i} nodo={h} />
          ))}
        </ul>
      )}
    </li>
  )
}

// La imagen, si la hay, va acompañada siempre de la misma estructura como lista jerárquica.
function Organigrama({ b }: { b: BloqueDe<'organigrama'> }) {
  return (
    <div className="f-bloque f-organigrama">
      {b.titulo && <TituloBloque>{b.titulo}</TituloBloque>}
      {b.imagen && (
        <figure className="f-figura-api f-organigrama__imagen">
          <Imagen imagen={b.imagen} sizes="(min-width: 900px) 52rem, 92vw" />
          <figcaption className="f-figura-api__pie">La misma estructura, en texto, está en la lista que sigue.</figcaption>
        </figure>
      )}
      <p className="f-organigrama__ayuda">Estructura en texto, de arriba hacia abajo. Cada cargo incluye a los que dependen de él.</p>
      <Revelar como="ul" efecto="escalonado" className="f-arbol">
        <Nodo nodo={b.raiz} raiz />
      </Revelar>
      {b.enlace && (
        <p className="f-organigrama__enlace">
          <a className="f-enlace" href={b.enlace.url} {...(b.enlace.externo ? { target: '_blank', rel: 'noreferrer' } : {})}>
            {b.enlace.etiqueta} {b.enlace.externo && <ArrowUpRight size={20} aria-hidden="true" />}
            {b.enlace.externo && <span className="visually-hidden"> (se abre en otra pestaña)</span>}
          </a>
        </p>
      )}
    </div>
  )
}

const FORMATO: Record<FormatoEnlace, { nombre: string; icono: ReactNode }> = {
  pdf: { nombre: 'PDF', icono: <FileText size={24} strokeWidth={2.25} aria-hidden="true" /> },
  web: { nombre: 'Página web', icono: <Globe size={24} strokeWidth={2.25} aria-hidden="true" /> },
  hoja: { nombre: 'Hoja de cálculo', icono: <FileSpreadsheet size={24} strokeWidth={2.25} aria-hidden="true" /> },
  presentacion: { nombre: 'Presentación', icono: <Presentation size={24} strokeWidth={2.25} aria-hidden="true" /> },
  documento: { nombre: 'Documento', icono: <File size={24} strokeWidth={2.25} aria-hidden="true" /> },
  canva: { nombre: 'Diseño en Canva', icono: <Palette size={24} strokeWidth={2.25} aria-hidden="true" /> },
}

function Enlaces({ b }: { b: BloqueDe<'enlaces'> }) {
  return (
    <div className="f-bloque">
      {b.titulo && <TituloBloque>{b.titulo}</TituloBloque>}
      <Revelar como="ul" efecto="escalonado" className="f-documentos">
        {b.enlaces.map((e, i) => (
          <li key={i} className="f-tarjeta f-documento" style={{ '--i': i } as CSSProperties}>
            <span className="f-documento__icono">{FORMATO[e.formato].icono}</span>
            <div className="f-documento__texto">
              <a className="f-documento__enlace" href={e.url} target="_blank" rel="noreferrer">
                {e.etiqueta}
                <span className="visually-hidden">
                  {' '}
                  ({[FORMATO[e.formato].nombre, e.peso && pesoLegible(e.peso), 'se abre en otra pestaña'].filter(Boolean).join(', ')})
                </span>
              </a>
              {e.descripcion && <p className="f-documento__descripcion">{e.descripcion}</p>}
              {/* Lo mismo, a la vista: formato, peso y que se abre en otra pestaña */}
              <p className="f-documento__meta" aria-hidden="true">
                <span className="f-documento__formato">{FORMATO[e.formato].nombre}</span>
                {e.peso && <span>{pesoLegible(e.peso)}</span>}
                <span>Se abre en otra pestaña</span>
              </p>
            </div>
            <ArrowUpRight className="f-documento__flecha" size={22} strokeWidth={2.5} aria-hidden="true" />
          </li>
        ))}
      </Revelar>
    </div>
  )
}

// Agrupa los destacados seguidos para mostrarlos lado a lado.
type Grupo = { tipo: 'destacados'; bloques: BloqueDe<'destacado'>[] } | { tipo: 'uno'; bloque: Bloque }

function agrupar(bloques: Bloque[]): Grupo[] {
  const grupos: Grupo[] = []
  for (const b of bloques) {
    const ultimo = grupos[grupos.length - 1]
    if (b.tipo === 'destacado') {
      if (ultimo?.tipo === 'destacados') ultimo.bloques.push(b)
      else grupos.push({ tipo: 'destacados', bloques: [b] })
    } else grupos.push({ tipo: 'uno', bloque: b })
  }
  return grupos
}

export default function Bloques({ bloques }: { bloques: Bloque[] }) {
  const hayLetra = bloques.some((b) => b.tipo === 'letra')
  return (
    <>
      {agrupar(bloques).map((g, i) => {
        if (g.tipo === 'destacados') return <Destacados key={i} bloques={g.bloques} />
        const b = g.bloque
        switch (b.tipo) {
          case 'texto':
            return <Texto key={i} b={b} />
          case 'lista':
            return <Lista key={i} b={b} />
          case 'hitos':
            return <Hitos key={i} b={b} />
          case 'imagen':
            return <ImagenBloque key={i} b={b} />
          case 'personas':
            return <Personas key={i} b={b} />
          case 'mensaje':
            return <Mensaje key={i} b={b} />
          case 'letra':
            return <Letra key={i} b={b} />
          case 'audio':
            return <Audio key={i} b={b} hayLetra={hayLetra} />
          case 'organigrama':
            return <Organigrama key={i} b={b} />
          case 'enlaces':
            return <Enlaces key={i} b={b} />
          case 'destacado':
            return null
        }
      })}
    </>
  )
}
