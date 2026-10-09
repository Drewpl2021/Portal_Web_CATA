# Estado del portal CATA y pendientes

**Última actualización:** 2026-10-08.

## Estado actual

### Producto y arquitectura

- Portal **solo público**, sin panel ni login. El contenido se edita en un módulo nuevo del **sistema de RR.HH.**, que expone una **API de solo lectura**. Ver `CLAUDE.md` y `PRODUCT.md`.
- **Paleta oficial:** celeste `#0090CD` y blanco como protagonistas, azul marino `#212853` para textos, cabecera y pie, dorado `#FFBD59` solo para acentos.
- **WCAG 2.2 AA** es requisito.

### Diseño

- **Dirección visual «Polideportivo»** (la propuesta A), con la medalla de la B y, de la C, el titular que se revela, las barras que crecen y el anillo que gira con el scroll.
- **Sistema de diseño:** `DESIGN.md` y `.impeccable/design.json`, incluida la regla de **escala y responsivo** para todo el sitio.
- **Brief y contrato de dirección:** `.impeccable/surfaces/pw-frontend-src-portal-paginas-inicio-tsx.md`.

### Sitio (`PW_Frontend/src/portal/`)

- **Inicio (`/`):**
  - empieza con el **carrusel de novedades** (banners del colegio)
  - siguen cifras, Quiénes somos, Niveles, Sedes, Noticias y el cierre
- **Propuesta Educativa (`/propuesta-educativa`):** por ahora solo su cabecera con la escena: alumnos delante del anillo del emblema, con la medalla girando dentro.
- **Matrícula (`/matricula`):**
  - cabecera celeste con la placa del año y un estudiante, y un índice de la página
  - pasos y requisitos en pestañas (estudiantes nuevos y regulares), con los textos reales de los afiches de cata.edu.pe
  - niveles y vacantes, cronograma de fechas y preguntas frecuentes
  - el formulario **«Solicitar información»** (nombre y grado), que abre WhatsApp con el mensaje listo
- **Contacto (`/contacto`):**
  - cabecera con la placa de WhatsApp del colegio (enlace) y un estudiante, y un índice de la página
  - fichas de las cuatro sedes: dirección, teléfono, correo, horario, «Cómo llegar» y «Ver en el mapa»
  - mapa de las sedes **bajo pedido**: no se carga nada de Google hasta que la persona pulsa «Mostrar el mapa»
  - redes del colegio (Facebook, YouTube y TikTok, las que enlaza cata.edu.pe)
  - el mismo formulario «Solicitar información» de Matrícula (un solo componente, `SolicitudInformacion`)
- **Proyectos (`/proyectos` y `/proyectos/{slug}`):**
  - lista con filtro por categoría (la categoría queda en la dirección) y tarjetas con foto, etiquetas, lema y resumen
  - página de detalle de cada proyecto: descripción, objetivos, ejes, metodología, beneficios, galería y «Más proyectos»
  - un proyecto que no existe muestra «Proyecto no encontrado»
  - contenido de cata.edu.pe: solo publica dos programas, Gastronomía e Industrias Alimentarias, y Robótica, Impresiones 3D y Computación
- **Nosotros (`/nosotros`), completo:**
  - índice con las tres columnas del mega menú (Institución, Gestión, Documentos) y sus 16 subpáginas
  - **Gestión y Documentos (segunda tanda):** cada página muestra el enlace que publica cata.edu.pe (diseños de Canva y una hoja de cálculo), con su formato y el aviso de que se abre en otra pestaña
  - **Personal Docente** (nueva, en Institución tras Administración y en el mega menú): docentes por nivel con filtro en la dirección; datos de prueba
  - **Administración** organizada en cinco secciones por área
  - las siete subpáginas de Institución con los textos de cata.edu.pe: Misión y Visión, Reseña Histórica (más una línea de tiempo con sus fechas), Emblema, Himno (letra en texto, partitura y oficio de 1987 con su transcripción), Consejo Directivo (mensaje del presidente y 8 integrantes con foto), Administración (15 personas con foto) y Organigrama
  - layout reutilizable `PaginaContenido` con bloques: la segunda tanda solo necesita añadir su grupo a `GRUPOS_NOSOTROS_PUBLICADOS` (`src/sitio/mapa.ts`) y sus datos
