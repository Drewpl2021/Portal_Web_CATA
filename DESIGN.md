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

La página alterna fondos con ritmo de pista: cabecera marina; en Inicio, el carrusel de novedades a todo el ancho y luego la franja marina de cifras, cuerpo blanco, carriles sobre celeste, noticias sobre celeste lavado, cierre celeste y pie marino; en Propuesta Educativa, una cabecera celeste con la escena de los alumnos. Las piezas se inclinan (placas con `skewX`, cortes en diagonal, franjas rotadas) pero el texto siempre queda recto y legible. Cada sección entra con su propio gesto, y el movimiento se limita a transform y opacity.

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
- **Celeste CATA** (celeste): el campo. Fondo de la cabecera de Propuesta Educativa, de la sección de niveles y del cierre; reglas de 4 px bajo la cabecera, sobre cada cifra y bajo los títulos del mega menú. Sobre él solo va texto grande.
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
- **Display** (900, 125 %, clamp(1.85rem, 3.9vw, 3.75rem), 0.96, mayúsculas, `text-wrap: balance`): titular de la cabecera de Propuesta Educativa, blanco sobre celeste.
- **Headline enorme** (900, 125 %, clamp(2.5rem, 6.4vw, 5.6rem), 0.98, mayúsculas): título del cierre.
- **Headline** (900, 125 %, clamp(2rem, 4.2vw, 3.6rem), 0.98, mayúsculas): título de cada sección. El título de cada banner del carrusel usa clamp(1.15rem, 1.9vw, 1.9rem) sobre su placa marina.
- **Cifra** (900, 125 %, clamp(3.2rem, 6vw, 5.4rem), 0.9, números tabulares): valores de la franja de cifras, en dorado.
- **Title** (900, 125 %, clamp(1.7rem, 2.8vw, 2.6rem), 0.95, mayúsculas): nombre de cada carril de nivel.
- **Title placa** (850, 112 %, 1.15rem a 1.35rem, mayúsculas): nombre de sede, título de noticia placa, subtítulos, títulos del pie.
- **Label botón** (850, 112 %, 1.02rem, 0.02em, mayúsculas): texto de botones e ICRM.
- **Label nav** (700, 87.5 %, 0.95rem, 0.03em, mayúsculas): enlaces del menú principal; el activo sube a 850.
- **Bajada** (500, 100 %, 1.5rem, 1.35, máx. 30ch): la bajada de la cabecera de Propuesta Educativa; es texto grande para poder ir sobre celeste.
- **Body** (400, 100 %, 1.12rem, 1.65, máx. 60ch): párrafos de Quiénes somos.
- **Body meta** (400, 0.92rem a 0.97rem): fecha y tipo de noticia, detalle de sede; en marino suave.

### Named Rules

**The Two Widths Rule.** Títulos al 125 % y 900 en mayúsculas; texto corrido al 100 %. El 112 % es solo para etiquetas en placas y botones, y el 87.5 % solo para el menú principal.

**The No Legacy Faces Rule.** Big Shoulders Display y Barlow quedan para la portada antigua en `/`. Nada nuevo las usa.

## Layout

Contenido centrado a un máximo de 1240 px más dos márgenes laterales de clamp(16px, 4vw, 48px). Cada sección tiene clamp(72px, 10vw, 128px) arriba y abajo, y 32 a 48 px entre la cabeza de sección y su contenido. Las rejillas de tarjetas son `auto-fit` con mínimos de 240 px (sedes), 280 px (noticias) y 220 px (cifras) y 20 px de separación, de modo que se reacomodan solas según la cantidad que mande la API.

La cabecera de Propuesta Educativa ocupa la altura de la ventana menos la cabecera fija; su interior se limita a `--ancho-escena` (90rem) en dos columnas (1.05fr texto, 0.95fr escena) y sin figuras pasa a una sola columna. El carrusel de Inicio va a todo el ancho con proporción ≈ 1900:700 en escritorio y 4:5 en móvil. Quiénes somos pone una foto 4:5 fija (sticky) a la izquierda y el texto a la derecha. Los carriles son filas a lo ancho: nombre, datos y, si hay, foto.

