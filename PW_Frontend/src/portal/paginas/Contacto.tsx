import { useState } from 'react'
import { ArrowDown, MessageCircle } from 'lucide-react'
import { obtenerContacto, obtenerSitio } from '../../api/servicios'
import { useRecurso } from '../../hooks/useRecurso'
import { enlaceWhatsapp } from '../../lib/formato'
import CabeceraPagina, { CabeceraCargando, CabeceraError } from '../secciones/CabeceraPagina'
import IndicePagina from '../secciones/IndicePagina'
import MapaSedes from '../secciones/MapaSedes'
import RedesSociales from '../secciones/RedesSociales'
import SedesContacto from '../secciones/SedesContacto'
import SolicitudInformacion from '../secciones/SolicitudInformacion'

const INDICE = [
  { id: 'sedes', etiqueta: 'Sedes' },
  { id: 'mapa', etiqueta: 'Mapa' },
  { id: 'redes', etiqueta: 'Redes' },
  { id: 'solicitar', etiqueta: 'Solicitar información' },
]

// Contacto: cabecera con el WhatsApp del colegio, sedes, mapa bajo pedido, redes y el mismo
// formulario «Solicitar información» de Matrícula.
export default function Contacto() {
  const [sedeMapa, setSedeMapa] = useState<string | null>(null)

  // «Ver en el mapa» elige la sede y lleva el foco a su botón en el mapa (el navegador hace el scroll).
  const verEnMapa = (id: string) => {
    setSedeMapa(id)
    requestAnimationFrame(() => document.getElementById(`f-mapa-sede-${id}`)?.focus())
  }

  return (
    <>
      <CabeceraContacto />
      <IndicePagina secciones={INDICE} />
      <SedesContacto alVerEnMapa={verEnMapa} />
      <MapaSedes seleccion={sedeMapa} alElegir={setSedeMapa} />
      <RedesSociales />
      <SolicitudInformacion />
    </>
  )
}

function CabeceraContacto() {
  const r = useRecurso('contacto', obtenerContacto)
  const sitio = useRecurso('sitio', obtenerSitio)
  if (r.estado === 'cargando') return <CabeceraCargando />
  if (r.estado === 'error') return <CabeceraError titulo="Contacto" reintentar={r.reintentar} />

  const whatsapp = sitio.estado === 'listo' ? sitio.datos.whatsapp : null
  return (
    <CabeceraPagina
      idTitulo="f-contacto-titulo"
      titulo={r.datos.titulo}
      bajada={r.datos.bajada}
      acciones={[
        { href: '#solicitar', etiqueta: 'Solicitar información', icono: <MessageCircle size={20} strokeWidth={2.5} aria-hidden="true" />, estilo: 'oro' },
        { href: '#sedes', etiqueta: 'Ver sedes', icono: <ArrowDown size={20} strokeWidth={2.5} aria-hidden="true" />, estilo: 'blanco' },
      ]}
      placa={
        whatsapp && {
          rotulo: 'WhatsApp',
          valor: whatsapp.visible,
          href: enlaceWhatsapp(whatsapp),
          externo: true,
          etiquetaEnlace: ': escribir al colegio (se abre en otra pestaña)',
        }
      }
      figura={r.datos.figura}
    />
  )
}
