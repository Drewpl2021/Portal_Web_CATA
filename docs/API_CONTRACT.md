# Contrato de la API pública del portal CATA

**Versión del contrato:** 1.0 · **Fecha:** 2026-10-08
**Quién la expone:** el módulo «Portal web» del sistema de RR.HH. del colegio.
**Quién la consume:** el portal público `cata.edu.pe` (React). El portal no tiene login y solo lee.

Este documento es la referencia para programar el módulo. Si algo no está aquí, el portal no lo usa. Cualquier cambio de nombres, tipos u obligatoriedad requiere una nueva versión del contrato acordada con el equipo del portal.

---

## 1. Reglas generales

### 1.1 Base y versión

- URL base: la define el colegio, por ejemplo `https://rrhh.cata.edu.pe/api/portal`. El portal la recibe en la variable `VITE_API_URL`.
- Todas las rutas empiezan con `/v1`. Un cambio incompatible se publica como `/v2`, y `/v1` se mantiene hasta que el portal migre.
- Solo se usa el método `GET`. Ningún endpoint modifica datos.
- **Todas las URL** que devuelve la API (imágenes, enlaces, mapas, portal académico) son absolutas y empiezan con `https://`. Una URL `http://` hace que el portal descarte la respuesta.
- Ningún endpoint requiere autenticación. **No expongan datos personales del personal ni de alumnos**: solo el contenido que el colegio decide publicar.

### 1.2 Cabeceras de respuesta

| Cabecera | Valor |
|---|---|
| `Content-Type` | `application/json; charset=utf-8` |
| `Access-Control-Allow-Origin` | el origen que hace la petición, si está en la lista permitida: producción `https://cata.edu.pe`, el dominio de pruebas que el colegio defina (p. ej. `https://pruebas.cata.edu.pe`) y, en desarrollo, `http://localhost:5173` |
| `Access-Control-Allow-Methods` | `GET, OPTIONS` |
| `Cache-Control` | `public, max-age=60` (recomendado) |

### 1.3 Sobre de respuesta

Toda respuesta exitosa (`200`) tiene esta forma:

```json
{ "data": <contenido del endpoint> }
```

Las listas paginadas agregan `meta` (ver §3.7).

### 1.4 Errores

Ante un error, el código HTTP lo indica y el cuerpo tiene esta forma:

```json
{ "error": { "codigo": "NO_ENCONTRADO", "mensaje": "Texto legible para el registro técnico." } }
```

| HTTP | `codigo` | Cuándo |
|---|---|---|
| 400 | `PARAMETRO_INVALIDO` | Un parámetro de consulta no es válido (p. ej. `limite=abc`). |
| 404 | `NO_ENCONTRADO` | La ruta no existe. |
| 500 | `ERROR_INTERNO` | Falla del servidor. |
| 503 | `NO_DISPONIBLE` | Mantenimiento. |

**Que no haya contenido no es un error.** Si no hay noticias, se responde `200` con `"data": []`. Si no hay aviso vigente, `200` con `"data": null`. El portal muestra su propio estado vacío.

### 1.5 Campos y valores

- **Nombres de campo** en español, `camelCase`, sin tildes ni ñ (`anioFundacion`, no `añoFundación`).
- **Todos los campos están siempre presentes.** En las tablas, la columna «¿Puede ser null?» indica si el campo admite `null`; ningún campo se omite. Un campo que falta, aunque admita `null`, hace que el portal descarte la respuesta y muestre el error de esa sección. Una lista sin elementos se envía como `[]`, nunca `null`.
- **Identificadores (`id`)**: texto (`string`), únicos dentro de su tipo y estables en el tiempo. Pueden ser números convertidos a texto (`"12"`).
- **Orden**: las listas llegan **en el orden en que deben mostrarse**. El portal no reordena nada.
- **Textos**: texto plano UTF-8. **Sin HTML ni Markdown**: el portal escapa todo lo que recibe. Sin espacios al inicio ni al final. Los saltos de línea dentro de un campo no se respetan; para varios párrafos se usa una lista de textos (`parrafos`).
- **Largos**: cada campo indica un largo máximo **recomendado** para validar en el formulario del módulo. El portal soporta textos más largos sin romperse, pero se verán peor.

