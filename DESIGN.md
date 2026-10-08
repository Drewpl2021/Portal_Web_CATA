---
name: Colegio Adventista Túpac Amaru (CATA)
description: Portal institucional pintado como un tablero de ruta de las combis de Juliaca.
colors:
  azul-claro: "#00afef"
  azul-emblema: "#3e4095"
  dorado: "#f0b92b"
  blanco: "#ffffff"
  tinta: "#10184a"
  tinta-suave: "#3b4470"
  azul-claro-lavado: "#e8f5fc"
  azul-emblema-lavado: "#c9cdf2"
  rojo-emblema: "#d52b34"
  rojo-texto: "#a3161f"
typography:
  display:
    fontFamily: "Big Shoulders Display, Barlow, system-ui, sans-serif"
    fontSize: "clamp(2.9rem, 6vw, 5.25rem)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.005em"
  display-cierre:
    fontFamily: "Big Shoulders Display, Barlow, system-ui, sans-serif"
    fontSize: "clamp(2.9rem, 7.4vw, 6rem)"
    fontWeight: 900
    lineHeight: 1.1
  headline:
    fontFamily: "Big Shoulders Display, Barlow, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5.2vw, 4.5rem)"
    fontWeight: 900
    lineHeight: 0.92
  title:
    fontFamily: "Big Shoulders Display, Barlow, system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 1.9vw, 1.65rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.01em"
  body-lead:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
rounded:
  placa: "10px"
  control: "6px"
  panel: "8px"
  foco: "4px"
  parada: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 48px)"
  ancho: "1240px"
  linea: "8px"
  entre-placas: "12px"
  filete: "10px"
components:
  placa-claro:
    backgroundColor: "{colors.azul-claro}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.placa}"
  placa-emblema:
    backgroundColor: "{colors.azul-emblema}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.placa}"
  placa-aviso:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.placa}"
    padding: "clamp(26px, 3.4vw, 44px)"
  accion-dorada:
    backgroundColor: "{colors.dorado}"
    textColor: "{colors.tinta}"
    typography: "{typography.title}"
    rounded: "{rounded.control}"
    padding: "10px 20px"
    height: "52px"
  accion-dorada-hover:
    backgroundColor: "#f6c84a"
  accion-dorada-disabled:
    backgroundColor: "#f3cd70"
  acceso-contacto:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.azul-emblema}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "44px"
  acceso-contacto-hover:
    backgroundColor: "{colors.azul-emblema}"
    textColor: "{colors.blanco}"
  boton-reintentar:
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  campo:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "52px"
  panel-formulario:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.panel}"
    padding: "clamp(20px, 3vw, 32px)"
  imagen:
    backgroundColor: "{colors.azul-claro-lavado}"
    rounded: "{rounded.control}"
  parada:
    rounded: "{rounded.parada}"
    size: "26px"
  parada-terminal:
    rounded: "{rounded.parada}"
    size: "36px"
  parada-nivel:
    rounded: "{rounded.parada}"
    size: "22px"
  franja-prueba:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.blanco}"
    padding: "6px clamp(16px, 4vw, 48px)"
  pie:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.azul-emblema-lavado}"
    padding: "28px clamp(16px, 4vw, 48px)"
---

# Design System: Colegio Adventista Túpac Amaru (CATA)

## Overview

**Creative North Star: "El tablero de ruta de Juliaca"**

El portal se pinta como los letreros de las combis de Juliaca: placas esmaltadas a todo el ancho, nombres de ruta enormes en letra de rótulo condensada y una línea de recorrido gruesa con paradas circulares. Cada público tiene su línea; cada destino es una parada. Las sedes del colegio son paradas reales y los niveles (Inicial, Primaria, Secundaria) se leen como una línea con una parada por nivel.

La densidad es de letrero, no de folleto: pocas palabras, muy grandes, con la jerarquía hecha por escala. La paleta está cerrada a los tonos del emblema más blanco y la tinta derivada de ellos. El dorado es escaso a propósito: marca una sola acción.