- **Foco nunca tapado:** si un elemento enfocado con el teclado queda en parte bajo la cabecera fija, la página se desplaza para mostrarlo.
- **Componentes compartidos por las páginas internas:** `CabeceraPagina`, `IndicePagina` y `SolicitudInformacion`. El formulario recibe la página (`matricula` o `contacto`) y usa su propio mensaje de WhatsApp.
- **Foco al navegar:** al cambiar de página dentro del sitio, el foco pasa al contenido de la página nueva para que el lector de pantalla la anuncie (en la primera carga no se mueve).
- **Logros (`/logros`):** cabecera, cifras, destacados y la lista agrupada por década, con filtros por categoría y década en la dirección. Publica 24 logros, cada uno con su fuente: los reconocimientos de cata.edu.pe y los que el colegio confirmó de fuentes externas (Banda Sinfónica 1982–2025, «Colegio Excelencia», FENCYT, laboratorio, idiomas, pizarras y su trayectoria en concursos). Lo que falta confirmar está en el pendiente 2b.
- **Mapa del sitio completo:** todas las páginas del menú están construidas.
- **Responsivo:**
  - de 360 px a 4K, verificado en 360, 390, 768, 1024, 1366, 1920, 2560 y 3840 px
  - todo se mide en rem con una raíz fluida por encima de 1920 px
  - las composiciones se agrupan en contenedores de proporción fija
- **Eliminadas:** las propuestas A, B y C y la portada antigua «Tablero de ruta».

### Contrato de la API (versión 2.7)

- `docs/API_CONTRACT.md` y su JSON Schema `docs/api-contract.schema.json` (`npm run esquema`).
- **Cambios de la 2.7:** cada logro suma `fuente` y `aclaracion`; el filtro por año pasa a ser por década.
- **Cambios de la 2.6:** nuevo `GET /v1/logros`.
- **Cambios de la 2.5:** nuevo `GET /v1/docentes`; los enlaces de documentos suman `peso` y el formato `canva`; nuevo slug `personal-docente`.
- **Cambios de la 2.4:** nuevos `GET /v1/nosotros` y `GET /v1/nosotros/paginas/{slug}` (página de contenido armada con bloques; `404` si no existe).
- **Endpoints (22):** sitio, banners, cabecera de Propuesta Educativa, quiénes somos, niveles, sedes, noticias, grados, cifras, cinco de Matrícula (cabecera, procesos, vacantes, fechas y preguntas), solicitud, contacto, proyectos, detalle de proyecto, índice de Nosotros, subpágina de Nosotros, personal docente y logros.
- **Cambios de la 2.3:** nuevos `GET /v1/proyectos` y `GET /v1/proyectos/{slug}` (este responde `404` si no existe); `GET /v1/solicitud` suma `mensajesPorPagina`, una plantilla de WhatsApp por página.
- **Cambios de la 2.2:** nuevo `GET /v1/contacto`; `Sede` suma `correo`, `horario` y `mapaEmbedUrl`; `GET /v1/matricula/solicitud` pasa a `GET /v1/solicitud`, común a Matrícula y Contacto; se aclara que el año de Matrícula lo define el colegio.
- **Cambios de la 2.1:** solo agrega los endpoints de Matrícula (§3.10 a §3.15); no cambia ninguno anterior.
- **Cambios de la 2.0:**
  - nuevo `GET /v1/portada/banners`, que reemplaza el aviso único
  - se eliminan las rutas de la portada antigua y el aviso
  - el hero pasa a `GET /v1/propuesta-educativa/cabecera`
- **Datos de prueba:** `src/api/mock/`. El carrusel tiene 3 banners en `tipico`, 1 en `corto`, 6 en `largo` y ninguno en `vacio`. Matrícula tiene datos en `tipico`, `corto`, `largo`, `sin-foto` y `vacio` (y su cabecera en `alt-vacio`); el año en `tipico` es 2026, el de los afiches publicados. Contacto, Proyectos, Nosotros y Logros tienen datos en los seis escenarios.

### Verificación al cierre