### 1.6 Fechas

- **Fecha** (sin hora): ISO 8601 `AAAA-MM-DD`, por ejemplo `"2026-10-08"`.
- **Fecha y hora**: ISO 8601 con zona horaria explícita, por ejemplo `"2026-10-08T07:30:00-05:00"`. El colegio usa la hora de Lima (`-05:00`).
- El portal formatea las fechas para mostrarlas (p. ej. «8 de octubre de 2026»). La API no envía fechas ya formateadas.

### 1.7 Imágenes: tipo `Imagen`

Toda imagen se envía como objeto, nunca como texto suelto:

```json
{ "url": "https://rrhh.cata.edu.pe/media/sedes/central.jpg", "alt": "Fachada de la Sede Central en el jirón Moquegua", "ancho": 1600, "alto": 1200 }
```

| Campo | Tipo | ¿Puede ser null? | Descripción |
|---|---|---|---|
| `url` | string | no | URL **absoluta** `https://`, accesible públicamente. |
| `alt` | string | no (puede ser `""`) | Texto alternativo para lectores de pantalla. |
| `ancho` | integer \| null | sí | Ancho original en píxeles. |
| `alto` | integer \| null | sí | Alto original en píxeles. |

**Reglas de `alt` (requisito WCAG 2.2 AA):**

- Describe **lo que muestra la foto y por qué importa**, no la palabra «foto»: «Alumnos de primaria en el biohuerto de la sede Oasis», no «imagen1.jpg» ni «foto».
- Si la imagen tiene **texto dentro** (un banner con «Matrícula 2027»), el `alt` debe incluir ese texto.
- `""` (vacío) **solo** si la imagen es decorativa y no aporta información. El portal la oculta a los lectores de pantalla.
- Máximo recomendado: 150 caracteres. El módulo debe pedir este campo al subir cada imagen y no dejar `alt` sin decidir.

**Recomendaciones de archivo:** JPEG o WebP, máximo 400 KB, sin datos de ubicación (EXIF). El portal recorta cada imagen a la proporción de su espacio, centrada:

| Uso | Proporción en pantalla | Tamaño mínimo recomendado |
|---|---|---|
| Foto de sede | 4:3 | 1200 × 900 |
| Foto de nivel | 3:2 | 1200 × 800 |
| Foto de Quiénes somos | 4:5 (vertical) | 1200 × 1500 |
| Foto de noticia | 3:2 | 1200 × 800 |
| Imagen de aviso | se muestra completa, sin recorte | 1900 de ancho |

### 1.8 Tipos auxiliares

**`Telefono`**

| Campo | Tipo | Descripción |
|---|---|---|
| `numero` | string | Formato E.164, para enlaces `tel:` y WhatsApp. Ej.: `"+5151325096"`, `"+51986322833"`. |
| `visible` | string | Como debe leerse. Ej.: `"051 325096"`, `"986 322 833"`. Máx. 20. |

**`Enlace`**

| Campo | Tipo | Descripción |
|---|---|---|
| `etiqueta` | string | Texto del enlace. Debe decir a dónde lleva («Ver requisitos de matrícula»), no «clic aquí». Máx. 40. |
| `url` | string | URL absoluta `https://`. |
| `externo` | boolean | `true` si sale del portal. El portal lo abre en otra pestaña y lo anuncia. |

**`Destino`**: a dónde lleva una parada de ruta. Es uno de estos dos objetos:

```json
{ "tipo": "seccion", "seccion": "sedes" }
{ "tipo": "url", "url": "https://cata.edu.pe/new_matricula/", "externo": true }
```

Valores válidos de `seccion`: `"quienes-somos"`, `"niveles"`, `"sedes"`, `"noticias"`, `"contacto"`.

---

## 2. Resumen de endpoints