Desde la versión 2 todo texto e imagen llega de una API de solo lectura, con largo variable y fotos que pueden faltar. El sistema lo absorbe sin cambiar de mundo: las fotos son recortes de proporción fija que desaparecen sin dejar hueco, cada sección pinta su propia carga, error y vacío con los materiales de la placa donde vive, y la letra de rótulo parte y separa palabras largas antes que desbordar. Los colores siguen siendo **provisionales**: se muestrearon del PNG oficial del emblema (`emblema-cata.png`) y quedan pendientes del Manual de Identidad; cuando llegue, sus valores reemplazan a los de `tokens.css` sin cambiar los roles. La portada se rechaza explícitamente como carrusel de fotos con «Admisión» y tarjetas por nivel.

**Key Characteristics:**
- Placas a todo el ancho, separadas por un hilo blanco de 12px, con un filete pintado interior.
- Letras de rótulo en mayúsculas (Big Shoulders Display 900/800) sobre texto Barlow.
- La línea de ruta con paradas es el único ornamento.
- Dorado solo para «Solicitar información».
- En teléfonos, todas las líneas se vuelven verticales.
- Las fotos de la API son recortes de proporción fija que, si faltan, no dejan hueco.
- Cada sección es dueña de sus estados: esqueleto, error con «Reintentar» y texto de vacío.

## Colors

Paleta cerrada a los tonos del emblema: dos azules de placa, un dorado de acción y una tinta azul muy oscura para leer; todo lo demás deriva de ellos.

### Primary
- **Azul Claro Emblema** (`azul-claro`): fondo de la placa de familias y de la placa de cierre; muestreado de las letras «COLEGIO ADVENTISTA» del emblema. También el divisor de 2px entre los símbolos del emblema, el relleno de las paradas de nivel y el fondo de la selección de texto. Provisional.
- **Azul Rey Emblema** (`azul-emblema`): fondo de la placa de la comunidad y de la placa de sedes; muestreado del anillo del emblema. Sobre blanco es el color de los títulos de rótulo, del título y el doble anillo del aviso, del nombre en la cabecera, de los accesos de contacto, de los enlaces con flecha, de la marca «Comunicado» en la línea de firma, del filete superior de 3px de la lista de noticias y de la línea de niveles. Provisional.

### Secondary
- **Dorado Laurel** (`dorado`): solo la acción «Solicitar información» y su flujo (la parada terminal dorada, el botón de cierre y el botón «Escribir por WhatsApp» del formulario). Los laureles del emblema son un degradado metálico; este valor es una muestra media provisional.

### Neutral
- **Blanco** (`blanco`): fondo de página y de la placa de aviso, letras sobre azul emblema y sobre la franja de datos de prueba, panel del formulario.
- **Tinta** (`tinta`): texto de cuerpo, letras de rótulo sobre azul claro, trazo de la línea en la placa clara, foco sobre fondos claros, pie y franja de datos de prueba.
- **Tinta Suave** (`tinta-suave`): texto secundario sobre blanco o lavado (lemas, línea de firma, resúmenes, rango y sede de cada nivel).
- **Lavado Celeste** (`azul-claro-lavado`): fondo de la franja de niveles, fondo de espera de toda imagen y esqueleto del nombre en la cabecera.
- **Lavado Lila** (`azul-emblema-lavado`): texto secundario sobre azul emblema y sobre tinta; filete fino de 1px entre noticias.
- **Rojo Emblema** (`rojo-emblema`): solo el borde de un campo inválido.
- **Rojo Texto** (`rojo-texto`): mensajes de error del formulario.

### Named Rules
**La Regla de la Tinta sobre Azul Claro.** Sobre el azul claro se escribe con tinta, nunca con blanco. Es una adaptación de accesibilidad: el blanco sobre `#00afef` da 2.5:1 y falla contraste; la tinta da 6.7:1. Sobre azul emblema se escribe en blanco (8.9:1).

**La Regla del Dorado Único.** El dorado se usa solo para «Solicitar información»: la parada terminal de la línea de familias, el botón de cierre y el botón de enviar del formulario. Ningún otro enlace, foco, estado ni ornamento es dorado; el botón «Reintentar» no lo es.

**La Regla del Foco por Fondo.** El anillo de foco (3px, separado 3px, radio 4px) es tinta sobre fondos claros (blanco, azul claro, lavados) y blanco sobre azul emblema, sobre tinta y sobre la franja de datos de prueba. Nunca dorado. Los campos del formulario lo llevan separado 1px.

