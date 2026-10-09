# Contrato de la API pública del portal CATA

**Versión del contrato:** 2.9 · **Fecha:** 2026-10-09

**Cambios de la 2.9:** en `GET /v1/sitio` (§3.1), `portalAcademicoUrl` pasa a `portalAcademico: { nombre, url }`, para que el botón muestre el nombre de la plataforma (hoy, **Cubicol**; antes, iCRM) sin cambiar el código del portal. El portal solo enlaza a la plataforma: nunca replica su inicio de sesión ni pide usuario o contraseña.

**Cambios de la 2.8:** cuatro endpoints nuevos para el cuerpo de Propuesta Educativa (§3.23 a §3.26): `pilares`, `niveles`, `academia` y `plataformas`, bajo `/v1/propuesta-educativa/`.

**Cambios de la 2.7:** cada `Logro` (§3.22) suma `fuente` (de dónde sale el dato, con enlace si es público) y `aclaracion` (aviso visible sobre un dato incompleto, como «Año por confirmar»). El filtro por año pasa a ser por década.

**Cambios de la 2.6:** nuevo `GET /v1/logros` (§3.22): la página Logros, con sus cifras y la lista de logros por categoría y año.

**Cambios de la 2.5:**
- Nuevo `GET /v1/docentes` (§3.21): el personal docente con su nivel, para la página Personal Docente.
- Bloque `enlaces` (§3.20): cada enlace suma `peso` (bytes, o `null` si no es un archivo) y el formato `"canva"`.
- Nuevo slug `personal-docente` en Institución, después de `administracion`.
- Las subpáginas de Gestión y Documentos pasan a mostrarse con la página de contenido.

**Cambios de la 2.4:** nuevos `GET /v1/nosotros` (§3.19), con las frases del índice de Nosotros, y `GET /v1/nosotros/paginas/{slug}` (§3.20), una **página de contenido armada con bloques** que sirve para todas las subpáginas de Nosotros. El detalle responde `404` si la página no existe.

**Cambios de la 2.3:**
- Nuevos `GET /v1/proyectos` (§3.17) y `GET /v1/proyectos/{slug}` (§3.18): la lista de proyectos con sus categorías y el detalle de cada uno. El detalle responde `404` si el proyecto no existe.
- `GET /v1/solicitud` (§3.15) suma `mensajesPorPagina`: una plantilla de WhatsApp por página (`matricula`, `contacto`). `mensajeWhatsapp` queda como plantilla general.

**Cambios de la 2.2:**
- Nuevo `GET /v1/contacto` (§3.16): cabecera de la página Contacto, correo general y redes sociales.
- `Sede` (§3.6) suma tres campos: `correo`, `horario` y `mapaEmbedUrl`. Inicio los ignora; la página Contacto los muestra.
- `GET /v1/matricula/solicitud` pasa a `GET /v1/solicitud` (§3.15), con la misma forma, porque el formulario «Solicitar información» ahora está en Matrícula y en Contacto.
- `anio` de la cabecera de Matrícula (§3.10): se aclara que lo define el colegio.

**Cambios de la 2.1:** seis endpoints nuevos para la página Matrícula, bajo `/v1/matricula/`: `cabecera`, `procesos`, `vacantes`, `fechas`, `preguntas` y `solicitud` (§3.10 a §3.15). `GET /v1/grados` pasa a usarse en el formulario de Matrícula. No cambia ningún endpoint anterior.

**Cambios de la 2.0** (antes de que el módulo se implemente, por eso las rutas siguen bajo `/v1`):
- Nuevo `GET /v1/portada/banners`: el carrusel de Inicio. Reemplaza el aviso único.
- Se eliminan `GET /v1/portada/rutas` y `GET /v1/avisos/vigente` (eran de la portada anterior).
- `GET /v1/portada/hero` pasa a `GET /v1/propuesta-educativa/cabecera`, con la misma forma: ahora es la cabecera de la página Propuesta Educativa.
- Se mantiene `GET /v1/portada/cifras` (agregado en la 1.2).
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

