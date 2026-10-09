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
- **Componentes compartidos por las páginas internas:** `CabeceraPagina`, `IndicePagina` y `SolicitudInformacion`.
- **Resto del mapa del sitio:** tiene sus rutas, pero muestra «en construcción».
- **Responsivo:**
  - de 360 px a 4K, verificado en 360, 390, 768, 1024, 1366, 1920, 2560 y 3840 px
  - todo se mide en rem con una raíz fluida por encima de 1920 px
  - las composiciones se agrupan en contenedores de proporción fija
- **Eliminadas:** las propuestas A, B y C y la portada antigua «Tablero de ruta».

### Contrato de la API (versión 2.2)

- `docs/API_CONTRACT.md` y su JSON Schema `docs/api-contract.schema.json` (`npm run esquema`).
- **Endpoints (16):** sitio, banners, cabecera de Propuesta Educativa, quiénes somos, niveles, sedes, noticias, grados, cifras, cinco de Matrícula (cabecera, procesos, vacantes, fechas y preguntas), solicitud y contacto.
- **Cambios de la 2.2:** nuevo `GET /v1/contacto`; `Sede` suma `correo`, `horario` y `mapaEmbedUrl`; `GET /v1/matricula/solicitud` pasa a `GET /v1/solicitud`, común a Matrícula y Contacto; se aclara que el año de Matrícula lo define el colegio.
- **Cambios de la 2.1:** solo agrega los endpoints de Matrícula (§3.10 a §3.15); no cambia ninguno anterior.
- **Cambios de la 2.0:**
  - nuevo `GET /v1/portada/banners`, que reemplaza el aviso único
  - se eliminan las rutas de la portada antigua y el aviso
  - el hero pasa a `GET /v1/propuesta-educativa/cabecera`
- **Datos de prueba:** `src/api/mock/`. El carrusel tiene 3 banners en `tipico`, 1 en `corto`, 6 en `largo` y ninguno en `vacio`. Matrícula tiene datos en `tipico`, `corto`, `largo`, `sin-foto` y `vacio` (y su cabecera en `alt-vacio`); el año en `tipico` es 2026, el de los afiches publicados. Contacto tiene datos en los seis escenarios.

### Verificación al cierre

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

1. **Construir las demás páginas, una por una:** Proyectos, Nosotros (y sus subpáginas) y Logros, más el contenido de Propuesta Educativa. Todas con el mismo nivel de diseño y animaciones que Inicio, sin carrusel. Cada página amplía el contrato de la API.
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
4. **Prueba manual con teclado y lector de pantalla** (NVDA en Windows, TalkBack en Android), sobre todo del carrusel, las pestañas de Matrícula, el mapa de Contacto y el formulario. axe no cubre todo WCAG 2.2 AA ni puede medir el contraste del texto sobre imágenes; por eso el texto del carrusel va sobre una placa marina sólida.
5. **Entregar el contrato 2.2 al equipo de RR.HH.** Enviar `docs/API_CONTRACT.md` y `docs/api-contract.schema.json`. Los endpoints de Matrícula y Contacto, y los campos nuevos de `Sede`, son una propuesta del portal: hay que acordarlos con RR.HH. antes de que los implementen. Además, acordar:
   - la URL base
   - el dominio de pruebas para CORS
   - quién avisa cuando el contrato cambie
6. **Material del colegio:**
   - confirmar si el emblema con la cinta «1971 – 2022» sigue vigente, y pedir una versión en SVG
   - el número de alumnos para las cifras
   - fotos reales de sedes, niveles y noticias
   - recortes de alumnos en mayor resolución (los actuales miden 500 × 1000 px)
   - imágenes móviles 4:5 para los banners
   - autorización de las familias para publicar fotos de estudiantes
   - el Manual de Identidad
7. **`PW_Backend/`** no tiene ningún papel en la arquitectura actual: decidir si se elimina o para qué se usa.

## Siguiente paso

Revisar Contacto y elegir la siguiente página (pendiente 1). En paralelo, el colegio puede confirmar los datos de Matrícula y Contacto (pendientes 2 y 3), entregar el contrato 2.2 a RR.HH. (pendiente 5) y reunir el material del pendiente 6.
