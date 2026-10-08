---
version: 1
slug: "pw-frontend-src-pages-home-tsx"
primary_target: "PW_Frontend/src/pages/Home.tsx"
related_targets: []
---


# Portada pública (cata.edu.pe)

Modo: **Persuade**. Ruta `/`.

## Audiencia y trabajo

Dos públicos con el mismo peso. Familias de Juliaca que evalúan el colegio: su acción es **Solicitar información**, que arma un mensaje (nombre y grado) y abre WhatsApp; no envía datos a ningún servidor. Comunidad actual: noticias, comunicados y portal académico (iCRM) en un toque.

**Brief v2 (2026-10-08).** Portal solo público. Todo texto e imagen llega de la API de solo lectura del sistema de RR.HH. (contrato en docs/API_CONTRACT.md); cada sección carga su endpoint y maneja carga, error con reintento y vacío. Imágenes como { url, alt }: fotos por sede, por nivel, en Quiénes somos y en noticias; sin foto no queda hueco; alt vacío = decorativa. Un único aviso vigente como placa propia bajo las rutas, nunca carrusel. Textos de largo variable probados con los escenarios corto, típico, largo, sin foto, alt vacío, vacío y error. WCAG 2.2 AA es requisito.

Prueba disponible (de cata.edu.pe): fundación 1971 desde la IASD Villa Hermosa, niveles Inicial/Primaria/Secundaria, cuatro sedes reales con dirección (Central, Inicial, Jerusalén, Oasis), SGCE, convenio UPeU, significado del emblema. Nada inventado: sin cifras, testimonios, premios ni costos.

## Direction contract

THESIS: La portada es un tablero de ruta pintado, como los letreros de las combis de Juliaca: dos líneas para dos públicos, y las sedes son paradas reales. Rechaza el carrusel de fotos con «Admisión» y tarjetas por nivel.

OWN-WORLD: Placas esmaltadas a todo el ancho en azul claro y azul emblema, letras de rótulo condensadas grandes (tinta oscura sobre azul claro, porque el blanco da 2.5:1 y falla contraste; blanco sobre azul emblema), una línea de recorrido gruesa con paradas circulares como único ornamento. Paleta cerrada a los tonos del emblema más blanco; el dorado solo en Solicitar información.

STORY: El visitante se reconoce en una de dos líneas, sigue sus paradas, entiende que CATA es un colegio adventista de Juliaca desde 1971 con cuatro sedes, y la familia nueva arma su mensaje (nombre y grado) sin salir de la portada y lo envía por WhatsApp.

FIRST VIEWPORT: Barra fina con el emblema y «Colegio Adventista Túpac Amaru». Dos placas apiladas a todo el ancho: «Familias que nos conocen» (azul claro) y «Comunidad CATA» (azul rey), cada una con su nombre de ruta enorme y la línea con paradas-enlace. La línea de familias termina en la parada dorada «Solicitar información», que despliega el formulario en la misma placa.

FORM: Letreros de ruta de combis de Juliaca; candidato 7 de la lista propia; seed 8befbc92. Raises: línea como único ornamento (coptic), paradas en orden para admisión (darkroom), paleta cerrada (gameboy), dorado solo en la acción decisiva (manga), jerarquía solo por escala (specimen). Interacción firma: la línea avanza una vez al cargar y la parada terminal abre el formulario en sitio.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Decisiones abiertas

- Colores: provisionales muestreados del emblema PNG oficial: azul claro #00afef, azul emblema #3e4095; dorado #f0b92b (los laureles son degradado metálico, muestra media #efca6a). Reemplazan los aproximados #4FB3EA/#1E4FA8/#F2C230 que se mostraron al elegir dirección. Pendiente Manual de Identidad; viven en tokens.css.
- Emblema: el archivo oficial lleva la cinta «1971 – 2022». Confirmar con el colegio si sigue siendo la marca vigente.
- Foco de teclado: tinta sobre fondos claros, blanco sobre azul emblema; el dorado queda solo para Solicitar información.
- Logo en SVG/alta resolución pendiente; se usa el PNG oficial.
- Fotos reales de sedes pendientes.
- Los textos de interfaz (etiquetas de formulario, mensajes de error y estados) viven en el código; el contenido viene de la API.
- Colores confirmados por el usuario el 2026-10-07.
