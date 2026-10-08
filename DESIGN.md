---
name: Colegio Adventista Túpac Amaru (CATA)
description: Portal institucional pintado como un día de olimpiadas escolares, con la paleta oficial celeste, blanco, marino y dorado.
colors:
  celeste: "#0090cd"
  blanco: "#ffffff"
  marino: "#212853"
  dorado: "#ffbd59"
  marino-suave: "#4a5180"
  marino-lavado: "#c8cbe0"
  celeste-lavado: "#e6f4fb"
  celeste-hondo: "#0077ab"
  dorado-claro: "#ffca7a"
typography:
  display:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "clamp(1.85rem, 4.3vw, 4.25rem)"
    fontWeight: 900
    lineHeight: 0.96
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 125"
  headline-enorme:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6.4vw, 5.6rem)"
    fontWeight: 900
    lineHeight: 0.98
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3.6rem)"
    fontWeight: 900
    lineHeight: 0.98
    fontVariation: "'wdth' 125"
  headline-chico:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 3vw, 2.4rem)"
    fontWeight: 900
    lineHeight: 0.98
    fontVariation: "'wdth' 125"
  cifra:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "clamp(3.2rem, 6vw, 5.4rem)"
    fontWeight: 900
    lineHeight: 0.9
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "clamp(1.7rem, 2.8vw, 2.6rem)"
    fontWeight: 900
    lineHeight: 0.95
    fontVariation: "'wdth' 125"
  title-placa:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 850
    lineHeight: 1.15
    fontVariation: "'wdth' 112"
  label-boton:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 850
    lineHeight: 1.15
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 112"
  label-nav:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    letterSpacing: "0.03em"
    fontVariation: "'wdth' 87.5"
  bajada:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.35
    fontVariation: "'wdth' 100"
  body:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 400
    lineHeight: 1.65
    fontVariation: "'wdth' 100"
  body-meta:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.6
    fontVariation: "'wdth' 100"
rounded:
  placa-tarjeta: "2px"
  placa: "4px"
  boton: "5px"
  foto: "8px"
  medalla: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 48px)"
  ancho: "1240px"
  seccion: "clamp(72px, 10vw, 128px)"
  cabeza-seccion: "clamp(32px, 4vw, 48px)"
  rejilla: "20px"
  cabecera: "80px"
  cabecera-movil: "68px"
components:
  cabecera:
    backgroundColor: "{colors.marino}"
    textColor: "{colors.blanco}"
    height: "{spacing.cabecera}"
  boton-icrm:
    backgroundColor: "{colors.dorado}"
    textColor: "{colors.marino}"
    typography: "{typography.label-boton}"
    rounded: "{rounded.placa}"
    padding: "0 22px"
    height: "46px"
  boton-icrm-hover:
    backgroundColor: "{colors.dorado-claro}"
    textColor: "{colors.marino}"
  boton-oro:
    backgroundColor: "{colors.dorado}"
    textColor: "{colors.marino}"
    typography: "{typography.label-boton}"
    rounded: "{rounded.boton}"
    padding: "10px 28px"
    height: "56px"
  boton-oro-hover:
    backgroundColor: "{colors.dorado-claro}"
    textColor: "{colors.marino}"
  boton-blanco:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.marino}"
    typography: "{typography.label-boton}"
    rounded: "{rounded.boton}"
    padding: "10px 28px"
    height: "56px"
  boton-blanco-hover:
    backgroundColor: "{colors.celeste-lavado}"
    textColor: "{colors.marino}"
  mega-menu:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.marino}"
  menu-movil:
    backgroundColor: "{colors.marino}"
    textColor: "{colors.blanco}"
  carril-marino:
    backgroundColor: "{colors.marino}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.placa}"
    padding: "24px clamp(28px, 4vw, 56px)"
  carril-blanco:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.marino}"
    rounded: "{rounded.placa}"
    padding: "24px clamp(28px, 4vw, 56px)"
  placa-sede:
    backgroundColor: "{colors.celeste-lavado}"
    textColor: "{colors.marino}"
    rounded: "{rounded.placa-tarjeta}"
    padding: "18px 20px 20px"
  tarjeta-noticia:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.marino}"
    rounded: "{rounded.placa-tarjeta}"
    padding: "20px 22px 22px"
  noticia-placa:
    backgroundColor: "{colors.marino}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.placa-tarjeta}"
    padding: "28px 22px 22px"
  franja-cifras:
    backgroundColor: "{colors.marino}"
    textColor: "{colors.dorado}"
    typography: "{typography.cifra}"
  pie:
    backgroundColor: "{colors.marino}"
    textColor: "{colors.marino-lavado}"
