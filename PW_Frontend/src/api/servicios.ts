// Única puerta de acceso a datos del portal.
// Con VITE_API_URL vacío lee los JSON locales de ./mock; con valor, llama a la API real.
// Los componentes solo usan las funciones obtener*() y nunca saben de dónde vienen los datos.
import type { z } from 'zod'
import {
  esquemaBanners,
  esquemaCabeceraMatricula,
  esquemaFechasMatricula,
  esquemaPreguntas,
  esquemaProcesos,
  esquemaSolicitud,
  esquemaVacantes,
  esquemaCifras,
  esquemaContacto,
  esquemaHero,
  esquemaGrados,
  esquemaNiveles,
  esquemaNoticias,
  esquemaQuienesSomos,
  esquemaSedes,
  esquemaSitio,
  sobre,
  sobrePaginado,
} from './esquemas'
import type {
  Banner,
  CabeceraMatricula,
  FechasMatricula,
  PreguntaFrecuente,
  ProcesoMatricula,
  SolicitudInformacion,
  Vacantes,
  Cifra,
  Contacto,
  GrupoGrados,
  Hero,
  ListaNoticias,
  Niveles,
  QuienesSomos,
  Sede,
  Sitio,
} from './tipos'

const API_URL = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '')

export const ESCENARIOS = ['tipico', 'corto', 'largo', 'sin-foto', 'alt-vacio', 'vacio', 'error'] as const
export type Escenario = (typeof ESCENARIOS)[number]

type Recurso =
  | 'sitio'
  | 'banners'
  | 'propuesta-cabecera'
  | 'cifras'
  | 'quienes-somos'
  | 'niveles'
  | 'sedes'
  | 'noticias'
  | 'grados'
  | 'matricula-cabecera'
  | 'matricula-procesos'
  | 'matricula-vacantes'
  | 'matricula-fechas'
  | 'matricula-preguntas'
  | 'solicitud'
  | 'contacto'

export class ErrorDatos extends Error {
  constructor(
    mensaje: string,
    readonly recurso: Recurso,
    readonly causa?: unknown,
  ) {
    super(mensaje)
    this.name = 'ErrorDatos'
  }
}

// ───────── Origen de los datos ─────────

const parametros = typeof window === 'undefined' ? new URLSearchParams() : new URLSearchParams(window.location.search)

function escenarioActual(): Escenario {
  const pedido = parametros.get('escenario') ?? import.meta.env.VITE_MOCK_ESCENARIO ?? 'tipico'
  return (ESCENARIOS as readonly string[]).includes(pedido) ? (pedido as Escenario) : 'tipico'
}

export const origen =
  API_URL === ''
    ? ({
        tipo: 'local',
        escenario: escenarioActual(),
        retrasoMs: Number(parametros.get('retraso') ?? import.meta.env.VITE_MOCK_RETRASO ?? 0) || 0,
      } as const)
    : ({ tipo: 'api', url: API_URL } as const)

// ───────── Lectura local ─────────

// Con VITE_API_URL definido en el build, esta rama desaparece y los JSON de prueba no se empaquetan.
const archivosLocales: Record<string, () => Promise<{ default: unknown }>> = import.meta.env.VITE_API_URL
  ? {}
  : import.meta.glob<{ default: unknown }>('./mock/*/*.json')

// En los JSON de prueba las imágenes viven en este dominio ficticio, para cumplir el contrato
// (URL https absoluta). Al leerlos se sirven desde /public/mock.
const MEDIOS_PRUEBA = 'https://medios.prueba.cata.edu.pe/'

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function leerLocal(recurso: Recurso): Promise<unknown> {
  if (origen.tipo !== 'local') throw new Error('origen no local')
  if (origen.retrasoMs > 0) await esperar(origen.retrasoMs)
  if (origen.escenario === 'error') throw new Error('Escenario de prueba «error»')

  // Cada escenario solo trae los archivos que cambia; el resto sale de «tipico».
  const cargar =
    archivosLocales[`./mock/${origen.escenario}/${recurso}.json`] ?? archivosLocales[`./mock/tipico/${recurso}.json`]
  if (!cargar) throw new Error(`No hay datos de prueba para ${recurso}`)
  return (await cargar()).default
}