**Logros con los datos confirmados (2026-10-09):** `npm test` con 185 pruebas (en `tipico`, ningún logro «por verificar» ni «por confirmar» y todos con fuente). Por pedido, solo: axe y responsivo en 390 y 1920 (típico), sin violaciones ni desplazamiento, y una pasada de teclado (ningún foco tapado; el filtro de década se usa con Enter, queda en la dirección, se combina con el de categoría y anuncia el resultado; «Todos» lo quita; los enlaces de fuente avisan que se abren en otra pestaña).

**Logros (2026-10-09):** `npm test` con 185 pruebas (incluye que `tipico/` no traiga logros «por verificar»). Al construirla: axe (WCAG 2.2 AA) sin violaciones ni desplazamiento horizontal en 390, 768, 1920 y 2560 px (típico), y en el escenario largo los dos filtros combinados, el caso sin resultados con su botón y el botón Atrás. Tras retomar la sesión, por pedido, solo: axe y responsivo en 390 y 1920 (típico), sin violaciones ni desplazamiento, y una pasada de teclado (ningún foco tapado; el filtro de año se usa con Enter, queda en la dirección, anuncia el resultado; «Todos» lo quita). No se repitió la matriz ni la regresión de las otras páginas. review-animations: sin movimiento nuevo (destacados, tarjetas y contador reutilizan las entradas ya revisadas; los filtros no se animan).

**Nosotros, segunda tanda (2026-10-08):** `npm run typecheck` pasa; `npm test` con 177 pruebas; axe (WCAG 2.2 AA) sin violaciones y sin desplazamiento horizontal en 390, 768, 1920 y 2560 px en el índice y las 16 subpáginas (escenario típico); con movimiento reducido, también Personal Docente en los escenarios corto (sin filtro), largo, sin foto y vacío, Administración sin fotos y una página vacía. Teclado: ningún foco tapado; el filtro de docentes se usa con Enter, anuncia el resultado, deja la elección en la dirección y Atrás la respeta; cada enlace a documentos anuncia formato, peso y nueva pestaña. El filtro de Proyectos sigue igual tras pasar a un componente compartido. review-animations: sin movimiento nuevo (el filtro no se anima a propósito).

**Nosotros, primera tanda (2026-10-08):** `npm run typecheck` pasa; `npm test` con 151 pruebas; axe (WCAG 2.2 AA) sin violaciones y sin desplazamiento horizontal en 390, 768, 1920 y 2560 px en el índice y las siete subpáginas de Institución (escenario típico); con movimiento reducido, también el organigrama y la administración largos, el consejo sin fotos, el himno con audio de prueba y las páginas vacías. Teclado: ningún foco tapado; la transcripción se abre con Enter; el menú lateral marca la página actual; «Siguiente» lleva a la página siguiente con el foco en su contenido; el reproductor tiene controles, no se reproduce solo y no descarga nada al cargar. Las páginas de Gestión siguen «en construcción». Además, Inicio, Propuesta Educativa, Matrícula, Contacto y Proyectos se volvieron a pasar por axe en 390 y 1920 tras los cambios del layout. review-animations: sin hallazgos (entradas al hacer scroll solo con transform, hover solo con mouse, transcripción en 200 ms).

**Proyectos (2026-10-08):** `npm run typecheck` pasa; `npm test` con 117 pruebas (incluye que cada proyecto de la lista tenga su detalle); axe (WCAG 2.2 AA) sin violaciones y sin desplazamiento horizontal en 390, 768, 1920 y 2560 px en la lista y en un detalle (escenario típico); con movimiento reducido, también los escenarios largo y vacío y el proyecto inexistente. Teclado: ningún foco tapado; el filtro se usa con Enter, anuncia el resultado y deja el foco en el botón; Enter en una tarjeta abre el detalle con el foco en el contenido; Atrás vuelve al filtro elegido. El mensaje de WhatsApp sale distinto en Matrícula y en Contacto. review-animations: sin hallazgos en el movimiento nuevo (entrada de la foto y de las etiquetas en la cabecera, elevación de tarjetas solo con mouse; el filtro no se anima a propósito).