---

# Design System: Colegio Adventista Túpac Amaru (CATA)

## Overview

**Creative North Star: "El Día de Olimpiadas"**

El portal se viste como un día de olimpiadas escolares de CATA: franjas diagonales como de camiseta deportiva, alumnos reales al frente, tipografía ancha en mayúsculas y orgullo institucional en forma de medalla. La energía viene de la diagonal y del contraste entre un campo celeste, placas blancas y bloques marinos; el dorado es la cinta de premiación, nunca el campo.

La página alterna fondos con ritmo de pista: cabecera marina, hero celeste, franja marina de cifras, cuerpo blanco, carriles sobre celeste, noticias sobre celeste lavado, cierre celeste y pie marino. Las piezas se inclinan (placas con `skewX`, cortes en diagonal, franjas rotadas) pero el texto siempre queda recto y legible. Cada sección entra con su propio gesto, y el movimiento se limita a transform y opacity.

La paleta es la oficial del colegio y es obligatoria. El contenido llega de una API de solo lectura, así que cada componente sostiene textos cortos, típicos y muy largos, imágenes ausentes y secciones vacías.

**Key Characteristics:**
- Celeste y blanco dominan (≈ 30 % celeste, 60 % blanco); marino en cabecera, cifras, carriles y pie; dorado solo como acento.
- Archivo Variable en dos anchos: 125 % y 900 en mayúsculas para títulos, 100 % para el texto.
- Diagonales en todas partes: placas inclinadas, franjas de camiseta, fotos con corte oblicuo.
- Reglas doradas encima de tarjetas, títulos del pie y como borde de los carriles.
- Entradas con cortinas (scaleX/scaleY), barras que crecen y contadores con NumberFlow.

## Colors

Cuatro colores oficiales y cinco derivados para estados y superficies; nada más.

### Primary
- **Celeste CATA** (celeste): el campo. Fondo del hero, de la sección de niveles y del cierre; reglas de 4 px bajo la cabecera, sobre cada cifra y bajo los títulos del mega menú. Sobre él solo va texto grande.
- **Blanco** (blanco): la superficie dominante. Fondo de las secciones de contenido, de los carriles claros, del mega menú y de las tarjetas de noticia.

### Secondary
- **Azul marino institucional** (marino): el color del texto y de los bloques de contraste. Cabecera fija, menú móvil, franja de cifras, carriles oscuros, noticias sin foto y pie completo.

### Tertiary
- **Dorado de premiación** (dorado): solo acentos. Indicador deslizante del menú, placa ICRM, botones principales, regla superior del mega menú y de las noticias, barra corta de las placas de sede y de los símbolos, borde izquierdo de los carriles, subrayado de los enlaces sueltos, cifras sobre marino, anillo de la medalla y línea del divisor.

### Neutral
- **Marino suave** (marino-suave): texto secundario sobre blanco o celeste lavado (7.6:1).
- **Marino lavado** (marino-lavado): texto secundario sobre marino (8.8:1); color base del pie.
- **Celeste lavado** (celeste-lavado): fondo de las placas de sede, de la sección de noticias, del fondo de imágenes mientras cargan y del hover del botón blanco.
- **Celeste hondo** (celeste-hondo): hover de enlaces y enlace actual del mega menú.
- **Dorado claro** (dorado-claro): hover de la placa ICRM y del botón dorado.

### Named Rules

**The 30-60 Rule.** Blanco ≈ 60 %, celeste ≈ 30 %, el resto marino y dorado. Si una pantalla se ve marina o dorada, está mal.