**Que no haya contenido no es un error.** Si no hay noticias, se responde `200` con `"data": []`. Si no hay banners, `200` con `"data": []`. El portal muestra su propio estado vacío.

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
| Banner del carrusel, escritorio | ≈ 1900:700, recortada en el punto focal | 1920 × 708 |
| Banner del carrusel, móvil | 4:5 | 1080 × 1350 |
| Recorte de la cabecera de Matrícula | ≈ 1:2, PNG transparente, completo | 500 × 1000 |

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
{ "tipo": "pagina", "ruta": "/matricula" }
{ "tipo": "url", "url": "https://cata.edu.pe/new_matricula/", "externo": true }
```

Valores válidos de `seccion`: `"quienes-somos"`, `"niveles"`, `"sedes"`, `"noticias"`, `"contacto"`.

`"pagina"` lleva a otra página del propio portal. `ruta` empieza con `/` y solo usa `a-z`, `0-9`, `-` y `/` (por ejemplo `/matricula`, `/nosotros/mision-y-vision`).

---

## 2. Resumen de endpoints

| Método y ruta | Devuelve en `data` | Sección del portal |
|---|---|---|
| `GET /v1/sitio` | `Sitio` | Cabecera, contacto, pie |
| `GET /v1/portada/banners` | `Banner[]` | Carrusel de Inicio (primera sección) |
| `GET /v1/quienes-somos` | `QuienesSomos` | Quiénes somos |
| `GET /v1/niveles` | `Niveles` | Niveles |
| `GET /v1/sedes` | `Sede[]` | Sedes de Inicio; fichas y mapa de Contacto |
| `GET /v1/noticias` | `Noticia[]` + `meta` | Noticias y comunicados |
| `GET /v1/grados` | `GrupoGrados[]` | Selector de grado de Solicitar información (Matrícula y Contacto) |
| `GET /v1/propuesta-educativa/cabecera` | `Hero` | Cabecera de la página Propuesta Educativa |
| `GET /v1/portada/cifras` | `Cifra[]` | Cifras destacadas de Inicio |
| `GET /v1/matricula/cabecera` | `CabeceraMatricula` | Cabecera de Matrícula |
| `GET /v1/matricula/procesos` | `ProcesoMatricula[]` | Pasos, requisitos y documentos |
| `GET /v1/matricula/vacantes` | `Vacantes` | Niveles y vacantes |
| `GET /v1/matricula/fechas` | `FechasMatricula` | Cronograma de matrícula |
| `GET /v1/matricula/preguntas` | `PreguntaFrecuente[]` | Preguntas frecuentes de matrícula |
| `GET /v1/solicitud` | `SolicitudInformacion` | Textos del formulario Solicitar información (Matrícula y Contacto) |
| `GET /v1/contacto` | `Contacto` | Cabecera de Contacto, correo general y redes sociales |
| `GET /v1/proyectos` | `Proyectos` | Cabecera y lista de Proyectos, con categorías para el filtro |
| `GET /v1/proyectos/{slug}` | `Proyecto` | Página de detalle de un proyecto (`404` si no existe) |
| `GET /v1/nosotros` | `Nosotros` | Índice de Nosotros: título, frase y una frase por subpágina |
| `GET /v1/nosotros/paginas/{slug}` | `PaginaContenido` | Cada subpágina de Nosotros, armada con bloques (`404` si no existe) |
| `GET /v1/docentes` | `Docentes` | Personal docente por nivel (página Personal Docente) |
| `GET /v1/logros` | `Logros` | Página Logros: cabecera, cifras y logros |
| `GET /v1/propuesta-educativa/pilares` | `PilaresPropuesta` | Cifras, introducción y pilares de Propuesta Educativa |
| `GET /v1/propuesta-educativa/niveles` | `NivelPropuesta[]` | Propuesta de cada nivel: descripción, rasgos y talleres |
| `GET /v1/propuesta-educativa/academia` | `Academia` | Academia preuniversitaria: universidades y ciclos |
| `GET /v1/propuesta-educativa/plataformas` | `Plataforma[]` | Plataformas digitales (Cubicol, EVA) |

Cada sección del portal carga su endpoint por separado. Si uno falla, esa sección muestra su error y el resto sigue funcionando.

**Excepción importante: `/v1/sitio`.** Lo usan la cabecera (nombre y botón del portal académico), el título oculto de Inicio, la medalla, el estado vacío de noticias, el cierre, el formulario «Solicitar información» y la placa de WhatsApp de Contacto (número de WhatsApp) y el pie (contactos y dirección). Si `/v1/sitio` falla, todas esas partes quedan sin datos a la vez. Es el endpoint que más conviene mantener disponible y rápido.

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
| `portalAcademico` | `{ nombre, url }` \| null | sí | — | Plataforma académica externa. `nombre` (máx. 20) es el texto del botón dorado de la cabecera, del menú móvil y del pie («Cubicol»); `url` es su página de inicio de sesión. El portal **solo enlaza** a ella, en otra pestaña: no tiene formulario de acceso. `null` = sin botón. |
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
    "portalAcademico": { "nombre": "Cubicol", "url": "https://cata.cubicol.pe/principal/login" },
    "promotora": "Asociación Educativa Colegio Adventista Túpac Amaru"
  }
}
```

### 3.2 `GET /v1/portada/banners`

El carrusel de la primera sección de Inicio, justo debajo de la cabecera y a todo el ancho: lo último que publica el colegio (avisos, matrículas, eventos, noticias). Devuelve `Banner[]` (0 a 8 elementos), **del más reciente al más antiguo**, en el orden en que se muestran.

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `id` | string | no | — | |
| `categoria` | `"aviso"` \| `"matricula"` \| `"evento"` \| `"noticia"` | no | — | Se muestra junto a la fecha, debajo del título. |
| `titulo` | string | no | 80 | Texto real del banner. El portal lo escribe sobre la imagen, en una placa marina de contraste garantizado. |
| `fecha` | fecha \| null | sí | — | `AAAA-MM-DD`. Opcional. |
| `imagen` | `Imagen` | no | — | Imagen de escritorio, apaisada. Proporción en pantalla ≈ 1900:700. Mínimo 1920 × 708 px. |
| `imagenMovil` | `Imagen` \| null | sí | — | Imagen vertical para pantallas de hasta 700 px de ancho, proporción 4:5, mínimo 1080 × 1350 px. Si es `null`, el portal recorta la de escritorio alrededor de `puntoFocal`. |
| `puntoFocal` | `{ x, y }` \| null | sí | — | Punto que debe quedar a la vista al recortar, en porcentaje (0 a 100) desde la esquina superior izquierda. `null` = centro (50, 50). |
| `alineacion` | `"izquierda"` \| `"derecha"` | no | — | Lado donde el portal pone el título y el botón. Elijan el lado que **no** tape el texto propio de la imagen. |
| `accion` | `AccionHero` \| null | sí | — | Botón opcional (`etiqueta` + `destino`). |

**Afiches con texto incluido (requisito WCAG 2.2 AA):** si la imagen es un afiche o banner que trae texto escrito (títulos, fechas, teléfonos, direcciones, redes), su `alt` debe **repetir todo ese texto**, no solo describir la imagen. Ejemplo: «Afiche: Matrículas abiertas 2026. Inicial, Primaria, Secundaria. Informes por WhatsApp al 986322833, www.cata.edu.pe.» Lo mismo vale para `imagenMovil`. En este caso el `alt` puede pasar de los 150 caracteres recomendados.

**Comportamiento del carrusel en el portal**, para que el colegio sepa qué esperar:
- 0 banners: la sección desaparece sin dejar hueco.
- 1 banner: se muestra fijo, sin flechas, indicadores ni avance.
- 2 o más: avanza solo cada 6 segundos, con flechas, indicadores y un botón visible de Pausar/Reproducir. Se detiene con el mouse encima, con el foco del teclado dentro o con la pestaña oculta. Funciona con las flechas del teclado y con arrastre táctil. Para quien tiene activado «reducir movimiento», no avanza solo y cambia con un fundido.