**Contacto (2026-10-08):** `npm run typecheck` pasa; `npm test` con 89 pruebas; axe (WCAG 2.2 AA) sin violaciones y sin desplazamiento horizontal en 390, 768, 1920 y 2560 px (escenario típico), también con movimiento reducido y con el mapa cargado. Ninguna petición a Google ni a OpenStreetMap antes de pulsar «Mostrar el mapa». Teclado: orden de tabulación completo, ningún foco tapado por la cabecera, «Ver en el mapa» elige la sede y lleva el foco a su botón, el formulario compartido anuncia errores y arma el mensaje de WhatsApp. Pasada de review-animations sobre el movimiento nuevo: se corrigió la transición de las placas de redes (el desplazamiento al pasar el mouse saltaba), se quitó el fundido del mapa (si el mapa no avisa que cargó, quedaría invisible) y se acortaron dos transiciones de Matrícula que pasaban de 300 ms (cambio de pestaña y respuesta de las preguntas). Además, Matrícula se volvió a pasar por axe en 390 y 1920 tras compartir sus componentes, y Contacto con datos largos en 390 y 1920.

**Matrícula (2026-10-08):** `npm run typecheck` pasa; `npm test` con 81 pruebas; axe (WCAG 2.2 AA) sin violaciones y sin desplazamiento horizontal en 390, 768, 1920 y 2560 px (escenario típico), también con movimiento reducido y después de usar el formulario. Teclado: pestañas con flechas, Inicio y Fin; preguntas con Enter y Espacio; el formulario vacío lleva el foco al primer campo con error, vinculado con `aria-describedby`; ningún foco queda tapado por la cabecera. Por pedido, no se repitió la matriz completa de 8 anchos por 6 escenarios en esta página.

**Inicio y Propuesta Educativa (cierre anterior):**

- `npm run typecheck` pasa.
- `npm test`: 53 pruebas, que validan cada JSON de prueba contra el contrato.
- **axe (WCAG 2.2 AA):** 0 violaciones en:
  - Inicio y Propuesta Educativa, en los 8 anchos
  - los 6 escenarios de datos
  - los menús abiertos
  - movimiento reducido
- **Teclado:** mega menú y menú móvil, y ningún foco tapado por la cabecera fija.
- **Carrusel:**
  - avanza cada 6 s y se pausa con el mouse, el foco y el botón
  - funciona con las flechas del teclado
  - con movimiento reducido no avanza solo y cambia con un fundido
  - sin controles con 1 banner, y desaparece con 0
- **Builds:** `npm run build` falla sin `VITE_API_URL`; con la API y en `build:demo` compila.

## Pendientes

