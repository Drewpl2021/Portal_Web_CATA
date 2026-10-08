// Genera docs/api-contract.schema.json desde src/api/esquemas.ts.
// Uso: npm run esquema
import { writeFileSync } from 'node:fs'
import { zodToJsonSchema } from 'zod-to-json-schema'
import {
  esquemaAviso,
  esquemaGrados,
  esquemaNiveles,
  esquemaNoticias,
  esquemaQuienesSomos,
  esquemaRutas,
  esquemaSedes,
  esquemaSitio,
  sobre,
  sobrePaginado,
} from '../src/api/esquemas'

const respuestas = {
  'GET /v1/sitio': sobre(esquemaSitio),
  'GET /v1/portada/rutas': sobre(esquemaRutas),
  'GET /v1/avisos/vigente': sobre(esquemaAviso),
  'GET /v1/quienes-somos': sobre(esquemaQuienesSomos),
  'GET /v1/niveles': sobre(esquemaNiveles),
  'GET /v1/sedes': sobre(esquemaSedes),
  'GET /v1/noticias': sobrePaginado(esquemaNoticias),
  'GET /v1/grados': sobre(esquemaGrados),
}

const definitions = Object.fromEntries(
  Object.entries(respuestas).map(([ruta, esquema]) => [
    ruta,
    zodToJsonSchema(esquema, { target: 'jsonSchema7', $refStrategy: 'none' }),
  ]),
)

const documento = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'API pública del portal CATA v1 (docs/API_CONTRACT.md)',
  description: 'Cuerpo de respuesta 200 de cada endpoint. Generado desde PW_Frontend/src/api/esquemas.ts; no editar a mano.',
  definitions,
}

writeFileSync(new URL('../../docs/api-contract.schema.json', import.meta.url), JSON.stringify(documento, null, 2) + '\n')
console.log('docs/api-contract.schema.json actualizado')