```json
{
  "data": [
    {
      "id": "b-matriculas",
      "categoria": "matricula",
      "titulo": "Matrículas 2026 abiertas para inicial, primaria y secundaria",
      "fecha": "2026-01-05",
      "imagen": { "url": "https://cata.edu.pe/wp-content/uploads/2025/01/4.png", "alt": "Afiche: Matrículas abiertas 2026. Inicial, Primaria, Secundaria. Informes por WhatsApp al 986322833, www.cata.edu.pe. Un niño con el uniforme del colegio sonríe a la derecha.", "ancho": 1900, "alto": 700 },
      "imagenMovil": null,
      "puntoFocal": { "x": 82, "y": 40 },
      "alineacion": "derecha",
      "accion": { "etiqueta": "Ver requisitos", "destino": { "tipo": "pagina", "ruta": "/matricula" } }
    }
  ]
}
```

### 3.3 `GET /v1/propuesta-educativa/cabecera`

La cabecera de la página Propuesta Educativa: un título grande, una frase, dos botones y hasta tres figuras. El portal arma con las figuras una escena: los recortes de estudiantes delante del anillo del emblema, con la medalla del colegio girando dentro del anillo.

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `titulo` | string | no | 70 | Frase principal. Se muestra muy grande: conviene corta. |
| `bajada` | string \| null | sí | 180 | Frase de apoyo bajo el título. |
| `figuras` | `FiguraHero[]` | no | 0 a 3 | En orden de importancia. Se usan hasta dos recortes; si no hay recortes, la primera foto. `[]` = cabecera solo con texto. |
| `accionPrincipal` | `AccionHero` | no | — | Botón principal. |
| `accionSecundaria` | `AccionHero` \| null | sí | — | Botón secundario. |

**`FiguraHero`**

| Campo | Tipo | ¿Puede ser null? | Descripción |
|---|---|---|---|
| `tipo` | `"recorte"` \| `"foto"` | no | `recorte`: PNG o WebP con **fondo transparente** (una persona u objeto recortado). `foto`: imagen rectangular con fondo. El diseño trata distinto cada tipo. |
| `imagen` | `Imagen` | no | Recorte: mínimo 800 × 1600 px, vertical. Foto: mínimo 1600 × 1200 px. |

**`AccionHero`**: `etiqueta` (string, máx. 32; dice a dónde lleva) y `destino` (`Destino`).

```json
{
  "data": {
    "titulo": "Mejoramos la experiencia de aprendizaje",
    "bajada": "Colegio Adventista Túpac Amaru: inicial, primaria y secundaria en cuatro sedes de Juliaca, desde 1971.",
    "figuras": [
      { "tipo": "recorte", "imagen": { "url": "https://cata.edu.pe/wp-content/uploads/2023/01/CATA-Matricula_Img_2.png", "alt": "Estudiante con el uniforme del colegio, su mochila y un cuaderno de CATA", "ancho": 500, "alto": 1000 } },
      { "tipo": "foto", "imagen": { "url": "https://cata.edu.pe/wp-content/uploads/2025/05/Sin-titulo-1200-x-900-px.png", "alt": "Niño con el uniforme del colegio y lentes, sonriendo y abrazando una Santa Biblia", "ancho": 1200, "alto": 900 } }
    ],
    "accionPrincipal": { "etiqueta": "Proceso de matrícula", "destino": { "tipo": "pagina", "ruta": "/matricula" } },
    "accionSecundaria": { "etiqueta": "Conoce la propuesta educativa", "destino": { "tipo": "pagina", "ruta": "/propuesta-educativa" } }
  }
}
```

Las fotos de estudiantes deben contar con la autorización del colegio y de las familias para su publicación.

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
| `mapaUrl` | string \| null | sí | — | Enlace «Cómo llegar» (Google Maps). Si es `null`, el portal busca la dirección en Google Maps. |
| `correo` | string \| null | sí | 80 | Correo de la sede. Se muestra como enlace `mailto:`. |
| `horario` | `{ dias, horas }[]` | no | 0 a 4 | Horario de atención, una fila por grupo de días: `dias` (máx. 40, «Lunes a viernes») y `horas` (máx. 40, «8:00 a 13:00»). `[]` = no se muestra. |
| `mapaEmbedUrl` | string \| null | sí | — | URL para **insertar** el mapa en la página. Solo se aceptan `https://www.google.com/maps/embed?…` (Google Maps → Compartir → **Insertar un mapa**, el valor de `src`), `https://www.google.com/maps?…&output=embed` u `https://www.openstreetmap.org/export/embed.html?…`. Cualquier otra URL invalida la respuesta. `null` = la sede no aparece con mapa. |

**Mapa y privacidad:** la página Contacto no carga el mapa al abrirse. Muestra un aviso con el nombre de la sede y un botón «Mostrar el mapa»; solo entonces pide el mapa a Google u OpenStreetMap. Así la página no pierde velocidad y el proveedor no recibe la visita sin permiso.

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
      "mapaUrl": null,
      "correo": null,
      "horario": [{ "dias": "Lunes a viernes", "horas": "8:00 a 13:00" }],
      "mapaEmbedUrl": "https://www.google.com/maps/embed?pb=…"
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

Las opciones del selector de grado del formulario «Solicitar información» de la página Matrícula, agrupadas por nivel. Si falla, el formulario pide escribir el grado a mano.

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

### 3.9 `GET /v1/portada/cifras`

Cifras destacadas de Inicio. El portal las muestra con un contador que sube hasta el valor al entrar en pantalla. Devuelve `Cifra[]` (0 a 4 elementos) en el orden en que se muestran. `[]` oculta la sección.

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `id` | string | no | — | |
| `valor` | integer | no | — | Número entero ≥ 0. Solo cifras reales y verificables. |
| `sufijo` | string \| null | sí | 3 | Signo tras el número, por ejemplo `"+"` o `"%"`. |
| `etiqueta` | string | no | 60 | Qué cuenta la cifra: «años educando en Juliaca». |