| Método y ruta | Devuelve en `data` | Sección del portal |
|---|---|---|
| `GET /v1/sitio` | `Sitio` | Cabecera, contacto, pie |
| `GET /v1/portada/rutas` | `Rutas` | Las dos placas de ruta |
| `GET /v1/avisos/vigente` | `Aviso` o `null` | Placa de aviso |
| `GET /v1/quienes-somos` | `QuienesSomos` | Quiénes somos |
| `GET /v1/niveles` | `Niveles` | Niveles |
| `GET /v1/sedes` | `Sede[]` | Sedes |
| `GET /v1/noticias` | `Noticia[]` + `meta` | Noticias y comunicados |
| `GET /v1/grados` | `GrupoGrados[]` | Selector de grado de Solicitar información |

Cada sección del portal carga su endpoint por separado. Si uno falla, esa sección muestra su error y el resto sigue funcionando.

**Excepción importante: `/v1/sitio`.** Lo usan la cabecera (nombre y contactos), el formulario Solicitar información (número de WhatsApp), el estado vacío de noticias, la placa de contacto y el pie. Si `/v1/sitio` falla, todas esas partes quedan sin datos a la vez. Es el endpoint que más conviene mantener disponible y rápido.

---

## 3. Endpoints

### 3.1 `GET /v1/sitio`

Datos generales del colegio.

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `nombre` | string | no | 80 | «Colegio Adventista Túpac Amaru». |
| `nombreCorto` | string | no | 20 | «CATA». |
| `subtitulo` | string \| null | sí | 90 | Línea bajo el nombre. Ej.: «Inicial · Primaria · Secundaria». |
| `ciudad` | string | no | 40 | «Juliaca». |
| `anioFundacion` | integer | no | — | `1971`. |
| `telefono` | `Telefono` | no | — | Teléfono principal. |
| `whatsapp` | `Telefono` | no | — | Número que recibe las solicitudes de información. |
| `direccion` | `Direccion` | no | — | Dirección principal (ver abajo). |
| `portalAcademicoUrl` | string \| null | sí | — | Acceso a iCRM. Si es `null`, el portal oculta ese acceso. |
| `promotora` | string \| null | sí | 120 | Texto legal del pie. Ej.: «Asociación Educativa Colegio Adventista Túpac Amaru». |

**`Direccion`**: `linea` (string, máx. 80), `referencia` (string \| null, máx. 100), `distrito` (string \| null, máx. 80).

```json
{
  "data": {
    "nombre": "Colegio Adventista Túpac Amaru",
    "nombreCorto": "CATA",
    "subtitulo": "Inicial · Primaria · Secundaria",
    "ciudad": "Juliaca",
    "anioFundacion": 1971,
    "telefono": { "numero": "+5151325096", "visible": "051 325096" },
    "whatsapp": { "numero": "+51986322833", "visible": "986 322 833" },
    "direccion": { "linea": "Jr. Moquegua N° 852", "referencia": "Frente al Mercado Internacional Túpac Amaru", "distrito": "Juliaca, San Román, Puno" },
    "portalAcademicoUrl": "https://cata.icrmedu.com/Academico/Paginas/Login.aspx",
    "promotora": "Asociación Educativa Colegio Adventista Túpac Amaru"
  }
}
```

### 3.2 `GET /v1/portada/rutas`

Los textos de las dos placas de ruta de la primera pantalla.

| Campo | Tipo | ¿Puede ser null? | Descripción |
|---|---|---|---|
| `familias` | `RutaFamilias` | no | Placa para familias que evalúan el colegio. |
| `comunidad` | `RutaComunidad` | no | Placa para la comunidad actual. |

**Campos comunes de una ruta**

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `nombre` | string | no | 40 | Nombre grande de la ruta. Ej.: «Familias que nos conocen». |
| `bajada` | string \| null | sí | 110 | Frase bajo el nombre. |
| `paradas` | `Parada[]` | no | 1 a 4 elementos | Paradas intermedias, en orden. |

**`Parada`**: `id` (string), `etiqueta` (string, máx. 24), `detalle` (string \| null, máx. 40), `destino` (`Destino`).

**`RutaFamilias`** agrega `accion`, la parada final que abre Solicitar información:

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `accion.etiqueta` | string | no | 28 | Ej.: «Solicitar información». |
| `accion.detalle` | string \| null | sí | 40 | Ej.: «Te respondemos por WhatsApp». |
| `accion.mensajeWhatsapp` | string | no | 300 | Plantilla del mensaje. El portal reemplaza `{nombre}` y `{grado}`. |