**The Gold Ribbon Rule.** El dorado es cinta, nunca campo: líneas, subrayados, reglas, ICRM y botones principales. Jamás un fondo de sección o de tarjeta.

**The Large-On-Celeste Rule.** Blanco sobre celeste da 3.6:1 y marino sobre celeste 4.0:1, así que sobre celeste solo va texto grande (≥ 24 px, o ≥ 18.7 px en negrita). El texto normal va en marino sobre blanco (14:1) o blanco sobre marino (14:1). Sobre dorado el texto es siempre marino (8.5:1).

## Typography

**Display Font:** Archivo Variable al 125 % de ancho (con system-ui, sans-serif)
**Body Font:** Archivo Variable al 100 % de ancho (con system-ui, sans-serif)

**Character:** Una sola familia variable que cambia de ancho según el papel: ancha, negra y en mayúsculas como un dorsal para titular; normal y tranquila para leer. Big Shoulders Display y Barlow son heredadas y solo las usa la portada antigua en `/`; ninguna superficie nueva las usa.

### Hierarchy
- **Display** (900, 125 %, clamp(1.85rem, 4.3vw, 4.25rem), 0.96, mayúsculas, `text-wrap: balance`): titular del hero, blanco sobre celeste.
- **Headline enorme** (900, 125 %, clamp(2.5rem, 6.4vw, 5.6rem), 0.98, mayúsculas): título del cierre.
- **Headline** (900, 125 %, clamp(2rem, 4.2vw, 3.6rem), 0.98, mayúsculas): título de cada sección; la variante chica (clamp(1.6rem, 3vw, 2.4rem)) para el aviso.
- **Cifra** (900, 125 %, clamp(3.2rem, 6vw, 5.4rem), 0.9, números tabulares): valores de la franja de cifras, en dorado.
- **Title** (900, 125 %, clamp(1.7rem, 2.8vw, 2.6rem), 0.95, mayúsculas): nombre de cada carril de nivel.
- **Title placa** (850, 112 %, 1.15rem a 1.35rem, mayúsculas): nombre de sede, título de noticia placa, subtítulos, títulos del pie.
- **Label botón** (850, 112 %, 1.02rem, 0.02em, mayúsculas): texto de botones e ICRM.
- **Label nav** (700, 87.5 %, 0.95rem, 0.03em, mayúsculas): enlaces del menú principal; el activo sube a 850.
- **Bajada** (500, 100 %, 1.5rem, 1.35, máx. 30ch): la bajada del hero; es texto grande para poder ir sobre celeste.
- **Body** (400, 100 %, 1.12rem, 1.65, máx. 60ch): párrafos de Quiénes somos y del aviso.
- **Body meta** (400, 0.92rem a 0.97rem): fecha y tipo de noticia, detalle de sede; en marino suave.

### Named Rules

**The Two Widths Rule.** Títulos al 125 % y 900 en mayúsculas; texto corrido al 100 %. El 112 % es solo para etiquetas en placas y botones, y el 87.5 % solo para el menú principal.

**The No Legacy Faces Rule.** Big Shoulders Display y Barlow quedan para la portada antigua en `/`. Nada nuevo las usa.

## Layout

Contenido centrado a un máximo de 1240 px más dos márgenes laterales de clamp(16px, 4vw, 48px). Cada sección tiene clamp(72px, 10vw, 128px) arriba y abajo, y 32 a 48 px entre la cabeza de sección y su contenido. Las rejillas de tarjetas son `auto-fit` con mínimos de 240 px (sedes), 280 px (noticias) y 220 px (cifras) y 20 px de separación, de modo que se reacomodan solas según la cantidad que mande la API.

El hero ocupa la altura de la ventana menos la cabecera, en dos columnas (1.18fr texto, 0.82fr figuras); sin figuras pasa a una sola columna. Quiénes somos pone una foto 4:5 fija (sticky) a la izquierda y el texto a la derecha. Los carriles son filas a lo ancho: nombre, datos y, si hay, foto.

