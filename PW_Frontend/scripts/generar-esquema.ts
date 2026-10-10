// Genera docs/api-contract.schema.json desde src/api/esquemas.ts.
// Uso: npm run esquema
import { writeFileSync } from 'node:fs'
import { zodToJsonSchema } from 'zod-to-json-schema'
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
  esquemaDocentes,
  esquemaAcademia,
  esquemaHero,
  esquemaNivelesPropuesta,
  esquemaPilares,
  esquemaPlataformas,
  esquemaLogros,
  esquemaGrados,
  esquemaNiveles,
  esquemaNoticias,
  esquemaNosotros,
  esquemaPaginaContenido,
  esquemaProyecto,
  esquemaProyectos,
  esquemaQuienesSomos,
  esquemaSedes,
  esquemaSitio,
  sobre,
  sobrePaginado,
} from '../src/api/esquemas'

const respuestas = {
  'GET /v1/sitio': sobre(esquemaSitio),
  'GET /v1/portada/banners': sobre(esquemaBanners),
  'GET /v1/quienes-somos': sobre(esquemaQuienesSomos),
  'GET /v1/niveles': sobre(esquemaNiveles),
  'GET /v1/sedes': sobre(esquemaSedes),
  'GET /v1/noticias': sobrePaginado(esquemaNoticias),
  'GET /v1/grados': sobre(esquemaGrados),
  'GET /v1/propuesta-educativa/cabecera': sobre(esquemaHero),
  'GET /v1/portada/cifras': sobre(esquemaCifras),
  'GET /v1/matricula/cabecera': sobre(esquemaCabeceraMatricula),
  'GET /v1/matricula/procesos': sobre(esquemaProcesos),
  'GET /v1/matricula/vacantes': sobre(esquemaVacantes),
  'GET /v1/matricula/fechas': sobre(esquemaFechasMatricula),
  'GET /v1/matricula/preguntas': sobre(esquemaPreguntas),
  'GET /v1/solicitud': sobre(esquemaSolicitud),
  'GET /v1/contacto': sobre(esquemaContacto),
  'GET /v1/proyectos': sobre(esquemaProyectos),
  'GET /v1/proyectos/{slug}': sobre(esquemaProyecto),
  'GET /v1/nosotros': sobre(esquemaNosotros),
  'GET /v1/nosotros/paginas/{slug}': sobre(esquemaPaginaContenido),
  'GET /v1/docentes': sobre(esquemaDocentes),
  'GET /v1/logros': sobre(esquemaLogros),
  'GET /v1/propuesta-educativa/pilares': sobre(esquemaPilares),
  'GET /v1/propuesta-educativa/niveles': sobre(esquemaNivelesPropuesta),
  'GET /v1/propuesta-educativa/academia': sobre(esquemaAcademia),
  'GET /v1/propuesta-educativa/plataformas': sobre(esquemaPlataformas),
}

const definitions = Object.fromEntries(
  Object.entries(respuestas).map(([ruta, esquema]) => [
    ruta,
    zodToJsonSchema(esquema, { target: 'jsonSchema7', $refStrategy: 'none' }),
  ]),
)

const documento = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'API pública del portal CATA 2.12 (docs/API_CONTRACT.md)',
  description: 'Cuerpo de respuesta 200 de cada endpoint. Generado desde PW_Frontend/src/api/esquemas.ts; no editar a mano.',
  definitions,
}

writeFileSync(new URL('../../docs/api-contract.schema.json', import.meta.url), JSON.stringify(documento, null, 2) + '\n')
console.log('docs/api-contract.schema.json actualizado')