```json
{
  "data": [
    { "id": "anios", "valor": 55, "sufijo": null, "etiqueta": "años educando en Juliaca" },
    { "id": "sedes", "valor": 4, "sufijo": null, "etiqueta": "sedes en San Román" },
    { "id": "niveles", "valor": 3, "sufijo": null, "etiqueta": "niveles: inicial, primaria y secundaria" }
  ]
}
```

---

### 3.10 `GET /v1/matricula/cabecera`

La cabecera de la página Matrícula: título, frase y, a la derecha, el año del proceso en una placa marina con el recorte de un estudiante delante.

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `titulo` | string | no | 60 | «Proceso de matrícula». |
| `bajada` | string \| null | sí | 160 | Una frase bajo el título. |
| `anio` | integer \| null | sí | — | Año escolar al que corresponde el proceso (2000 a 2100). **Lo define el colegio** en el módulo; el portal no lo calcula ni lo deduce de la fecha. `null` = no se muestra la placa del año. |
| `figura` | `Imagen` \| null | sí | — | Recorte de un estudiante: PNG con fondo transparente, vertical (≈ 1:2), mínimo 500 × 1000 px. `null` = solo la placa del año, o solo texto si `anio` también es `null`. |

```json
{
  "data": {
    "titulo": "Proceso de matrícula",
    "bajada": "Requisitos, documentos y pasos para matricular a tu hijo o hija en inicial, primaria o secundaria.",
    "anio": 2026,
    "figura": { "url": "https://cata.edu.pe/wp-content/uploads/2023/01/CATA-Matricula_Img_1.png", "alt": "Estudiante con el uniforme del colegio y su mochila, haciendo el gesto de pulgar arriba", "ancho": 500, "alto": 1000 }
  }
}
```

---

### 3.11 `GET /v1/matricula/procesos`

Un proceso por tipo de estudiante (nuevos, regulares…), con sus pasos y sus listas de requisitos y documentos. Devuelve `ProcesoMatricula[]` (0 a 4) en el orden en que se muestran. Con dos o más, el portal los muestra en pestañas; con uno, sin pestañas; con `[]`, un estado vacío que invita a escribir por WhatsApp.

**`ProcesoMatricula`**

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `id` | string | no | — | |
| `nombre` | string | no | 40 | Para quién es: «Estudiantes nuevos». Es el texto de la pestaña. |
| `resumen` | string \| null | sí | 160 | Una frase sobre a quién aplica. |
| `pasos` | `{ titulo, detalle }[]` | no | 0 a 8 | En orden. `titulo` (máx. 60) y `detalle` (string \| null, máx. 240). El portal los numera; no pongan «1er paso» en el título. |
| `listas` | `{ titulo, items }[]` | no | 0 a 4 | Requisitos y documentos. `titulo` (máx. 60) e `items` (string[], 1 a 15, máx. 240 cada uno). |

```json
{
  "data": [
    {
      "id": "regulares",
      "nombre": "Estudiantes regulares",
      "resumen": "Para quienes ya estudian en CATA y continúan el próximo año.",
      "listas": [
        { "titulo": "Requisitos", "items": ["No tener deuda por el servicio de enseñanza con la institución del año anterior.", "No haber sido observado reincidentemente por mala conducta.", "Haber aprobado el año académico anterior."] }
      ],
      "pasos": [
        { "titulo": "Actualización de datos", "detalle": "En la secretaría de la institución se actualizan los datos de los padres de familia o del apoderado." },
        { "titulo": "Pago de la matrícula", "detalle": "En la caja de la institución." },
        { "titulo": "Firma del contrato", "detalle": "Contrato de prestación de servicios educativos." }
      ]
    }
  ]
}
```

---

### 3.12 `GET /v1/matricula/vacantes`

Vacantes por nivel. El colegio decide si publica el número; el estado siempre se muestra con texto.

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `actualizado` | fecha \| null | sí | — | Fecha de la última actualización. Se muestra «Actualizado el…». |
| `nota` | string \| null | sí | 240 | Aclaración bajo la lista. |
| `niveles` | `VacantesNivel[]` | no | 0 a 6 | `[]` = estado vacío. |

**`VacantesNivel`**: `id`; `nivel` (máx. 40); `detalle` (string \| null, máx. 60: «3, 4 y 5 años»); `estado` (`"disponible"` \| `"pocas"` \| `"agotadas"` \| `"consultar"`); `vacantes` (integer ≥ 0 \| null).

| `estado` | Lo que muestra el portal |
|---|---|
| `disponible` | El número y «vacantes» si `vacantes` no es `null`; si no, «Vacantes disponibles». |
| `pocas` | El número y «Últimas vacantes»; sin número, «Últimas vacantes». |
| `agotadas` | «Vacantes agotadas», sin número. |
| `consultar` | «Consulta las vacantes», sin número. Úsenlo mientras no haya cifras confirmadas. |

**Solo cifras reales:** si el número no está confirmado, envíen `vacantes: null` o `estado: "consultar"`.

---

### 3.13 `GET /v1/matricula/fechas`

El cronograma del proceso.

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `nota` | string \| null | sí | 200 | Aviso sobre el cronograma, en un recuadro sobre la lista. |
| `items` | `FechaMatricula[]` | no | 0 a 12 | En orden cronológico. `[]` = «El cronograma se publicará pronto». |

**`FechaMatricula`**: `id`; `titulo` (máx. 80); `inicio` (fecha); `fin` (fecha \| null; `null` = un solo día); `detalle` (string \| null, máx. 160). El portal escribe el periodo completo («Del 2 de noviembre al 18 de diciembre de 2026») y marca «En curso» o «Terminó» según la fecha de hoy en Lima.

---

### 3.14 `GET /v1/matricula/preguntas`

Preguntas frecuentes. Devuelve `PreguntaFrecuente[]` (0 a 15): `id`, `pregunta` (máx. 140) y `respuesta` (máx. 600, texto plano sin HTML). `[]` = estado vacío que invita a escribir por WhatsApp.

---

### 3.15 `GET /v1/solicitud`