Puntos de quiebre: 1280 px (se oculta el nombre largo en la cabecera, el pie pasa a dos columnas), 1099 px (el menú se vuelve hamburguesa), 899 px (hero, carriles, aviso y Quiénes somos a una columna; la inclinación de los carriles baja de -10° a -4°), 600 px (cabecera de 68 px, ICRM pasa al menú móvil, botones a lo ancho, pie a una columna).

**Proporciones de imagen:** foto de Quiénes somos 4:5; placa de sede 4:3; foto de noticia y de carril 3:2; foto de respaldo del hero 4:3; recortes de alumnos y aviso en su proporción natural. Sin imagen, o si no carga, el bloque de imagen desaparece sin dejar hueco.

**Estados de sección:** al cargar, un esqueleto de barras con un latido de opacidad y un texto oculto «Cargando …» con `role="status"`; si falla, el mensaje «No pudimos cargar …», una ayuda y un botón «Reintentar» con `role="alert"`, sin tumbar el resto de la página; vacío, una frase que dice cuándo llegará el contenido (y en noticias, teléfono y WhatsApp). Las secciones complementarias (cifras, aviso) se ocultan si no hay datos o fallan.

## Elevation & Depth

Sistema plano con capas de color; la profundidad viene de la superposición de placas, franjas y recortes, no de sombras. Las pocas sombras son difusas, teñidas de marino y con desplazamiento vertical negativo, y en las tarjetas viven en una capa aparte de la que solo cambia la opacidad.

### Shadow Vocabulary
- **Sombra de tarjeta** (`box-shadow: 0 22px 40px -22px rgb(33 40 83 / 0.55)`): aparece al pasar el mouse sobre una tarjeta (opacidad 0 a 1 en 220 ms).
- **Sombra del botón dorado** (`box-shadow: 0 12px 22px -12px rgb(33 40 83 / 0.6)`): en reposo, bajo la placa dorada.
- **Sombra del mega menú** (`box-shadow: 0 28px 44px -28px rgb(33 40 83 / 0.6)`): separa el panel blanco del contenido.
- **Sombra de recorte** (`filter: drop-shadow(0 20px 26px rgb(33 40 83 / 0.35))`): asienta a los alumnos recortados sobre el celeste.
- **Medalla** (`box-shadow: 0 0 0 4px #ffbd59, 0 16px 30px -12px rgb(0 0 0 / 0.45)`): aro dorado y sombra propia.

### Named Rules

**The Shadow-On-Its-Own-Layer Rule.** Las tarjetas nunca animan `box-shadow`; la sombra está en un pseudoelemento y solo cambia su opacidad.

## Shapes

Lenguaje de placas inclinadas: el fondo se inclina (`skewX(-12deg)` en botones e ICRM, `-10deg` en carriles, `-8deg` en la placa celeste tras la foto de Quiénes somos) y el texto queda recto encima. Las fotos de sede se cortan en diagonal por abajo (`clip-path: polygon(0 0, 100% 0, 100% 86%, 0 100%)`) y las de carril como paralelogramo (`polygon(10% 0, 100% 0, 90% 100%, 0 100%)`). Las franjas del hero, del cierre y del divisor van rotadas (-11°, -6°, -2.2°).

Esquinas casi rectas: 2 px en tarjetas de sede y noticia, 4 px en carriles e ICRM, 5 px en botones, 8 px en fotos y símbolos. El único círculo es la medalla (y el anillo del emblema).

## Components

### Buttons
Placas de premiación: firmes, inclinadas, con texto marino.
- **Shape:** fondo en paralelogramo (`skewX(-12deg)`, esquina de 5 px); texto recto encima.
- **Dorado (principal):** fondo dorado, texto marino 850 al 112 % en mayúsculas, alto mínimo 56 px, relleno 10 px 28 px, flecha al final. Hover: dorado claro al instante y la flecha avanza 4 px.
- **Blanco (secundario):** fondo blanco, texto marino. Hover: celeste lavado al instante.
- **Press:** escala 0.97 en 160 ms.
- **Focus:** contorno de 3 px a 6 px de distancia.
- **Reintentar:** borde de 2 px del color actual, esquina 6 px, alto 44 px; solo en estados de error.
- Por debajo de 600 px los botones ocupan todo el ancho.

