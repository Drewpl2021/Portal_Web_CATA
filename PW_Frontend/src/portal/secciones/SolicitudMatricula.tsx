import { useId, useRef, useState, type FormEvent } from 'react'
import { AlertCircle, ArrowUpRight } from 'lucide-react'
import { obtenerGrados, obtenerSitio, obtenerSolicitud } from '../../api/servicios'
import type { SolicitudInformacion, Telefono } from '../../api/tipos'
import { Cargando, ErrorCarga } from '../../components/EstadoSeccion'
import { useRecurso } from '../../hooks/useRecurso'
import { enlaceWhatsapp, rellenarPlantilla } from '../../lib/formato'
import { Revelar } from '../movimiento'

// «Solicitar información»: título grande sobre el celeste y el formulario en una placa marina.
// No envía datos a ningún servidor: arma el mensaje y abre WhatsApp.
export default function SolicitudMatricula() {
  const solicitud = useRecurso('matricula-solicitud', obtenerSolicitud)
  const sitio = useRecurso('sitio', obtenerSitio)
  const titulo = solicitud.estado === 'listo' ? solicitud.datos.titulo : 'Solicitar información'

  return (
    <section className="f-seccion f-cierre f-solicitud" id="solicitar" aria-labelledby="f-solicitud-titulo">
      <div className="f-cierre__franjas" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="f-seccion__interior f-solicitud__interior">
        <div className="f-solicitud__texto">
          <h2 className="f-titulo f-titulo--blanco" id="f-solicitud-titulo">
            <Revelar como="span" efecto="titulo" className="f-barrido">
              {titulo}
            </Revelar>
          </h2>
          {solicitud.estado === 'listo' && solicitud.datos.texto && (
            <p className="f-solicitud__bajada">{solicitud.datos.texto}</p>
          )}
        </div>

        <div className="f-formulario">
          {(solicitud.estado === 'cargando' || sitio.estado === 'cargando') && (
            <Cargando que="el formulario" lineas={4} conTitulo={false} className="f-cargando--claro" />
          )}
          {solicitud.estado === 'error' && (
            <ErrorCarga que="el formulario" reintentar={solicitud.reintentar} className="f-error--claro" />
          )}
          {solicitud.estado !== 'error' && sitio.estado === 'error' && (
            <ErrorCarga que="el número de WhatsApp del colegio" reintentar={sitio.reintentar} className="f-error--claro" />
          )}
          {solicitud.estado === 'listo' && sitio.estado === 'listo' && (
            <Formulario solicitud={solicitud.datos} whatsapp={sitio.datos.whatsapp} />
          )}
        </div>
      </div>
    </section>
  )
}

function Formulario({ solicitud, whatsapp }: { solicitud: SolicitudInformacion; whatsapp: Telefono }) {
  const id = useId()
  const grados = useRecurso('grados', obtenerGrados)
  const [nombre, setNombre] = useState('')
  const [grado, setGrado] = useState('')
  const [errores, setErrores] = useState<{ nombre?: string; grado?: string }>({})
  const [abierto, setAbierto] = useState<string | null>(null)
  const campoNombre = useRef<HTMLInputElement>(null)
  const campoGrado = useRef<HTMLInputElement & HTMLSelectElement>(null)

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const er: typeof errores = {}
    if (!nombre.trim()) er.nombre = 'Escribe tu nombre para saber a quién responder.'
    if (!grado.trim()) er.grado = 'Elige el grado que te interesa.'
    setErrores(er)
    if (er.nombre || er.grado) {
      ;(er.nombre ? campoNombre : campoGrado).current?.focus()
      return
    }
    const url = enlaceWhatsapp(whatsapp, rellenarPlantilla(solicitud.mensajeWhatsapp, { nombre: nombre.trim(), grado: grado.trim() }))
    window.open(url, '_blank', 'noreferrer')
    setAbierto(url)
  }

  const errorDe = (campo: 'nombre' | 'grado') =>
    errores[campo] ? { 'aria-invalid': true, 'aria-describedby': `${id}-${campo}-error` } : {}

  const mensajeError = (campo: 'nombre' | 'grado') =>
    errores[campo] && (
      <p className="f-campo__error" id={`${id}-${campo}-error`}>
        <AlertCircle size={18} strokeWidth={2.5} aria-hidden="true" />
        {errores[campo]}
      </p>
    )

  return (
    <form className="f-formulario__cuerpo" onSubmit={enviar} noValidate>
      <div className="f-campo">
        <label htmlFor={`${id}-nombre`}>Tu nombre</label>
        <input
          ref={campoNombre}
          id={`${id}-nombre`}
          name="nombre"
          autoComplete="name"
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value)
            setErrores((x) => ({ ...x, nombre: undefined }))
          }}
          {...errorDe('nombre')}
        />
        {mensajeError('nombre')}
      </div>

      <div className="f-campo">
        <label htmlFor={`${id}-grado`}>Grado de interés</label>
        {grados.estado === 'error' || (grados.estado === 'listo' && grados.datos.length === 0) ? (
          // Sin la lista de grados, la familia lo escribe.
          <input
            ref={campoGrado}
            id={`${id}-grado`}
            name="grado"
            placeholder="Por ejemplo: 1.er grado de primaria"
            value={grado}
            onChange={(e) => {
              setGrado(e.target.value)
              setErrores((x) => ({ ...x, grado: undefined }))
            }}
            {...errorDe('grado')}
          />
        ) : (
          <select
            ref={campoGrado}
            id={`${id}-grado`}
            name="grado"
            value={grado}
            disabled={grados.estado === 'cargando'}
            onChange={(e) => {
              setGrado(e.target.value)
              setErrores((x) => ({ ...x, grado: undefined }))
            }}
            {...errorDe('grado')}
          >
            <option value="" disabled>
              {grados.estado === 'cargando' ? 'Cargando grados…' : 'Elige un grado'}
            </option>
            {grados.estado === 'listo' &&
              grados.datos.map((g) => (
                <optgroup key={g.nivel} label={g.nivel}>
                  {g.opciones.map((o) => (
                    <option key={o} value={`${o} de ${g.nivel.toLowerCase()}`}>
                      {o} de {g.nivel.toLowerCase()}
                    </option>
                  ))}
                </optgroup>
              ))}
          </select>
        )}
        {mensajeError('grado')}
      </div>

      <button className="f-boton f-boton--oro f-formulario__enviar" type="submit">
        <span className="f-boton__texto">
          Escribir por WhatsApp <ArrowUpRight size={20} strokeWidth={2.5} aria-hidden="true" />
        </span>
        <span className="visually-hidden"> (se abre en otra pestaña)</span>
      </button>

      <p className="f-formulario__nota" aria-live="polite">
        {abierto ? (
          <>
            Abrimos WhatsApp en otra pestaña con tu mensaje listo. Si no se abrió,{' '}
            <a href={abierto} target="_blank" rel="noreferrer">
              ábrelo desde aquí
              <span className="visually-hidden"> (se abre en otra pestaña)</span>
            </a>
            .
          </>
        ) : (
          <>
            El mensaje se envía desde tu propio WhatsApp al {whatsapp.visible}. Esta página no guarda tus datos.
          </>
        )}
      </p>
    </form>
  )
}