Textos del formulario «Solicitar información», que aparece al final de Matrícula y de Contacto. El título y el texto son los mismos; el mensaje de WhatsApp puede cambiar según la página. El formulario pide el nombre y el grado de interés (opciones de `GET /v1/grados`) y abre WhatsApp con el número de `GET /v1/sitio` (`whatsapp`). No envía datos a ningún servidor.

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `titulo` | string | no | 40 | «Solicitar información». |
| `texto` | string \| null | sí | 200 | Frase bajo el título. |
| `mensajeWhatsapp` | string | no | 300 | Plantilla **general** del mensaje. Se usa en las páginas que no tienen una propia. Usa `{nombre}` y `{grado}`, que el portal reemplaza. |
| `mensajesPorPagina` | `{ pagina, mensaje }[]` | no | 0 a 2 | Una plantilla por página: `pagina` es `"matricula"` o `"contacto"` y `mensaje` (máx. 300) usa `{nombre}` y `{grado}`. Como máximo una por página. `[]` = todas usan la general. |

```json
{
  "data": {
    "titulo": "Solicitar información",
    "texto": "Escribe tu nombre y el grado que te interesa. Abriremos WhatsApp con el mensaje listo para que lo envíes al colegio.",
    "mensajeWhatsapp": "Hola, soy {nombre}. Quisiera información sobre el colegio para {grado}.",
    "mensajesPorPagina": [
      { "pagina": "matricula", "mensaje": "Hola, soy {nombre}. Quisiera información sobre la matrícula para {grado}." },
      { "pagina": "contacto", "mensaje": "Hola, soy {nombre}. Tengo una consulta para el colegio sobre {grado}." }
    ]
  }
}
```

---

### 3.16 `GET /v1/contacto`

La cabecera de la página Contacto, el correo general del colegio y sus redes sociales. Las sedes salen de `GET /v1/sedes` y el WhatsApp de la placa de la cabecera, de `GET /v1/sitio`.

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `titulo` | string | no | 60 | «Contáctanos». |
| `bajada` | string \| null | sí | 160 | Una frase bajo el título. |
| `figura` | `Imagen` \| null | sí | — | Recorte de un estudiante, como en Matrícula (PNG transparente, ≈ 1:2). |
| `correo` | string \| null | sí | 80 | Correo general. Se muestra junto a las redes. |
| `redes` | `RedSocial[]` | no | 0 a 6 | En el orden en que se muestran. |

**`RedSocial`**: `red` (`"facebook"` \| `"youtube"` \| `"tiktok"` \| `"instagram"` \| `"x"` \| `"linkedin"`), `cuenta` (máx. 60: el nombre como se ve en la red) y `url` (https). El portal escribe el nombre de la red; no usa logotipos.

```json
{
  "data": {
    "titulo": "Contáctanos",
    "bajada": "Cuatro sedes en San Román. Escríbenos por WhatsApp, llámanos o visítanos.",
    "figura": { "url": "https://cata.edu.pe/wp-content/uploads/2023/01/CATA-Matricula_Img_2.png", "alt": "Estudiante con el uniforme del colegio, su mochila y un cuaderno de CATA", "ancho": 500, "alto": 1000 },
    "correo": null,
    "redes": [
      { "red": "facebook", "cuenta": "Colegio CATA", "url": "https://www.facebook.com/catajuliaca/" },
      { "red": "youtube", "cuenta": "Colegio CATA", "url": "https://www.youtube.com/@colegiocata828" },
      { "red": "tiktok", "cuenta": "@colegioadventistacata", "url": "https://www.tiktok.com/@colegioadventistacata" }
    ]
  }
}
```

---

### 3.17 `GET /v1/proyectos`

La página Proyectos: título, frase, categorías y la lista. El portal ofrece un filtro por categoría (solo con las categorías que tienen proyectos, y solo si hay dos o más) y guarda la elegida en la dirección (`/proyectos?categoria=tecnologia`).

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `titulo` | string | no | 60 | «Proyectos». |
| `bajada` | string \| null | sí | 240 | Frase bajo el título. |
| `categorias` | `{ id, nombre }[]` | no | 0 a 8 | `nombre` máx. 40. En el orden del filtro. |
| `proyectos` | `ProyectoResumen[]` | no | 0 a 24 | En el orden en que se muestran. `[]` = «Los proyectos se publicarán pronto». |

**`ProyectoResumen`**

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `id` | string | no | — | |
| `slug` | string | no | 60 | Solo `a-z`, `0-9` y `-`. Es la dirección del detalle: `/proyectos/{slug}`. No debe cambiar una vez publicado. |
| `titulo` | string | no | 80 | |
| `lema` | string \| null | sí | 100 | Frase corta: «Cocinamos con propósito: salud, sabor y servicio.» |
| `resumen` | string | no | 240 | Se muestra completo en la tarjeta. |
| `categoria` | string | no | — | `id` de una categoría de la lista. Si no existe, la respuesta es inválida. |
| `niveles` | string[] | no | 0 a 6 | Niveles o grados que participan: «Primaria». `[]` = no se indica. |
| `estado` | `"en-curso"` \| `"proximo"` \| `"finalizado"` \| null | sí | — | Se muestra «En curso», «Próximamente» o «Finalizado». |
| `fecha` | fecha \| null | sí | — | Inicio o fecha de realización. |
| `foto` | `Imagen` \| null | sí | — | Proporción 3:2, mínimo 1200 × 800. Foto real del proyecto, no una ilustración. |

### 3.18 `GET /v1/proyectos/{slug}`

El detalle de un proyecto. Devuelve un `Proyecto`: todos los campos de `ProyectoResumen` más los de esta tabla. Si el `slug` no existe, responde **`404`** con el sobre de error (§1.4); el portal muestra «Proyecto no encontrado» con un enlace a la lista.

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `categoriaNombre` | string | no | 40 | Nombre de la categoría, para no depender de la lista. |
| `descripcion` | string[] | no | 1 a 6 | Párrafos, texto plano. |
| `secciones` | `SeccionProyecto[]` | no | 0 a 8 | En orden: «Objetivos», «Ejes fundamentales», «Metodología», «Beneficios»… |
| `galeria` | `Imagen[]` | no | 0 a 12 | Fotos 3:2. `[]` = sin galería. |