**La Regla de los Colores Provisionales.** `azul-claro`, `azul-emblema` y `dorado` son muestras del emblema PNG hasta que llegue el Manual de Identidad. No se aproximan ni se inventan tonos nuevos: todo color adicional se deriva de estos, y los tonos de estado se mezclan con `currentColor` (esqueleto al 14%, hover del botón secundario al 12%) en vez de crear grises.

## Typography

**Display Font:** Big Shoulders Display (con Barlow y system-ui de respaldo)
**Body Font:** Barlow (con system-ui de respaldo)

**Character:** Letra de rótulo condensada y pesada, siempre en mayúsculas, como los nombres de ruta pintados; Barlow, de la misma familia gótica de señalética, sostiene el texto corrido sin competir.

### Hierarchy
- **Display** (900, `clamp(2.9rem, 6vw, 5.25rem)`, 0.86, mayúsculas): el nombre de ruta de cada placa.
- **Display de cierre** (900, `clamp(2.9rem, 7.4vw, 6rem)`, 1.1, mayúsculas): el título de la placa de cierre. Su interlineado es más abierto que el del display para que el signo «¿» no choque con la línea siguiente.
- **Headline** (900, `clamp(2.4rem, 5.2vw, 4.5rem)`, 0.92, mayúsculas): títulos de sección en azul emblema sobre blanco o lavado, o en blanco sobre la placa de sedes. El título del aviso usa el mismo peso a `clamp(1.8rem, 3.4vw, 2.9rem)` y 0.95.
- **Nombre de nivel** (900, `clamp(2.2rem, 3.6vw, 3.2rem)`, 0.95, mayúsculas, azul emblema): el nombre de cada nivel es el texto grande de su parada; debajo va el rango en Barlow 600 a 1.2rem.
- **Title** (800, `clamp(1.3rem, 1.9vw, 1.65rem)`, 1, mayúsculas): etiquetas de parada, botón dorado (1.4rem), nombres de sede (`clamp(1.45rem, 2vw, 1.8rem)`), títulos de noticia (`clamp(1.4rem, 2.2vw, 1.75rem)`, 1.05), título del panel, mensaje de error de sección y de lista vacía (1.6rem, 1.1).
- **Body lead** (Barlow 500, 1.125rem, 1.4): la bajada de cada placa, a 30ch como máximo.
- **Body** (Barlow 400, 1.0625rem, 1.6): texto corrido, con un máximo de 60–70ch (62ch en Quiénes somos, 70ch en noticias, 60ch en aviso y estados).
- **Label** (Barlow 600, 0.95rem): etiquetas de campo, accesos de contacto, enlaces de sede y del pie, y la línea de firma de las noticias («Comunicado · fecha», con cifras tabulares).

### Named Rules
**La Regla del Rótulo.** Big Shoulders Display solo en 900 o 800 y siempre en mayúsculas; es letra de letrero, no de párrafo. Barlow solo en 400, 500 y 600.

**La Regla de la Escala.** La jerarquía se hace por tamaño y peso. Nada de antetítulos ni etiquetas sobre los títulos: en una noticia el título va primero y la firma («Comunicado · fecha») va debajo. El color sigue al fondo (rótulo azul emblema sobre blanco, tinta sobre azul claro, blanco sobre azul emblema), no marca niveles.

**La Regla del Texto Largo.** Todo rótulo grande lleva `hyphens: auto` y `text-wrap: balance`, y la página entera `overflow-wrap: break-word`: un nombre largo de la API se parte y separa con guion, nunca desborda la placa ni se achica.

## Layout

Las placas ocupan todo el ancho de la ventana, con un margen lateral de `clamp(8px, 1.4vw, 20px)` y 12px entre una y otra, como letreros apilados. El orden es: franja de datos de prueba (solo con datos locales), cabecera, las dos placas de ruta, la placa de aviso, Quiénes somos, la franja de niveles, la placa de sedes, noticias, la placa de cierre y el pie. El contenido corrido vive en una columna de 1240px con medianil `clamp(16px, 4vw, 48px)` y respira con `clamp(72px, 10vw, 136px)` arriba. La línea de ruta reparte sus paradas en columnas iguales; la cabeza de cada placa pone el nombre a la izquierda y la bajada (30ch) alineada abajo a la derecha.