**`RutaComunidad`** agrega `terminal`, la parada final (`Parada` o `null`). Normalmente es el portal académico.

```json
{
  "data": {
    "familias": {
      "nombre": "Familias que nos conocen",
      "bajada": "Conoce el colegio y pide información sin compromiso.",
      "paradas": [
        { "id": "f1", "etiqueta": "Quiénes somos", "detalle": "Desde 1971", "destino": { "tipo": "seccion", "seccion": "quienes-somos" } },
        { "id": "f2", "etiqueta": "Niveles", "detalle": "Inicial, primaria, secundaria", "destino": { "tipo": "seccion", "seccion": "niveles" } },
        { "id": "f3", "etiqueta": "Sedes", "detalle": "Cuatro en San Román", "destino": { "tipo": "seccion", "seccion": "sedes" } }
      ],
      "accion": {
        "etiqueta": "Solicitar información",
        "detalle": "Te respondemos por WhatsApp",
        "mensajeWhatsapp": "Hola, soy {nombre}. Quisiera información sobre {grado} en CATA."
      }
    },
    "comunidad": {
      "nombre": "Comunidad CATA",
      "bajada": "Comunicados, noticias y accesos para familias y alumnos.",
      "paradas": [
        { "id": "c1", "etiqueta": "Noticias", "detalle": "Lo último del colegio", "destino": { "tipo": "seccion", "seccion": "noticias" } },
        { "id": "c2", "etiqueta": "Matrícula", "detalle": "Requisitos", "destino": { "tipo": "url", "url": "https://cata.edu.pe/new_matricula/", "externo": true } },
        { "id": "c3", "etiqueta": "Contacto", "detalle": "Teléfono y WhatsApp", "destino": { "tipo": "seccion", "seccion": "contacto" } }
      ],
      "terminal": { "id": "c4", "etiqueta": "Portal académico", "detalle": "iCRM educativo", "destino": { "tipo": "url", "url": "https://cata.icrmedu.com/Academico/Paginas/Login.aspx", "externo": true } }
    }
  }
}
```

### 3.3 `GET /v1/avisos/vigente`

El **único** aviso (banner) que se muestra en la portada. El módulo elige cuál: el más reciente cuya vigencia incluye el momento actual. Si no hay ninguno, responde `"data": null`.

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `id` | string | no | — | |
| `titulo` | string | no | 90 | Siempre visible como título del aviso, aunque la imagen ya lo diga. |
| `texto` | string \| null | sí | 240 | Detalle. |
| `imagen` | `Imagen` \| null | sí | — | Se muestra completa, sin recorte. Si tiene texto dentro, el `alt` debe repetirlo. |
| `enlace` | `Enlace` \| null | sí | — | Botón del aviso. |
| `vigenteDesde` | fecha y hora | no | — | |
| `vigenteHasta` | fecha y hora \| null | sí | — | `null` = sin fecha de fin. |

El portal nunca rota avisos ni los hace avanzar solos.

```json
{
  "data": {
    "id": "15",
    "titulo": "Año académico 2026",
    "texto": "Conoce las novedades del nuevo año en todas nuestras sedes.",
    "imagen": { "url": "https://cata.edu.pe/wp-content/uploads/2025/12/Banner-CATA.png", "alt": "Emblema del colegio junto al texto 2026 y la dirección www.cata.edu.pe", "ancho": 1900, "alto": 700 },
    "enlace": null,
    "vigenteDesde": "2026-01-05T00:00:00-05:00",
    "vigenteHasta": null
  }
}
```

### 3.4 `GET /v1/quienes-somos`

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `titulo` | string | no | 80 | |
| `parrafos` | string[] | no | 1 a 6 párrafos, de 600 cada uno | |
| `foto` | `Imagen` \| null | sí | — | Proporción 4:5. |
| `simbolos` | `Simbolo[]` | no | 0 a 8 | Significado del emblema. `[]` oculta el bloque. |