// Se aplica después de validar: el JSON cumple el contrato y luego se sirve en local.
const servirMediosLocales = <T,>(datos: T): T =>
  JSON.parse(JSON.stringify(datos).replaceAll(MEDIOS_PRUEBA, `${import.meta.env.BASE_URL}mock/`)) as T

// ───────── Lectura de la API ─────────

async function leerApi(ruta: string): Promise<unknown> {
  const res = await fetch(`${API_URL}${ruta}`, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} en ${ruta}`)
  return res.json()
}

// ───────── Lectura validada ─────────

async function leer<S extends z.ZodTypeAny>(
  recurso: Recurso,
  ruta: string,
  esquema: S,
): Promise<z.infer<S>> {
  let cuerpo: unknown
  try {
    cuerpo = origen.tipo === 'local' ? await leerLocal(recurso) : await leerApi(ruta)
  } catch (e) {
    throw new ErrorDatos(`No se pudo leer ${recurso}`, recurso, e)
  }

  const resultado = esquema.safeParse(cuerpo)
  if (!resultado.success) {
    console.error(`[portal] La respuesta de ${ruta} no cumple el contrato`, resultado.error.issues)
    throw new ErrorDatos(`Respuesta inválida de ${recurso}`, recurso, resultado.error)
  }
  return origen.tipo === 'local' ? servirMediosLocales(resultado.data) : resultado.data
}

// ───────── API pública de la capa ─────────

export async function obtenerSitio(): Promise<Sitio> {
  return (await leer('sitio', '/v1/sitio', sobre(esquemaSitio))).data
}

export async function obtenerBanners(): Promise<Banner[]> {
  return (await leer('banners', '/v1/portada/banners', sobre(esquemaBanners))).data
}

export async function obtenerCabeceraPropuesta(): Promise<Hero> {
  return (await leer('propuesta-cabecera', '/v1/propuesta-educativa/cabecera', sobre(esquemaHero))).data
}

export async function obtenerCifras(): Promise<Cifra[]> {
  return (await leer('cifras', '/v1/portada/cifras', sobre(esquemaCifras))).data
}

export async function obtenerQuienesSomos(): Promise<QuienesSomos> {
  return (await leer('quienes-somos', '/v1/quienes-somos', sobre(esquemaQuienesSomos))).data
}

export async function obtenerNiveles(): Promise<Niveles> {
  return (await leer('niveles', '/v1/niveles', sobre(esquemaNiveles))).data
}

export async function obtenerSedes(): Promise<Sede[]> {
  return (await leer('sedes', '/v1/sedes', sobre(esquemaSedes))).data
}

export async function obtenerNoticias(limite = 6): Promise<ListaNoticias> {
  const r = await leer('noticias', `/v1/noticias?limite=${limite}&pagina=1`, sobrePaginado(esquemaNoticias))
  return { noticias: r.data.slice(0, limite), meta: r.meta }
}

export async function obtenerGrados(): Promise<GrupoGrados[]> {
  return (await leer('grados', '/v1/grados', sobre(esquemaGrados))).data
}

// Matrícula

export async function obtenerCabeceraMatricula(): Promise<CabeceraMatricula> {
  return (await leer('matricula-cabecera', '/v1/matricula/cabecera', sobre(esquemaCabeceraMatricula))).data
}

export async function obtenerProcesosMatricula(): Promise<ProcesoMatricula[]> {
  return (await leer('matricula-procesos', '/v1/matricula/procesos', sobre(esquemaProcesos))).data
}

export async function obtenerVacantes(): Promise<Vacantes> {
  return (await leer('matricula-vacantes', '/v1/matricula/vacantes', sobre(esquemaVacantes))).data
}

export async function obtenerFechasMatricula(): Promise<FechasMatricula> {
  return (await leer('matricula-fechas', '/v1/matricula/fechas', sobre(esquemaFechasMatricula))).data
}

export async function obtenerPreguntasMatricula(): Promise<PreguntaFrecuente[]> {
  return (await leer('matricula-preguntas', '/v1/matricula/preguntas', sobre(esquemaPreguntas))).data
}

// Textos del formulario «Solicitar información» (Matrícula y Contacto)
export async function obtenerSolicitud(): Promise<SolicitudInformacion> {
  return (await leer('solicitud', '/v1/solicitud', sobre(esquemaSolicitud))).data
}

// Contacto

export async function obtenerContacto(): Promise<Contacto> {
  return (await leer('contacto', '/v1/contacto', sobre(esquemaContacto))).data
}