Las fotos acompañan al texto sin mandar: en Quiénes somos van a la derecha en una columna más angosta (1.3fr / 0.85fr); en noticias, a la derecha entre 180 y 280px; en el aviso, a la izquierda (1.6fr / 1fr); en sedes y niveles, debajo del nombre de cada parada. Sin foto, la columna desaparece y el texto toma el ancho.

Hasta 1080px el formulario pasa a dos columnas, el aviso a una y las sedes a una cuadrícula de 2 × 2. **En teléfonos (760px o menos) las líneas se vuelven verticales:** la línea de ruta, la línea de niveles y la línea de sedes corren hacia abajo, con el punto a la izquierda y el texto a su derecha; las fotos pasan arriba del texto en Quiénes somos y noticias; los accesos de la cabecera se reducen a íconos de 44px y la cabeza de la placa pasa a una columna.

**La Regla de la Línea Vertical.** En teléfono ninguna línea corre en horizontal ni se parte en filas: se vuelve vertical y conserva todas sus paradas en orden.

**La Regla del Espacio Sostenido.** Un estado de carga ocupa el lugar de lo que va a llegar: las placas de ruta esperan con un alto mínimo de `clamp(220px, 26vw, 300px)` y el esqueleto lleva un bloque de título y líneas de texto, para que la página no salte al cargar.

## Elevation & Depth

El sistema es plano: la profundidad la dan las placas de color, no las sombras. Solo dos piezas se levantan, con sombras suaves teñidas de tinta: el botón dorado y el panel del formulario que se despliega dentro de la placa.

### Shadow Vocabulary
- **Levante dorado** (`box-shadow: 0 8px 18px -10px rgb(16 24 74 / 0.55)`; al pasar el cursor `0 12px 22px -10px rgb(16 24 74 / 0.6)`): solo el botón «Solicitar información» y sus hermanos dorados.
- **Panel desplegado** (`box-shadow: 0 14px 30px -18px rgb(16 24 74 / 0.6)`): el panel blanco del formulario.

### Named Rules
**La Regla de la Placa Plana.** Las placas no llevan sombra. Su filete se pinta con borde o con anillos `inset`, nunca con sombra proyectada.

## Shapes

Esquinas apenas redondeadas de placa esmaltada (10px) y controles de 6px. Toda placa lleva un filete pintado:
- **Placa de ruta:** un trazo de 3px en el color de su letra, a 10px del canto, dibujado como borde de 6px de radio.
- **Placas de sedes y cierre:** el mismo trazo de 3px, como doble anillo `inset` (10px del color de fondo y 3px del color de la letra).
- **Placa de aviso:** al ser blanca sobre blanco, su doble anillo `inset` marca también el canto: 3px de azul emblema en el borde, 7px de blanco y una segunda línea de 2px de azul emblema.

El filete es parte de la placa, no un ornamento. Las paradas son círculos perfectos con aro grueso (6px) y la línea que las une mide 8px. En la línea de niveles, las paradas miden 22px con aro de 5px y la línea mide 6px.

Las imágenes llevan esquinas de 6px (10px la foto de Quiénes somos, que se lee como una placa) y se recortan con `object-fit: cover` a una proporción fija por lugar: sede 4:3, nivel 3:2, Quiénes somos 4:5 y noticia 3:2. El aviso es la excepción: su imagen se muestra entera, sin recorte, porque suele ser una pieza gráfica con texto.

**La Regla del Único Ornamento.** La línea de recorrido con paradas circulares es el único ornamento del sistema. No se agregan ilustraciones, texturas, degradados, formas de fondo ni iconos decorativos; los iconos (Lucide, en trazo) solo acompañan una acción concreta.

## Components

### Placa de ruta
Letrero a todo el ancho con nombre enorme, bajada y la línea de paradas-enlace.
- **Tonos:** clara (`azul-claro`, letra y trazo en tinta) y emblema (`azul-emblema`, letra y trazo blancos, detalle en lavado lila, foco blanco).
- **Filete:** borde de 3px en el color del trazo, a 10px del canto, radio 6px; relleno interior `clamp(22px, 3vw, 40px) clamp(18px, 4vw, 56px)`.
- **Línea:** paradas de 26px con aro de 6px y fondo del color de la placa; parada terminal de 36px rellena. Al pasar el cursor, la parada se rellena, crece al 112% y la etiqueta se subraya con 3px. Un destino externo lleva una flecha diagonal junto a la etiqueta.
- **Movimiento:** al cargar, la línea se traza una vez de izquierda a derecha (tramos de 620ms, paradas de 420ms, 150ms de escalonado, `cubic-bezier(0.16, 1, 0.3, 1)`); la placa emblema arranca 260ms después. En teléfono el trazo baja en vertical. Sin animación con `prefers-reduced-motion`.
- **Estados:** mientras carga, cada placa conserva su color y su filete y muestra el esqueleto dentro. Si la carga falla, queda solo la placa clara con el error y «Reintentar».