### Enlaces sueltos
Texto marino 750 con subrayado dorado de 3 px a 0.35em y flecha; hover a celeste hondo y la flecha avanza 4 px. En celeste van en blanco a 1.2rem.

### Navigation
- **Cabecera:** barra marina fija de 80 px (68 px en móvil) con un filete celeste de 4 px abajo; emblema, sigla CATA (900 al 125 %), nombre del colegio en marino lavado y menú centrado en mayúsculas.
- **Indicador:** una pestaña dorada de 6 px que se desliza bajo el enlace señalado o activo con un resorte sin rebote de 220 ms.
- **ICRM:** placa dorada inclinada con texto marino y flecha diagonal; abre el portal académico en otra pestaña. Hover: dorado claro y la flecha se mueve 2 px en diagonal. Foco en blanco.
- **Mega menú (Nosotros):** panel blanco a lo ancho con regla dorada de 4 px arriba, tres columnas con título celeste grande subrayado en celeste y enlaces marinos; entra en 220 ms y sale en 140 ms; los grupos se escalonan 50 ms. Hover: el enlace pasa a celeste hondo y se corre 6 px.
- **Menú móvil:** panel marino a pantalla completa con enlaces de 56 px en 900 al 125 %, subgrupos con su título y la placa ICRM al final; el actual va en dorado.

### Héroe
Campo celeste con titular blanco enorme, tres barras inclinadas que crecen (dorada 62 %, blanca 42 %, marina 22 %), bajada de 24 px y dos botones. A la derecha, dos alumnos recortados delante del anillo del emblema (círculo marino de trazo 12 y uno blanco punteado) y la medalla abajo a la izquierda; franjas marina, blanca y marina cruzan el fondo a -11°. Si no hay recortes se usa una foto 4:3 con marco blanco de 8 px girada -3°; si no hay nada, el hero queda solo con el texto.

### Medalla
Disco marino con el emblema al 52 %, aro dorado de 4 px y el nombre del colegio (y «desde el año») girando en dorado alrededor en 40 s. Decorativa (`aria-hidden`). Gira solo mientras está en pantalla. Aparece en el hero y en el pie.

### Divisor de franjas
Franjas de camiseta entre secciones: marina de 14 px, dorada de 4 px y celeste de 8 px, rotadas -2.2°, en una banda de 64 px. Variante lavada cuando la sección siguiente es celeste lavado. Decorativo.

### Carriles de nivel
Filas de pista sobre el campo celeste: placas inclinadas que alternan marino (texto blanco) y blanco (texto marino), con borde dorado de 6 px a la izquierda. Nombre del nivel en 900 al 125 %, rango en 850 al 112 %, detalle en marino lavado o marino suave, y foto 3:2 en paralelogramo si existe.

### Placas de sede
Fondo celeste lavado, barra dorada corta (56 × 5 px) arriba a la izquierda, sobre la foto, foto 4:3 con corte diagonal abajo, nombre en mayúsculas, dirección en 600, detalle en marino suave y acciones «Cómo llegar» y teléfono como enlaces sueltos.

### Tarjetas de noticia
Fondo blanco con regla dorada de 5 px arriba, foto 3:2, título 800, meta (tipo y fecha) en marino suave con «Comunicado» destacado, resumen y enlace. Sin foto, la noticia se vuelve placa marina: título en mayúsculas al 112 %, meta y resumen en marino lavado, tipo en dorado.

### Franja de cifras
Banda marina con cada cifra sobre un filete celeste de 4 px, valor dorado en 900 al 125 % que sube con NumberFlow y etiqueta blanca. El número animado es `aria-hidden`; el valor real se lee en un texto oculto. Si no hay cifras, la banda no aparece.

### Símbolos del emblema
Recuadros blancos con borde de 2 px celeste lavado y un tramo dorado de 44 px arriba a la izquierda; nombre en mayúsculas y significado en marino suave.

### Pie
Bloque marino completo: medalla, nombre, ICRM, y columnas cuyos títulos en mayúsculas llevan una raya dorada de 36 × 3 px. Enlaces blancos con subrayado dorado al pasar el mouse; base con filete blanco al 14 %.