Puntos de quiebre: 1439 px (se oculta el nombre largo junto al logo), 1280 px (el pie pasa a dos columnas), 1099 px (el menú se vuelve hamburguesa), 899 px (cabecera con escena, carriles y Quiénes somos a una columna; la inclinación de los carriles baja de -10° a -4°), 700 px (el carrusel pasa a 4:5, usa la imagen móvil y la placa va a lo ancho), 600 px (cabecera de 68 px, ICRM pasa al menú móvil, botones a lo ancho, pie a una columna).

**Proporciones de imagen:** banner del carrusel ≈ 1900:700 en escritorio y 4:5 en móvil (recortado en su punto focal); foto de Quiénes somos 4:5; placa de sede 4:3; foto de noticia y de carril 3:2; foto de respaldo de la escena 4:3; recortes de alumnos en su proporción natural. Sin imagen, o si no carga, el bloque de imagen desaparece sin dejar hueco.

**Estados de sección:** al cargar, un esqueleto de barras con un latido de opacidad y un texto oculto «Cargando …» con `role="status"`; si falla, el mensaje «No pudimos cargar …», una ayuda y un botón «Reintentar» con `role="alert"`, sin tumbar el resto de la página; vacío, una frase que dice cuándo llegará el contenido (y en noticias, teléfono y WhatsApp). Las cifras se ocultan si no hay datos o fallan; el carrusel se oculta si no hay banners y, si falla, muestra su error con «Reintentar».

## Escala y responsivo

Regla para **todo el sitio, presente y futuro**: el portal es 100 % responsivo de 360 px a 4K y se verifica con capturas en 360, 390, 768, 1024, 1366, 1920, 2560 y 3840 px antes de dar una página por terminada.

- **Todo se mide en rem.** La raíz es fluida (`html { font-size: clamp(100%, 0.8333vw, 200%) }`): hasta 1920 px vale 16 px (o lo que la persona configure) y por encima crece con el ancho (21,3 px en 2560; 32 px en 3840). En 2K y 4K el sitio se ve igual que en 1080p, solo más grande; nada queda pequeño ni flotando. Solo quedan en px los bordes de 1 px, las media queries y el texto dentro de SVG con `viewBox`.
- **Ancho máximo de contenido.** Secciones en `--ancho` (77.5rem) y composiciones a sangre en `--ancho-escena` (90rem), centradas; el fondo puede ir a todo el ancho, el contenido no.
- **Tipografía fluida** con `clamp(mínimo en rem, valor en vw, máximo en rem)`.
- **Las composiciones se agrupan.** Lo que forma una sola imagen (anillo, medalla, alumnos, franjas de una escena) va dentro de un contenedor con proporción fija (`aspect-ratio`) y cada pieza se ubica y dimensiona en % de ese contenedor, nunca en relación con la ventana. Así escalan y se mueven juntas.
- **Sin desplazamiento horizontal** en ningún ancho; la raíz de la página usa `overflow-x: clip`.

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

Lenguaje de placas inclinadas: el fondo se inclina (`skewX(-12deg)` en botones e ICRM, `-10deg` en carriles, `-8deg` en la placa celeste tras la foto de Quiénes somos) y el texto queda recto encima. Las fotos de sede se cortan en diagonal por abajo (`clip-path: polygon(0 0, 100% 0, 100% 86%, 0 100%)`) y las de carril como paralelogramo (`polygon(10% 0, 100% 0, 90% 100%, 0 100%)`). Las franjas de la cabecera de Propuesta Educativa, del cierre y del divisor van rotadas (-11°, -6°, -2.2°).

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