### Placa de aviso
Un único aviso vigente, bajo las placas de ruta. Nunca es un carrusel ni rota entre avisos.
- **Fondo:** blanco con el doble anillo pintado en azul emblema (ver Shapes), radio de 10px, relleno `clamp(26px, 3.4vw, 44px)`.
- **Contenido:** título de rótulo 900 en azul emblema, texto en tinta (60ch) y un enlace con flecha; la imagen, si la hay, va completa a la izquierda.
- **Estados:** es complementaria. Si no hay aviso vigente, si carga o si falla, la placa no aparece y la portada no deja hueco.

### Botón dorado («Solicitar información»)
- **Shape:** esquinas de 6px, alto mínimo de 52px, padding 10px 20px, sin borde.
- **Color:** fondo dorado, letra tinta en rótulo 800 a 1.4rem (1.25rem en teléfono dentro de la línea), mayúsculas, con flecha.
- **Hover / Active / Disabled:** fondo más claro y sombra un poco mayor; se hunde 1px al presionar; fondo pálido y cursor de progreso mientras está ocupado.
- **Focus:** anillo de tinta de 3px, separado 3px.
- **Comportamiento:** como parada terminal de la línea de familias, despliega el formulario dentro de la misma placa y cambia su flecha por una equis. El botón de la placa de cierre abre el mismo panel y lleva la página hasta él.

### Formulario de WhatsApp
Panel blanco con radio de 8px y la sombra de panel desplegado, dentro de la placa de familias, con título en rótulo 800. Pide solo nombre y grado, y el botón dorado «Escribir por WhatsApp» abre la conversación con el mensaje armado en otra pestaña; no envía datos a ningún servidor. Debajo, una nota en tinta suave lo explica y, después de enviar, ofrece un enlace por si la pestaña no se abrió. El formulario va en una fila (nombre, grado, botón) en escritorio, en dos columnas en tablet y en una en teléfono.

### Inputs / Fields
- **Style:** borde de tinta de 2px, radio de 6px, alto de 52px, fondo blanco; placeholder en tinta atenuada (`#5d6488`). El select lleva su propio chevrón en tinta.
- **Grado:** es un select agrupado por nivel. Mientras la lista carga, queda deshabilitado con «Cargando grados…»; si la lista falla, el campo pasa a un texto libre con un ejemplo como placeholder, para que la familia lo escriba.
- **Focus:** anillo de tinta de 3px separado 1px.
- **Error:** borde rojo emblema y mensaje en rojo texto debajo; el foco va al primer campo con error.

### Estados de sección
Cada sección carga lo suyo y maneja sus propios estados, sin tumbar al resto de la página. Los estados se pintan con el color de letra de la placa donde viven (tinta sobre azul claro y blanco, blanco sobre azul emblema).
- **Carga:** un esqueleto de barras de 18px (el título, de `clamp(40px, 6vw, 72px)`) con radio de 4px, en `currentColor` al 14%, con un latido de opacidad de 1.4s que se apaga con `prefers-reduced-motion`. El lector de pantalla oye «Cargando …».
- **Error:** un mensaje en rótulo 800 («No pudimos cargar …»), una ayuda en Barlow y el botón secundario «Reintentar».
- **Vacío:** un texto en Barlow 500 a 1.15rem que dice qué falta y cuándo llegará («se publicará pronto»). En noticias, el vacío ofrece además el teléfono y el WhatsApp.

### Botón secundario («Reintentar»)
Contorno de 2px en `currentColor`, radio de 6px, alto de 44px, Barlow 600 con un ícono de recarga; al pasar el cursor se rellena con `currentColor` al 12%. Hereda el color de la placa, así que funciona sobre blanco, azul claro y azul emblema sin variantes.