1. **Contenido de Propuesta Educativa:** es la única página que muestra solo su cabecera. Con el mismo nivel de diseño y animaciones, sin carrusel, y ampliando el contrato.
2b. **Logros: lo que el colegio debe confirmar.** No se publica; está en el escenario `largo`, marcado «por confirmar», listo para pasar a publicado.

   | Qué confirmar | Qué falta | De dónde salió |
   |---|---|---|
   | Años de las tres veces «Colegio Excelencia» de la UGEL Juliaca | Los tres años (el logro ya se publica con «Años por confirmar») | [Historia del Colegio Adventista Túpac Amaru (2012)](https://luisroquequispe.wordpress.com/2012/10/18/historia-del-colegio-adventista-tupac-amaru/) |
   | Año del VI Festival de Bandas Sinfónicas Escolares «Homenaje a Nuestra Amada Patria» | El año (ya se publica con «Año por confirmar») | [Facebook del colegio](https://www.facebook.com/colegiocatajuliaca/) |
   | Fuente del I Concurso Regional de Bandas Escolares (UPeU Juliaca, 2022) | Un enlace o documento público: no se encontró ninguno (ya se publica con «Fuente sin enlace público») | Información aportada al portal |
   | Certificación de Capellanía, periodo 2022-2023 | El documento oficial y la fecha exacta | Una tesis de la UPeU |
   | Clasificación de la banda a la etapa nacional | El año y el concurso | Publicación de la UGEL San Román, sin año identificable |
   | «Licenciamiento» | La resolución con número y fecha, y aclarar qué es: autorización de funcionamiento, revalidación de la UGEL o acreditación del SINEACE. El licenciamiento como tal aplica a universidades (SUNEDU), no a colegios | El colegio lo menciona; no hay fuente pública |
   | 3.er lugar, Feria Eureka 2022, etapa UGEL San Román, nivel primario (jabón líquido bactericida a partir de matico) | Confirmación del colegio y, si se quiere nombrar al estudiante (menor de edad), autorización de su familia | [UGEL San Román, 12/09/2022](https://ugelsanroman.gob.pe/inicio-la-preseleccion-de-la-feria-escolar-nacional-de-ciencia-y-tecnologia-eureka-2022-nivel-primario/) |
   | Eureka 2024, etapa regional: proyecto de «TUPAC AMARU (UGEL San Román)» con 75.00 puntos | Si es del CATA (hay otras instituciones «Túpac Amaru») y el puesto. No está en los datos de prueba | [DREP Puno](http://www.drepuno.gob.pe/web/archivos/2024/Comunicaciones/RESULTADOS%20EUREKA%202024%20ETAPA%20REGIONAL%20CATEGORIA%20D%20Y%20E.pdf) |
   | Vigencia del convenio con la UPeU | Si sigue vigente: se firmó el 16/08/2022 por tres años | [UPeU](https://upeu.edu.pe/noticias/upeu-firma-convenio-con-el-colegio-adventista-tupac-amaru-en-juliaca%EF%BF%BC/) |

   Además: la página «Institucional» de cata.edu.pe es una plantilla sin editar (dice «campeonatos ganados» con contadores en 0) y conviene retirarla. Si aparecen fotos de los concursos, publicarlas requiere la autorización de las familias.

2. **Datos reales de Matrícula** (hoy son de prueba en el escenario típico):
   - confirmar el año del proceso: en los datos de prueba es 2026, el de los afiches publicados; en la API lo define el colegio
   - el cronograma oficial (las cuatro fechas actuales son de prueba, del proceso 2026, y lo dicen en la página)
   - las vacantes por nivel, si el colegio decide publicarlas (hoy dicen «Consulta las vacantes»)
   - revisar los requisitos y pasos: vienen de los afiches de matrícula 2024 de cata.edu.pe, sin los años
   - revisar las preguntas frecuentes: sus respuestas solo usan lo que dicen esos afiches
3. **Datos reales de Contacto** (cata.edu.pe no los publica, así que en el escenario típico van vacíos):
   - correo de cada sede y correo general del colegio
   - horario de atención de cada sede
   - la URL de «Insertar un mapa» de Google Maps de cada sede (Compartir → Insertar un mapa). Los mapas actuales son búsquedas de la dirección y no son precisos: el de la Sede CATA Jerusalén cae en un punto genérico de San Miguel
   - confirmar si hay Instagram u otras redes; cata.edu.pe solo enlaza Facebook, YouTube y TikTok
   - confirmar el número del enlace «WhatsApp» del sitio actual: cata.edu.pe tiene un botón que escribe al 956 341 538, mientras que el portal usa el 986 322 833 de los afiches
4. **Contenido real de Proyectos:** cata.edu.pe publica solo dos programas, y la estructura de la página está pensada para más. El colegio debe aportar:
   - los demás proyectos institucionales que quiera mostrar, con su título, lema, resumen, descripción y secciones
   - fotos reales de cada proyecto (3:2). Las de cata.edu.pe son ilustraciones, no fotos del colegio, y no se usaron: hoy van fotos de prueba
   - los niveles que participan, el estado (en curso, próximamente, finalizado) y la fecha de cada proyecto, que hoy van vacíos
   - confirmar los nombres de las categorías del filtro («Alimentación y salud», «Tecnología»), que son una propuesta del portal
   - avisar que cata.edu.pe tiene un párrafo de relleno («Lorem fistrum…») en su página de programas
5. **Contenido de Nosotros que falta o hay que revisar:**
   - **Organigrama:** el publicado es un diseño de Canva y no se puede leer como texto. El árbol actual es de prueba, armado con los cargos de Consejo Directivo y Administración, y la página lo dice. El colegio debe enviar la estructura oficial (y, si quiere, la imagen)
   - **Himno:** no hay grabación publicada. El reproductor está listo para cuando el colegio suba el audio (MP3 u OGG)
   - **Letra del himno:** la partitura original dice «al Colegio sacrosanto» en el coro, mientras que el texto de cata.edu.pe dice «cataínos de esperanza». El portal usa el texto de la web; el colegio debe confirmar cuál es la versión vigente
   - **Reseña Histórica:** la línea de tiempo «Fechas clave» se armó con las fechas que menciona el texto; el colegio debe revisarla
   - **Correcciones mínimas a los textos:** comillas, tildes y espacios rotos («Hoy en día», «la llama encendida del Espíritu Santo», «la Biblia»), sin cambiar palabras. Las frases de las tarjetas del índice son extractos de cada página
   - **Personal Docente:** el colegio aún no envía la lista. Los 20 docentes son de prueba y la página lo dice. Hace falta, por cada docente: nombre, cargo o área, nivel y foto cuadrada (mínimo 400 × 400)
   - **Autorización de uso de imagen del personal:** antes de publicar las fotos de docentes y personal, el colegio debe tener la autorización de cada persona
   - **Administración:** las cinco áreas (Dirección; Dirección académica; Contabilidad y caja; Secretaría, operaciones y TIC; Bienestar y pastoral) son una propuesta del portal para ordenar los cargos publicados; el colegio debe confirmarlas
   - **Gestión y Documentos:** en cata.edu.pe son diseños de Canva y una hoja de Google Drive, que se abren fuera del sitio y no se pueden leer como texto. Lo ideal es que el colegio publique cada uno como PDF accesible (o como texto en la propia página) con su peso
   - **PDF accesibles:** todos los PDF que publique el colegio deben tener texto seleccionable, no estar escaneados como imagen. Si alguno está escaneado, hay que pedir la versión original o pasarle OCR antes de publicarlo
   - **Fotos de personas:** las de Consejo Directivo y Administración son las que publica cata.edu.pe; confirmar que el personal está vigente (las de Administración son de 2024)
6. **Prueba manual con teclado y lector de pantalla** (NVDA en Windows, TalkBack en Android), sobre todo del carrusel, las pestañas de Matrícula, el mapa de Contacto, el filtro de Proyectos, el himno y el organigrama de Nosotros, el formulario y el foco al cambiar de página. axe no cubre todo WCAG 2.2 AA ni puede medir el contraste del texto sobre imágenes; por eso el texto del carrusel va sobre una placa marina sólida.
7. **Entregar el contrato 2.6 al equipo de RR.HH.** Enviar `docs/API_CONTRACT.md` y `docs/api-contract.schema.json`. Los endpoints de Matrícula, Contacto, Proyectos, Nosotros (con su página de contenido por bloques), Personal Docente y Logros, los campos nuevos de `Sede` y los mensajes por página de `/v1/solicitud` son una propuesta del portal: hay que acordarlos con RR.HH. antes de que los implementen. Además, acordar:
   - la URL base
   - el dominio de pruebas para CORS
   - quién avisa cuando el contrato cambie
8. **Material del colegio:**
   - confirmar si el emblema con la cinta «1971 – 2022» sigue vigente, y pedir una versión en SVG
   - el número de alumnos para las cifras
   - fotos reales de sedes, niveles y noticias
   - recortes de alumnos en mayor resolución (los actuales miden 500 × 1000 px)
   - imágenes móviles 4:5 para los banners
   - autorización de las familias para publicar fotos de estudiantes
   - el Manual de Identidad
9. **`PW_Backend/`** no tiene ningún papel en la arquitectura actual: decidir si se elimina o para qué se usa.

## Siguiente paso

Revisar Logros y pedir al colegio que confirme los logros por verificar (pendiente 2b). Luego, el contenido de Propuesta Educativa (pendiente 1). En paralelo, el colegio puede confirmar los datos de Matrícula y Contacto (pendientes 2 y 3), aportar el contenido de Proyectos y Nosotros (pendientes 4 y 5), entregar el contrato 2.4 a RR.HH. (pendiente 7) y reunir el material del pendiente 8.