### Carrusel de novedades (solo Inicio)
Primera sección de Inicio, bajo la cabecera y a todo el ancho, sobre fondo marino. Cada banner es una imagen grande (con versión móvil opcional y punto focal) y su texto real (título, categoría y fecha, botón dorado opcional) va en una placa marina inclinada con regla dorada, del lado que indique `alineacion` y alineada al ancho de contenido. El contraste no depende de la foto. Controles en una cápsula marina centrada abajo: flechas, indicadores (el activo es más ancho y una barra dorada muestra el progreso de los 6 s) y un botón visible Pausar/Reproducir. Avanza solo cada 6 s; se detiene con el mouse encima, con el foco dentro o con la pestaña oculta; funciona con las flechas del teclado y con arrastre. Las diapositivas que no se ven quedan inertes. Con un banner no hay controles; sin banners, desaparece. No se usa en ninguna otra página.

### Cabecera con escena (Propuesta Educativa)
Campo celeste con titular blanco enorme, tres barras inclinadas que crecen (dorada 62 %, blanca 42 %, marina 22 %), bajada de 24 px y dos botones. A la derecha, la **escena**: un bloque de proporción fija 6:5 (máx. 44rem) donde todo se ubica en % del bloque. El anillo del emblema (círculo marino de trazo 10 y uno blanco punteado) ocupa el 58 % del ancho arriba a la izquierda, con la medalla girando **centrada dentro del anillo**; dos alumnos recortados de pie a la derecha, delante del anillo. Así anillo, medalla y alumnos escalan y se mueven juntos en cualquier pantalla. Franjas marina, blanca y marina cruzan el fondo a -11°. Si no hay recortes se usa una foto 4:3 con marco blanco de 8 px girada -3°; si no hay nada, queda solo el texto.

### Medalla
Disco marino con el emblema al 52 %, aro dorado de 4 px y el nombre del colegio (y «desde el año») girando en dorado alrededor en 40 s. Decorativa (`aria-hidden`). Gira solo mientras está en pantalla. Aparece dentro del anillo de la cabecera de Propuesta Educativa y en el pie. Su texto vive en unidades del SVG (no en rem), porque el `viewBox` ya lo escala.

### Cabecera de página interna (Matrícula, Contacto, Proyectos)
Un solo componente (`CabeceraPagina`), variante más baja de la cabecera celeste (`f-hero--pagina`): titular, barras, bajada y dos botones que bajan a secciones de la misma página. A la derecha, una composición de proporción fija 5:4 (máx. 40rem) con `container-type: inline-size`: una placa marina inclinada con un rótulo dorado y un valor blanco (medidos en `cqw`, así escalan con la composición) y el recorte de un estudiante delante, a la derecha. En Matrícula la placa lleva «MATRÍCULA» y el año; en Contacto, «WHATSAPP» y el número, y la placa entera es un enlace a WhatsApp. Los valores de más de cinco caracteres usan un cuerpo menor. Sin recorte, la placa ocupa todo el ancho (2:1). En la lista de Proyectos la placa lleva el número de proyectos publicados («PROYECTOS 02»). En el detalle de un proyecto, en lugar de la composición va su foto 3:2 en un marco blanco de 8 px girado -3°, y bajo la bajada, los datos del proyecto en etiquetas. Sin placa, recorte ni foto, solo texto. Los botones pueden llevar a una sección de la misma página o a otra página del sitio.

### Índice de página
Franja marina bajo la cabecera, con enlaces en mayúsculas a cada sección de la página (`nav` «En esta página»). El subrayado dorado aparece al pasar el mouse.

### Pestañas de proceso
Placas inclinadas: la activa es marina con texto blanco y una regla dorada que crece debajo; las demás, celeste lavado con borde marino. Patrón de pestañas de ARIA (flechas, Inicio y Fin). Con un solo proceso no hay pestañas.

### Pista de pasos
Cada paso lleva su número en una placa marina inclinada con base dorada. Con 2 a 4 pasos y más de 900 px, van en una fila unida por una línea discontinua celeste; si no, en una cuadrícula.