**`SeccionProyecto`**: `titulo` (máx. 60), `tipo` e `items` (1 a 12). Cada ítem tiene `titulo` (string \| null, máx. 60) y `texto` (máx. 240).
- `"lista"`: viñetas. Las listas seguidas se muestran lado a lado, en placas.
- `"numerada"`: placas numeradas a todo el ancho (el portal pone los números; no los escriban en el texto). Para ejes o etapas con título.

```json
{
  "data": {
    "id": "robotica",
    "slug": "robotica",
    "titulo": "Robótica, Impresiones 3D y Computación",
    "lema": "Tecnología con propósito: creamos, servimos y transformamos.",
    "resumen": "Impulsa el desarrollo de competencias digitales en los estudiantes, promoviendo el pensamiento lógico, la resolución de problemas y la creatividad tecnológica.",
    "categoria": "tecnologia",
    "categoriaNombre": "Tecnología",
    "niveles": [],
    "estado": null,
    "fecha": null,
    "foto": null,
    "descripcion": ["Curso-taller que integra robótica, impresión 3D y computación…"],
    "secciones": [
      { "titulo": "Objetivos", "tipo": "lista", "items": [{ "titulo": null, "texto": "Construir y programar robots funcionales." }] },
      { "titulo": "Ejes fundamentales", "tipo": "numerada", "items": [{ "titulo": "Tecnología creativa", "texto": "Explora herramientas digitales para diseñar, programar y construir soluciones innovadoras." }] }
    ],
    "galeria": []
  }
}
```

---

### 3.19 `GET /v1/nosotros`

El índice de Nosotros. Las tres columnas (Institución, Gestión, Documentos) y sus subpáginas son la estructura del sitio y viven en el portal, igual que el menú; la API solo pone los textos.

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `titulo` | string | no | 60 | «Nosotros». |
| `bajada` | string \| null | sí | 200 | |
| `paginas` | `{ slug, resumen }[]` | no | 0 a 20 | Una frase (máx. 140) por subpágina, para su tarjeta. Las que no estén muestran solo su nombre. |

**Slugs de las subpáginas** (fijos, son las direcciones del sitio):
- Institución: `mision-y-vision`, `resena-historica`, `emblema`, `himno`, `consejo-directivo`, `administracion`, `personal-docente`, `organigrama`.
- Gestión: `procesos`, `planificacion-anual`, `planes-de-mejora`, `evaluacion-docente`, `acreditacion`.
- Documentos: `instrumentos-de-gestion`, `manual-de-identidad`, `planificador-eva`.

### 3.20 `GET /v1/nosotros/paginas/{slug}`

Una subpágina de Nosotros. En lugar de un formato distinto para cada una, todas son una **lista de bloques** que el portal muestra en orden, con la misma plantilla: cabecera, ruta de navegación, el menú de su grupo a un lado y «Anterior / Siguiente». Así, una página nueva solo necesita su lista de bloques. Si el `slug` no existe, responde `404`.

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `slug` | string | no | 60 | El de la dirección. |
| `titulo` | string | no | 60 | |
| `bajada` | string \| null | sí | 160 | |
| `bloques` | `Bloque[]` | no | 0 a 30 | En orden. `[]` = «El contenido de esta página se publicará pronto». |

**Tipos de bloque** (campo `tipo`). Todos los textos son planos, sin HTML.

| `tipo` | Campos | Cómo se muestra |
|---|---|---|
| `texto` | `titulo` (string \| null), `parrafos` (1 a 20), `firma` (`{ nombre, detalle }` \| null) | Párrafos a 68 caracteres de ancho; la firma, al final con una regla dorada. |
| `destacado` | `rotulo`, `texto` (máx. 200) | Placa marina con el rótulo en dorado (Misión, Visión, Lema). Los destacados seguidos van lado a lado. |
| `lista` | `titulo` (string \| null), `estilo` (`"vinetas"` \| `"tarjetas"`), `items` (1 a 20: `titulo` \| null, `texto`, `fuente` \| null) | Viñetas en una placa, o tarjetas (valores, símbolos) con la fuente de la cita al pie. |
| `hitos` | `titulo` (string \| null), `items` (1 a 20: `fecha` como texto, «1971» o «13 de mayo de 1967», y `texto`) | Línea de tiempo vertical. |
| `imagen` | `imagen` (`Imagen`), `pie` (string \| null), `transcripcion` (párrafos \| null) | Imagen completa, sin recorte. Si la imagen tiene texto (un documento, una partitura), `transcripcion` lo da como texto en «Leer la transcripción». |
| `personas` | `titulo` (string \| null), `personas` (1 a 40: `id`, `nombre`, `cargo`, `foto` \| null) | Tarjetas con foto redonda (cuadrada en origen, mínimo 400 × 400). Sin foto, las iniciales. Si el nombre ya está al lado, el `alt` de la foto puede ser `""`. **Con `titulo`, el bloque es una sección con su encabezado**: para separar áreas (Administración), envíen un bloque `personas` por área. |
| `mensaje` | `titulo` (saludo, string \| null), `parrafos`, `firma` (`{ nombre, detalle }`), `foto` (`Imagen` \| null) | Carta firmada con la foto de quien la firma. |
| `letra` | `titulo` (string \| null), `partes` (1 a 12: `titulo` y `versos`, 1 a 16) | La letra de una canción. Una parte titulada «Coro» va arriba, en una placa marina. |
| `audio` | `titulo`, `url` (https), `formato` (`"audio/mpeg"` \| `"audio/mp4"` \| `"audio/ogg"` \| `"audio/wav"`), `descripcion` (string \| null) | Reproductor del navegador con sus controles. **Nunca se reproduce solo** y no descarga nada hasta que se pulsa. Si la página tiene un bloque `letra`, enlaza a ella. |
| `organigrama` | `titulo` (string \| null), `imagen` (`Imagen` \| null), `enlace` (`Enlace` \| null), `raiz` (`{ cargo, detalle, hijos }`, hasta 5 niveles y 12 hijos por cargo) | La estructura **siempre** se muestra como lista jerárquica en texto; la imagen, si la hay, va encima. |
| `enlaces` | `titulo` (string \| null), `enlaces` (1 a 30: `etiqueta`, `url`, `descripcion` \| null, `formato`: `"pdf"` \| `"web"` \| `"hoja"` \| `"presentacion"` \| `"documento"` \| `"canva"`, `peso`: entero en bytes \| null) | Lista de documentos. Cada uno muestra, a la vista y para lectores de pantalla, su formato, su peso (si es un archivo) y que se abre en otra pestaña. `peso: null` para páginas y diseños en línea (Canva, Google Drive). |