### Foco
Contorno de 3 px, a 3 px de distancia, esquina 4 px. Marino sobre fondos claros (blanco, celeste lavado, carriles blancos, mega menú); blanco sobre celeste y marino (cabecera, hero, niveles, cierre, carriles marinos, noticias placa, pie). El enlace «Saltar al contenido» va por encima de la cabecera fija (capa 100 frente a 50) y el desplazamiento a anclas deja libre la altura de la cabecera más 16 px.

### Motion
- Solo se animan transform y opacity. Las cortinas usan scaleX o scaleY; los cambios de color al pasar el mouse son instantáneos.
- Curvas: salida `cubic-bezier(0.23, 1, 0.32, 1)` para entradas y respuestas; recorrido `cubic-bezier(0.77, 0, 0.175, 1)` para cortinas.
- Entrada propia por sección: cortina del título de izquierda a derecha (640 ms); foto con cortina del color del fondo (800 ms) y asiento desde 1.1 (1200 ms); tarjetas y cifras escalonadas cada 60 ms; carriles desde la izquierda cada 90 ms; barras que crecen. Las tarjetas y los carriles llevan texto, así que solo se desplazan (sin opacidad): el texto corrido nunca empieza oculto.
- El texto corrido nunca empieza oculto; la bajada del hero solo se desliza.
- Contadores con NumberFlow (1100 ms, curva de salida).
- Parallax suave de 6 % en fotos grandes; en el hero, las franjas bajan 120 px, las figuras 50 px y el anillo gira 140° con el scroll.
- Los alumnos siguen al puntero con un resorte (rigidez 120, amortiguación 18), solo con mouse.
- Transición de página: 280 ms al entrar, 160 ms al salir. Mega menú: 220 ms al entrar, 140 ms al salir.
- Movimiento al pasar el mouse solo con puntero fino; solo se elevan (4 px) las tarjetas con acciones (sedes, noticias); las informativas solo ganan sombra.
- La medalla gira solo mientras está en pantalla.
- Sin JavaScript todo se ve desde el inicio: los estados ocultos dependen de una clase que la página pone antes del primer pintado.
- «Reducir movimiento» se respeta solo para quien lo activa: se quitan desplazamientos, giros, cortinas, parallax y el resorte; se mantienen los fundidos.

## Do's and Don'ts

### Do:
- **Do** mantener celeste y blanco como protagonistas (≈ 30 % y 60 %) y el marino para texto, cabecera, cifras y pie.
- **Do** usar el dorado solo como cinta: líneas, subrayados, reglas superiores, ICRM y botones principales.
- **Do** poner sobre celeste solo texto de 24 px o más, o de 18.7 px o más en negrita; todo lo demás en marino sobre blanco o blanco sobre marino.
- **Do** escribir siempre en marino sobre dorado.
- **Do** titular en Archivo Variable al 125 %, 900 y mayúsculas, y dejar el texto al 100 %.
- **Do** inclinar el fondo de las placas y dejar el texto recto.
- **Do** dar a cada bloque un estado de carga, uno de error con «Reintentar» y uno vacío, o hacerlo desaparecer limpio.
- **Do** animar solo transform y opacity, con las curvas de salida y recorrido.
- **Do** ajustar el color del foco al fondo: marino sobre claro, blanco sobre celeste y marino.

### Don't:
- **Don't** usar el dorado como fondo de una sección o de una tarjeta.
- **Don't** poner texto normal (cuerpo, metas, etiquetas pequeñas) sobre celeste.
- **Don't** usar Big Shoulders Display ni Barlow fuera de la portada antigua en `/`.
- **Don't** animar colores, tamaños, `box-shadow` ni `clip-path`; las sombras cambian solo de opacidad.
- **Don't** esconder el texto corrido antes de que entre en pantalla.
- **Don't** elevar al pasar el mouse una tarjeta que no tiene acciones.
- **Don't** dejar la medalla girando fuera de pantalla ni ningún movimiento continuo sin control.
- **Don't** activar efectos de hover en pantallas táctiles.