### Listas de requisitos
Placas celeste lavado con la regla dorada corta arriba (como las sedes) y cada elemento con una marca de verificación dorada en un círculo marino.

### Estado de vacantes
Los niveles reusan los carriles de Inicio con una placa de estado a la derecha: dorada con texto marino, o sin relleno y con borde para «agotadas». El estado siempre se dice con texto; el número aparece solo si el colegio lo publica, con el contador de NumberFlow.

### Cronograma
Pista vertical discontinua celeste que crece hacia abajo al entrar. Cada fecha va en una placa marina inclinada (día grande, mes y año en dorado) y, al lado, el título y el periodo escrito completo, con «En curso» o «Terminó» en una etiqueta dorada.

### Preguntas frecuentes
`<details>` nativos en placas blancas sobre celeste lavado; el «+» en un cuadrado marino gira 45° al abrir y la respuesta se desliza.

### Fichas de sede (Contacto)
Placas celeste lavado en dos columnas, con la regla dorada corta arriba y el número de sede (01, 02…) en una placa marina inclinada. Los datos van en una lista de definiciones con ícono: dirección, teléfono, correo y horario; cada uno desaparece sin dejar hueco si falta. Abajo, «Cómo llegar» y «Ver en el mapa», que elige la sede en el mapa y lleva el foco a su botón.

### Mapa bajo pedido (Contacto)
Sobre el campo celeste: los botones de sede a la izquierda (placas blancas inclinadas; la elegida, marina con base dorada) y un marco blanco de proporción fija (16:10, 4:5 en móvil). Antes de pedirlo, el marco muestra una placa marina con el nombre y la dirección de la sede, el botón dorado «Mostrar el mapa» y una nota de privacidad: nada de terceros se carga hasta ese clic. Después, el mapa aparece sin transición y cambia al elegir otra sede.

### Redes sociales
Placas marinas inclinadas con base dorada: el nombre de la red en la tipografía ancha (sin logotipos de terceros), la cuenta en dorado y una flecha que se desplaza al pasar el mouse. El correo general, si lo hay, va como una placa más.

### Tarjetas de proyecto
Placas celeste lavado con la regla dorada corta arriba y la foto 3:2 con el borde inferior en diagonal. Debajo: etiquetas (categoría en dorado, estado en marino, niveles y fecha en blanco), el título en la tipografía ancha, el lema en negrita, el resumen completo y «Ver proyecto». El título es el enlace y su área cubre la tarjeta; el foco se dibuja alrededor de toda la tarjeta. Las columnas miden hasta 38rem, así una tarjeta sola no se estira a todo el ancho.

### Filtro por categoría
Botones inclinados como las pestañas de Matrícula, con el número de proyectos de cada categoría en una pastilla. Solo aparece con dos o más categorías con proyectos. La categoría elegida queda en la dirección (`?categoria=…`) y un texto vivo anuncia cuántos proyectos se ven. Cambiar de filtro no se anima: es una acción frecuente.

### Detalle de proyecto
Descripción a 65ch y, debajo, sus secciones: las listas seguidas, en placas lado a lado (como requisitos y documentos de Matrícula), y las secciones numeradas, como la pista de pasos a todo el ancho. Luego la galería sobre celeste lavado, «Más proyectos» y el cierre.

### Índice de Nosotros
Las tres columnas del mega menú como placas celeste lavado con número (01, 02, 03) y título; dentro, cada subpágina es una tarjeta blanca con su nombre, su frase y una flecha que se desplaza al pasar el mouse. Las subpáginas que aún no se construyen llevan la etiqueta «Próximamente».