```json
{
  "data": {
    "slug": "mision-y-vision",
    "titulo": "Misión y Visión",
    "bajada": null,
    "bloques": [
      { "tipo": "destacado", "rotulo": "Misión", "texto": "Formar ciudadanos íntegros y abnegados para esta vida y la eternidad." },
      { "tipo": "lista", "titulo": "Valores institucionales", "estilo": "tarjetas", "items": [
        { "titulo": "Integridad", "texto": "«La mayor necesidad del mundo es la de hombres que no se vendan ni se compren…»", "fuente": "La Educación, p. 57" }
      ] }
    ]
  }
}
```

**Documentos accesibles:** los PDF que se enlacen deben tener texto seleccionable (no escaneados como imagen), título y, de preferencia, etiquetas de estructura. Un PDF escaneado es una imagen para un lector de pantalla: hay que pedir el original o pasarle OCR antes de publicarlo.

### 3.21 `GET /v1/docentes`

El personal docente, para la página Personal Docente. El portal lo agrupa por nivel, con una sección por nivel y un filtro (`/nosotros/personal-docente?nivel=primaria`) que no aparece si hay un solo nivel con docentes. El texto de la página (si lo hay) llega como bloques en `GET /v1/nosotros/paginas/personal-docente`.

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `niveles` | `{ id, nombre }[]` | no | 0 a 6 | En el orden de las secciones y del filtro. `nombre` máx. 40. |
| `docentes` | `Docente[]` | no | 0 a 150 | En el orden en que se muestran dentro de su nivel. `[]` = «La lista se publicará pronto». |

**`Docente`**: `id`; `nombre` (máx. 80); `cargo` (máx. 80: cargo o área, «Tutora de 3 años», «Matemática»); `nivel` (`id` de un nivel de la lista; si no existe, la respuesta es inválida); `foto` (`Imagen` \| null, cuadrada, mínimo 400 × 400; sin foto, el portal muestra las iniciales). Publicar la foto de cada docente requiere su autorización de uso de imagen.

### 3.22 `GET /v1/logros`

La página Logros. El portal muestra arriba los logros con `destacado: true`, luego la lista completa, del más reciente al más antiguo (los que no tienen año, al final), agrupada por década (2000–2009, 2010–2019…; los que no tienen año, al final, en «Sin año»), con dos filtros que quedan en la dirección: categoría (`?categoria=artistico`) y década (`?decada=2000`). Cada filtro solo ofrece las opciones que tienen logros y no aparece si hay una sola.

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `titulo` | string | no | 60 | «Logros». |
| `bajada` | string \| null | sí | 200 | |
| `cifras` | `Cifra[]` | no | 0 a 4 | Igual que `GET /v1/portada/cifras` (§3.9). **Solo cifras reales y verificables.** `[]` = sin franja de cifras. |
| `logros` | `Logro[]` | no | 0 a 200 | `[]` = «Los logros se publicarán pronto». |

**`Logro`**

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `id` | string | no | — | |
| `titulo` | string | no | 140 | Qué se logró: «Subcampeón del XIX Concurso Nacional de Bandas Sinfónicas Escolares». |
| `categoria` | `"academico"` \| `"deportivo"` \| `"artistico"` \| `"institucional"` | no | — | |
| `anio` | integer \| null | sí | — | 1900 a 2100. `null` = sin año publicado (no se inventa). |
| `nivel` | string \| null | sí | 60 | Nivel o grupo: «Secundaria», «Banda sinfónica». |
| `descripcion` | string \| null | sí | 300 | Detalle: concurso, lugar, organizador. |
| `foto` | `Imagen` \| null | sí | — | 3:2. Si muestra estudiantes, requiere autorización de las familias. |
| `destacado` | boolean | no | — | `true` = también aparece arriba, en «Destacados». Úsenlo para los logros más importantes (nacionales, por ejemplo). |
| `fuente` | `{ etiqueta, url }` \| null | sí | 120 | De dónde sale el dato: `etiqueta` («Diario Correo, 18/07/2011») y `url` (https, o `null` si la fuente no tiene enlace público). Se muestra al pie de cada logro. |
| `aclaracion` | string \| null | sí | 60 | Aviso visible sobre un dato incompleto: «Año por confirmar». No reemplaza el dato: si el año no se conoce, `anio` es `null`. |

**Solo logros confirmados por el colegio.** El módulo debe publicar únicamente logros que el colegio haya verificado; los que vengan de otras fuentes se confirman antes (ver `docs/PENDIENTES.md`).

### 3.23 `GET /v1/propuesta-educativa/pilares`

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `introduccion` | `{ titulo, parrafos }` \| null | sí | — | Texto previo a los pilares (`titulo` máx. 60; 1 a 6 párrafos). |
| `cifras` | `Cifra[]` | no | 0 a 4 | Como §3.9; se muestran en la franja marina bajo la cabecera. **Solo cifras reales.** |
| `pilares` | `{ id, titulo, texto, puntos }[]` | no | 0 a 8 | `titulo` máx. 60, `texto` máx. 400, `puntos` (0 a 8, máx. 30 cada uno): aspectos del pilar, como «Espiritual». |

### 3.24 `GET /v1/propuesta-educativa/niveles`