**`Simbolo`**: `nombre` (string, máx. 40), `significado` (string, máx. 160).

```json
{
  "data": {
    "titulo": "Educación adventista en Juliaca desde 1971.",
    "parrafos": [
      "El colegio nació de la Iglesia Adventista del Séptimo Día Villa Hermosa, organizada en 1967 en el barrio Túpac Amaru.",
      "Hoy lo promueve la Asociación Educativa Colegio Adventista Túpac Amaru."
    ],
    "foto": { "url": "https://rrhh.cata.edu.pe/media/portal/quienes-somos.jpg", "alt": "Estudiantes de secundaria con uniforme del colegio en el patio de la Sede Central", "ancho": 1200, "alto": 1500 },
    "simbolos": [
      { "nombre": "Las manos abiertas", "significado": "Estar dispuestos a extender la mano a quien más lo necesita." }
    ]
  }
}
```

### 3.5 `GET /v1/niveles`

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `titulo` | string | no | 60 | Ej.: «Inicial, primaria y secundaria». |
| `propuestaUrl` | string \| null | sí | — | Enlace a la propuesta educativa. Si es `null`, se oculta. |
| `items` | `Nivel[]` | no | 0 a 4 | |

**`Nivel`**

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `id` | string | no | — | |
| `nombre` | string | no | 24 | «Inicial». |
| `rango` | string \| null | sí | 40 | «3, 4 y 5 años». |
| `sede` | string \| null | sí | 60 | «Sede CATA Inicial». |
| `reconocimiento` | string \| null | sí | 60 | «Reconocido en 1998». |
| `foto` | `Imagen` \| null | sí | — | Proporción 3:2. |

```json
{
  "data": {
    "titulo": "Inicial, primaria y secundaria",
    "propuestaUrl": "https://cata.edu.pe/new_propuestaeducativa/",
    "items": [
      { "id": "inicial", "nombre": "Inicial", "rango": "3, 4 y 5 años", "sede": "Sede CATA Inicial", "reconocimiento": "Reconocido en 1998", "foto": { "url": "https://rrhh.cata.edu.pe/media/niveles/inicial.jpg", "alt": "Niños de inicial jugando con bloques en su aula", "ancho": 1200, "alto": 800 } },
      { "id": "secundaria", "nombre": "Secundaria", "rango": "1.er a 5.º año", "sede": null, "reconocimiento": "Reconocido en 1982", "foto": null }
    ]
  }
}
```

### 3.6 `GET /v1/sedes`

Devuelve `Sede[]` (0 a 8 elementos) en orden de recorrido.

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `id` | string | no | — | |
| `nombre` | string | no | 40 | «Sede CATA Jerusalén». |
| `direccion` | string | no | 90 | |
| `referencia` | string \| null | sí | 100 | |
| `distrito` | string \| null | sí | 80 | |
| `telefono` | `Telefono` \| null | sí | — | |
| `nota` | string \| null | sí | 160 | Ej.: «Nivel primaria.» |
| `foto` | `Imagen` \| null | sí | — | Proporción 4:3. |
| `mapaUrl` | string \| null | sí | — | Enlace a Google Maps. Si es `null`, el portal busca la dirección en Google Maps. |

```json
{
  "data": [
    {
      "id": "jerusalen",
      "nombre": "Sede CATA Jerusalén",
      "direccion": "Titiline Independencia N° 2, Urb. Jerusalem",
      "referencia": "Puente Independencia, salida a Huancané",
      "distrito": "San Miguel, San Román, Puno",
      "telefono": { "numero": "+51937489399", "visible": "937 489 399" },
      "nota": "Nivel primaria.",
      "foto": { "url": "https://rrhh.cata.edu.pe/media/sedes/jerusalen.jpg", "alt": "Patio de la Sede CATA Jerusalén con estudiantes en el recreo", "ancho": 1600, "alto": 1200 },
      "mapaUrl": null
    }
  ]
}
```

### 3.7 `GET /v1/noticias`

Noticias y comunicados publicados, **de la más reciente a la más antigua** por `fecha`.

**Parámetros de consulta**