### Página de contenido (layout reutilizable)
`PaginaContenido` arma toda subpágina de Nosotros: cabecera compacta con el grupo y la posición en la placa («INSTITUCIÓN 4/7»), migas en la franja marina, el contenido a la izquierda (68 caracteres para el texto) y a la derecha el menú del grupo, fijo al hacer scroll, con la página actual en marino y base dorada; al final, «Anterior» y «Siguiente» como placas blancas inclinadas sobre celeste. En móvil, el menú pasa debajo del contenido. El contenido llega como bloques (`Bloques`): texto con firma, destacados (placas marinas lado a lado), listas en placa o en tarjetas con fuente, hitos (la pista del cronograma), imágenes con transcripción desplegable, personas (foto redonda con doble aro blanco y dorado, o iniciales; con título, cada grupo es una sección con su encabezado en mayúsculas, el número de personas a la derecha y una regla celeste debajo), mensaje firmado, letra (el coro en placa marina), audio (reproductor nativo en placa marina, sin reproducción automática), organigrama (árbol en texto con líneas celestes) y enlaces a documentos (ícono, nombre, descripción y, a la vista, el formato en una etiqueta dorada, el peso y «Se abre en otra pestaña»). Personal Docente suma el filtro por nivel de Proyectos (componente `Filtro`, compartido) y una sección por nivel.

### Logros
Cabecera con el número de logros publicados en la placa, la franja marina de cifras de Inicio (componente `FranjaCifras`), «Destacados» como placas marinas inclinadas con base dorada (categoría, año y nivel en dorado, título en la tipografía ancha y foto opcional con corte inclinado) y la lista con dos filtros (`Filtro`, categoría y año) y un único texto vivo con el resultado. Cada logro es una placa celeste lavado con regla dorada: el año grande, etiquetas de categoría (dorada) y nivel, título y descripción.

### Formulario Solicitar información
En el cierre celeste: título blanco a la izquierda y el formulario en una placa marina con regla dorada. Campos blancos de 52 px, errores en dorado con ícono, vinculados con `aria-describedby`, y el foco va al primer campo con error. El botón dorado abre WhatsApp con el mensaje armado; no se guarda ningún dato. Es el mismo componente (`SolicitudInformacion`) al final de Matrícula y de Contacto; recibe la página y usa la plantilla de mensaje de esa página.

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
- El texto corrido nunca empieza oculto; la bajada de la cabecera solo se desliza y la placa de cada banner solo se asienta (transform, 450 ms).
- Contadores con NumberFlow (1100 ms, curva de salida).
- Parallax suave de 6 % en fotos grandes; en la cabecera de Propuesta Educativa, las franjas bajan 7rem, la escena 3rem y el anillo gira 140° con el scroll; los alumnos siguen al puntero con un resorte medido en % de la escena.
- Carrusel: deslizamiento de Embla al cambiar; con «reducir movimiento» no avanza solo y las diapositivas se funden en vez de deslizarse. La barra de progreso del indicador es lineal (6 s) y se pausa junto con el carrusel.
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

- **Do** medir en rem, limitar el contenido a `--ancho`/`--ancho-escena` y agrupar las composiciones en un contenedor de proporción fija con piezas en %.
- **Do** verificar cada página nueva en los ocho anchos (360 a 3840).

### Don't:
- **Don't** usar el dorado como fondo de una sección o de una tarjeta.
- **Don't** poner texto normal (cuerpo, metas, etiquetas pequeñas) sobre celeste.
- **Don't** usar Big Shoulders Display ni Barlow fuera de la portada antigua en `/`.
- **Don't** animar colores, tamaños, `box-shadow` ni `clip-path`; las sombras cambian solo de opacidad.
- **Don't** esconder el texto corrido antes de que entre en pantalla.
- **Don't** elevar al pasar el mouse una tarjeta que no tiene acciones.
- **Don't** dejar la medalla girando fuera de pantalla ni ningún movimiento continuo sin control.
- **Don't** posicionar piezas de una misma composición respecto de la ventana: en pantallas grandes se separan.
- **Don't** usar carrusel fuera de Inicio.
- **Don't** activar efectos de hover en pantallas táctiles.