Devuelve `NivelPropuesta[]` (0 a 6): `id`, `nombre` (máx. 40), `rango` (string \| null), `descripcion` (0 a 6 párrafos), `rasgos` (0 a 8 frases breves, máx. 50), `talleres` (0 a 12: `titulo` máx. 50 y `texto` string \| null, máx. 200) y `foto` (`Imagen` \| null, 3:2). El portal los muestra como los carriles de Inicio.

### 3.25 `GET /v1/propuesta-educativa/academia`

| Campo | Tipo | ¿Puede ser null? | Máx. | Descripción |
|---|---|---|---|---|
| `titulo` | string | no | 60 | «Academia preuniversitaria». |
| `descripcion` | string \| null | sí | 240 | |
| `aclaracion` | string \| null | sí | 80 | Aviso visible para toda la academia: «Precios y fechas por actualizar». |
| `universidades` | `{ id, nombre, ciclos }[]` | no | 0 a 8 | El portal ofrece un filtro por universidad (`?universidad=unsa`). `[]` = «Los ciclos se publicarán pronto». |

**`CicloAcademia`**: `id`, `nombre` (máx. 40), `turno` (string \| null), `modalidades` (`"presencial"` y/o `"virtual"`, al menos una), `precio` y `precioVirtual` (número en soles \| null), `inicio` y `fin` (fecha \| null). **Precios y fechas solo si están vigentes:** si no, `null`; el portal no muestra esos datos.

### 3.26 `GET /v1/propuesta-educativa/plataformas`

Devuelve `Plataforma[]` (0 a 8): `id`, `nombre` (máx. 40), `descripcion` (string \| null, máx. 300), `funciones` (0 a 8: `titulo` máx. 40 y `texto` máx. 200, qué ofrece a quién), `enlace` (`Enlace` \| null) y `aclaracion` (string \| null: «Descripción por confirmar»).

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
| Banners `[]` | El carrusel no aparece. Con un solo banner, no hay controles ni avance. |
| Matrícula: un solo proceso | Se muestra sin pestañas. |
| Contacto: sede sin `mapaEmbedUrl` | En el mapa, esa sede muestra «todavía no tiene un mapa» y el enlace «Cómo llegar». |
| Contacto: redes `[]` y `correo: null` | «Las redes del colegio se publicarán pronto». |
| Proyectos: una sola categoría con proyectos | No aparece el filtro. |
| Personal docente de un solo nivel | No aparece el filtro. |
| Logros: filtros sin resultados | «No hay logros con esos filtros» y un botón para verlos todos. |
| Subpágina de Nosotros sin bloques | «El contenido de esta página se publicará pronto», con el menú del grupo y «Anterior / Siguiente». |
| Proyecto inexistente (`404`) | «Proyecto no encontrado», con enlace a la lista. Cualquier otro error muestra «Reintentar». |
| Matrícula: falla `/v1/sitio` | El formulario muestra su error con «Reintentar», porque no tiene el número de WhatsApp. |

---

## 5. Esquema verificable por máquina

`docs/api-contract.schema.json` es un JSON Schema (draft-07) con la forma exacta de la respuesta de cada endpoint, generado desde las mismas validaciones que usa el portal. Sirve para validar las respuestas del módulo en sus propias pruebas, con cualquier lenguaje. Si este documento y el esquema no coinciden, avisen al equipo del portal.

## 6. Pruebas sin la API

El portal trae datos de prueba que cumplen este contrato en `PW_Frontend/src/api/mock/`. Sirven de **ejemplos completos** de cada respuesta: el módulo puede compararse con ellos.

- `tipico/`: contenido real del colegio.
- Escenarios que solo cambian algunos archivos: `corto/`, `largo/`, `sin-foto/`, `alt-vacio/` y `vacio/`. El carrusel tiene 3 banners en `tipico/`, 1 en `corto/`, 6 en `largo/` y ninguno en `vacio/`. Matrícula tiene datos en `tipico/`, `corto/`, `largo/` y `vacio/`, y su cabecera además en `sin-foto/` y `alt-vacio/`. En `tipico/`, los requisitos, documentos y pasos son los de los afiches de cata.edu.pe; el año es el de los afiches publicados (2026), las fechas son de prueba y las vacantes dicen «consultar». Contacto tiene datos en todos los escenarios. En `tipico/`, sedes y redes son las de cata.edu.pe; el colegio no publica correos ni horarios, así que van vacíos, y los mapas son búsquedas de cada dirección, que el colegio debe reemplazar por las de «Insertar un mapa». Proyectos tiene datos en los seis escenarios; los detalles se guardan como `proyecto--{slug}.json`. En `tipico/`, los dos proyectos y sus textos son los que publica cata.edu.pe (Gastronomía e Industrias Alimentarias, y Robótica, Impresiones 3D y Computación); las fotos son de prueba, y niveles, estado y fecha van vacíos porque no están publicados. Nosotros tiene datos en los seis escenarios; las subpáginas se guardan como `nosotros-pagina--{slug}.json`. En `tipico/`, las siete páginas de Institución usan los textos y fotos de cata.edu.pe, salvo el árbol del organigrama, que es de prueba y lo dice (el publicado es un diseño de Canva). El himno no tiene audio publicado; `largo/` trae un tono de prueba para el reproductor. Gestión y Documentos enlazan a los diseños de Canva y a la hoja de cálculo que publica cata.edu.pe; `largo/instrumentos-de-gestion` trae archivos de prueba con peso. El personal docente es de prueba en todos los escenarios (el colegio aún no envía la lista). En Propuesta Educativa, `tipico/` usa los textos de cata.edu.pe (los cuatro pilares, la educación adventista, los niveles, las universidades y ciclos de la academia y el iCRM); los precios y fechas de la academia, que son de 2022-2023, solo están en `largo/`, como datos de prueba. En Logros, `tipico/` trae solo los seis reconocimientos institucionales que publica cata.edu.pe; `largo/` suma los logros encontrados en otras fuentes, marcados «por verificar» con su fuente.
- Las pruebas automáticas (`npm test` en `PW_Frontend/`) validan todos esos archivos contra este contrato.