### Imagen de la API
Las imágenes llegan como `{url, alt}`. Un alt vacío marca la imagen como decorativa. El componente fija la proporción del lugar y recorta con `cover` sobre un fondo de lavado celeste (en la placa de sedes, blanco al 12%); si no hay imagen o falla la carga, el componente desaparece y no deja marco vacío. Las fotos debajo del pliegue cargan en diferido.

### Accesos de contacto (cabecera)
- **Style:** contorno de 2px en azul emblema, radio de 6px, alto de 44px, Barlow 600 con ícono.
- **Hover:** se rellena de azul emblema con letra blanca (160ms).
- **Mobile:** solo el ícono, en un cuadrado de 44px.

### Línea de niveles y línea de sedes
Las mismas paradas, aplicadas al contenido:
- **Niveles:** sobre lavado celeste, con trazo azul emblema y paradas de 22px rellenas de azul claro. Cada parada lleva el nombre del nivel como texto grande, el rango, la sede o el reconocimiento en tinta suave, y la foto debajo.
- **Sedes:** sobre la placa azul emblema, con trazo y aros blancos. Cada sede lleva el nombre, la foto, la dirección y los enlaces «Cómo llegar» y teléfono. Con más de cuatro sedes, la línea se reparte en filas de cuatro.

En teléfonos ambas líneas se vuelven verticales.

### Noticias
Una lista bajo un filete de 3px en azul emblema, con filetes de 1px en lavado lila entre noticias. Cada noticia lleva primero el título en rótulo 800 y debajo la firma en Barlow 600 a 0.95rem en tinta suave: el tipo («Comunicado» en azul emblema, «Noticia» en tinta suave), un punto medio y la fecha. Después van el resumen y un enlace con flecha. No hay antetítulo sobre el título.

### Franja de datos de prueba
Una franja de tinta en el borde superior, encima de la cabecera, visible siempre que la página lea los datos locales de prueba, para que nadie los confunda con contenido publicado. Lleva letra blanca a 0.9rem y un botón subrayado con ícono que despliega un selector de escenario y una nota en lavado lila. Foco blanco. Con la API real, no aparece.

### Navegación y pie
La cabecera es una barra fina sin menú: emblema de 64px (52px en teléfono), el nombre del colegio en rótulo 900 en azul emblema, el lema en tinta suave y los accesos de contacto. Mientras carga, el nombre se reemplaza por una barra de lavado celeste. El pie es una franja de tinta con letra en lavado lila y enlaces blancos en 600.

## Do's and Don'ts

### Do:
- **Do** escribir con tinta sobre azul claro y con blanco sobre azul emblema.
- **Do** reservar el dorado para «Solicitar información» y su flujo.
- **Do** usar foco de tinta sobre fondos claros y foco blanco sobre azul emblema o tinta (3px, separación de 3px).
- **Do** poner Big Shoulders Display en 900/800 y en mayúsculas; Barlow en 400/500/600.
- **Do** volver verticales todas las líneas en teléfonos (760px o menos).
- **Do** tomar los colores de `tokens.css` y reemplazarlos ahí cuando llegue el Manual de Identidad.
- **Do** mostrar las fotos de la API con la proporción fija de su lugar (sede 4:3, nivel 3:2, Quiénes somos 4:5, noticia 3:2; aviso completo) y retirar el componente si la foto falta o falla.
- **Do** darle a cada sección su esqueleto en `currentColor` al 14%, su error con «Reintentar» y su texto de vacío.
- **Do** poner `hyphens: auto` en todo rótulo grande y dejar el interlineado del título de cierre en 1.1.

### Don't:
- **Don't** poner letra blanca sobre azul claro (2.5:1).
- **Don't** usar dorado en enlaces, foco, divisores, estados ni en otra acción.
- **Don't** agregar ornamentos además de la línea de ruta con paradas.
- **Don't** poner antetítulos o etiquetas sobre los títulos; en noticias, la firma va debajo del título.
- **Don't** inventar tonos fuera de la paleta del emblema, ni aproximar los oficiales.
- **Don't** volver al carrusel de fotos con «Admisión» ni a las tarjetas por nivel.
- **Don't** convertir el aviso en carrusel ni mostrar más de un aviso a la vez.
- **Don't** dejar un marco vacío o un hueco cuando una foto no llega.