| Parámetro | Tipo | Por defecto | Reglas |
|---|---|---|---|
| `limite` | integer | 6 | 1 a 24 |
| `pagina` | integer | 1 | ≥ 1 |

**Respuesta**

```json
{
  "data": [ <Noticia>, ... ],
  "meta": { "pagina": 1, "limite": 6, "total": 23 }
}
```

**`Noticia`**

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `id` | string | no | — | |
| `slug` | string | no | 120 | Para la futura página de detalle. Solo `a-z`, `0-9` y `-`. |
| `tipo` | `"noticia"` \| `"comunicado"` | no | — | Los comunicados son avisos oficiales para la comunidad. |
| `titulo` | string | no | 120 | |
| `resumen` | string \| null | sí | 280 | |
| `fecha` | fecha `AAAA-MM-DD` | no | — | Fecha de publicación. |
| `foto` | `Imagen` \| null | sí | — | Proporción 3:2. |
| `enlace` | `Enlace` \| null | sí | — | Documento o página con el contenido completo. |

```json
{
  "data": [
    {
      "id": "128",
      "slug": "reunion-de-padres-de-familia",
      "tipo": "comunicado",
      "titulo": "Reunión de padres de familia",
      "resumen": "Se convoca a los padres de primaria a la reunión del primer bimestre en la Sede Central.",
      "fecha": "2026-09-15",
      "foto": null,
      "enlace": { "etiqueta": "Ver el comunicado completo", "url": "https://rrhh.cata.edu.pe/media/comunicados/128.pdf", "externo": true }
    }
  ],
  "meta": { "pagina": 1, "limite": 6, "total": 23 }
}
```

### 3.8 `GET /v1/grados`

Las opciones del selector de grado de Solicitar información, agrupadas por nivel.

**`GrupoGrados`**: `nivel` (string, máx. 24) y `opciones` (string[], 1 a 8 elementos, máx. 24 cada uno).

```json
{
  "data": [
    { "nivel": "Inicial", "opciones": ["3 años", "4 años", "5 años"] },
    { "nivel": "Primaria", "opciones": ["1.er grado", "2.º grado", "3.er grado", "4.º grado", "5.º grado", "6.º grado"] },
    { "nivel": "Secundaria", "opciones": ["1.er año", "2.º año", "3.er año", "4.º año", "5.º año"] }
  ]
}
```

---

## 4. Lo que el portal hace con cada caso

Esto sirve para que el módulo sepa qué pasa con lo que publica.

| Situación | Comportamiento del portal |
|---|---|
| Endpoint tarda | Muestra un esqueleto de la sección. |
| Endpoint falla (`4xx`/`5xx`, red, JSON inválido) | Muestra «No pudimos cargar…» con un botón **Reintentar**, solo en esa sección. |
| Campo con tipo equivocado | Se trata como error de la sección y se registra en la consola. |
| Lista vacía (`[]`) | Estado vacío propio de la sección, o la sección se oculta (símbolos). |
| `foto: null` | El bloque se arma sin foto, sin recuadro vacío. |
| `alt: ""` | Imagen decorativa, oculta para lectores de pantalla. |
| La URL de una imagen no carga | Se oculta la imagen y el texto sigue visible. |
| Aviso `null` | La placa de aviso no aparece. |

---

## 5. Esquema verificable por máquina

`docs/api-contract.schema.json` es un JSON Schema (draft-07) con la forma exacta de la respuesta de cada endpoint, generado desde las mismas validaciones que usa el portal. Sirve para validar las respuestas del módulo en sus propias pruebas, con cualquier lenguaje. Si este documento y el esquema no coinciden, avisen al equipo del portal.

## 6. Pruebas sin la API

El portal trae datos de prueba que cumplen este contrato en `PW_Frontend/src/api/mock/`. Sirven de **ejemplos completos** de cada respuesta: el módulo puede compararse con ellos.

- `tipico/`: contenido real del colegio.
- Escenarios que solo cambian algunos archivos: `corto/`, `largo/`, `sin-foto/`, `alt-vacio/` y `vacio/`.
- Las pruebas automáticas (`npm test` en `PW_Frontend/`) validan todos esos archivos contra este contrato.
