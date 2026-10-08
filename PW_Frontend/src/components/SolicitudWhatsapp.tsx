import { useId, useState, type FormEvent, type RefObject } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { obtenerGrados } from '../api/servicios'
import type { AccionSolicitud, Telefono } from '../api/tipos'
import { useRecurso } from '../hooks/useRecurso'
import { enlaceWhatsapp, rellenarPlantilla } from '../lib/formato'

interface Props {
  accion: AccionSolicitud
  whatsapp: Telefono
  primerCampoRef: RefObject<HTMLInputElement>
}

// No envía datos a ningún servidor: arma el mensaje y abre WhatsApp.
export default function SolicitudWhatsapp({ accion, whatsapp, primerCampoRef }: Props) {
  const id = useId()
  const grados = useRecurso('grados', obtenerGrados)
  const [nombre, setNombre] = useState('')
  const [grado, setGrado] = useState('')
  const [errores, setErrores] = useState<{ nombre?: string; grado?: string }>({})
  const [abierto, setAbierto] = useState<string | null>(null)

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const er: typeof errores = {}
    if (!nombre.trim()) er.nombre = 'Escribe tu nombre para saber a quién responder.'
    if (!grado.trim()) er.grado = 'Indica el grado al que postularía tu hijo o hija.'
    setErrores(er)
    if (Object.keys(er).length) {
      document.getElementById(er.nombre ? `${id}-nombre` : `${id}-grado`)?.focus()
      return
    }
    const url = enlaceWhatsapp(whatsapp, rellenarPlantilla(accion.mensajeWhatsapp, { nombre: nombre.trim(), grado }))
    window.open(url, '_blank', 'noreferrer')
    setAbierto(url)
  }

  const errorDe = (campo: 'nombre' | 'grado') =>
    errores[campo] ? { 'aria-invalid': true, 'aria-describedby': `${id}-${campo}-error` } : {}

  return (
    <form className="solicitud" onSubmit={enviar} noValidate>
      <div className="solicitud__campo">
        <label htmlFor={`${id}-nombre`}>Tu nombre</label>
        <input
          ref={primerCampoRef}
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
        {errores.nombre && (
          <p className="solicitud__error" id={`${id}-nombre-error`}>
            {errores.nombre}
          </p>
        )}
      </div>

      <div className="solicitud__campo">
        <label htmlFor={`${id}-grado`}>Grado de interés</label>
        {grados.estado === 'error' ? (
          // Sin la lista de grados, la familia lo escribe.
          <input
            id={`${id}-grado`}
            name="grado"
            placeholder="Por ejemplo: 1.er grado de primaria"
            value={grado}
            onChange={(e) => setGrado(e.target.value)}
            {...errorDe('grado')}
          />
        ) : (
          <select
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
        {errores.grado && (
          <p className="solicitud__error" id={`${id}-grado-error`}>
            {errores.grado}
          </p>
        )}
      </div>

      <button className="accion-dorada solicitud__enviar" type="submit">
        Escribir por WhatsApp <ArrowUpRight size={20} aria-hidden="true" />
        <span className="visually-hidden"> (se abre en otra pestaña)</span>
      </button>

      <p className="solicitud__nota" aria-live="polite">
        {abierto ? (
          <>
            Abrimos WhatsApp en otra pestaña con tu mensaje listo. Si no se abrió,{' '}
            <a href={abierto} target="_blank" rel="noreferrer">
              ábrelo desde aquí
            </a>
            .
          </>
        ) : (
          <>Tu mensaje se envía desde tu propio WhatsApp. No guardamos tus datos en esta página.</>
        )}
      </p>
    </form>
  )
}
