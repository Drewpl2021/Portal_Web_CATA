---
version: 1
slug: "pw-frontend-src-final-propuestafinal-tsx"
primary_target: "PW_Frontend/src/final/PropuestaFinal.tsx"
related_targets: []
---

# Inicio del sitio multipágina (propuesta final)

Modo: **Persuade**. Ruta de revisión `/propuesta-final` (reemplazará a `/` cuando se apruebe).

## Audiencia y trabajo

Familias que evalúan el colegio y comunidad actual. Inicio presenta el colegio con energía, lleva a Matrícula y Propuesta Educativa, y da acceso a ICRM. Sitio multipágina con el mapa de cata.edu.pe; las demás páginas aún no se construyen. Todo el contenido llega de la API de solo lectura (docs/API_CONTRACT.md v1.2). WCAG 2.2 AA es requisito.

## Direction contract

THESIS: Inicio es un día de olimpiadas escolares de CATA: franjas diagonales como de camiseta, alumnos reales al frente y tipografía ancha en mayúsculas, con orgullo institucional (medalla del emblema). Rechaza el carrusel de fotos con tarjetas por nivel y el minimalismo plano.

OWN-WORLD: Paleta oficial: celeste #0090CD y blanco dominan (≈30 % y 60 %), azul marino #212853 en cabecera, cifras y pie, dorado #FFBD59 solo en líneas, subrayados, ICRM y botones principales. Archivo Variable ancho (125 %) 900 en mayúsculas para títulos; botones como placas inclinadas; franjas diagonales marino y blanco; anillo del emblema y medalla giratoria.

STORY: La familia ve en segundos quién es CATA (55 años, 4 sedes, 3 niveles), siente su energía y su fe, recorre historia, niveles, sedes y noticias, y llega a Proceso de matrícula o a la propuesta educativa.

FIRST VIEWPORT: Cabecera marina fija con emblema, CATA, menú completo (Nosotros como mega menú) y botón ICRM dorado. Hero celeste: titular blanco enorme a la izquierda que se revela de izquierda a derecha, tres barras (dorado, blanco, marino) que crecen, bajada de 24 px y dos botones inclinados (dorado y blanco). A la derecha, dos alumnos recortados delante del anillo del emblema que gira con el scroll, con la medalla abajo; franjas diagonales cruzan el fondo.

FORM: Polideportivo (propuesta A), candidato 3 de la lista propia; seed 19147af8. Integra la medalla de B (Desfile) y, de C (Muro de afiches), el titular que se revela, las barras que crecen y el anillo que gira con el scroll. Interacción firma: los alumnos siguen al puntero con un resorte y la escena tiene parallax al hacer scroll; cada sección entra con su propia animación (cortina en títulos, cortina y asiento en fotos, tarjetas escalonadas, contadores con NumberFlow).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Decisiones abiertas

- Número de alumnos para las cifras: lo debe dar el colegio; no se inventa.
- Fotos reales de sedes, niveles y noticias (hoy son de prueba) y recortes de alumnos en mayor resolución (los actuales miden 500 × 1000 px).
- Las fotos de estudiantes requieren autorización del colegio y de las familias.
- Emblema con cinta «1971 – 2022»: confirmar si sigue vigente.
- Movimiento: solo transform y opacity; el texto corrido nunca empieza oculto; con «reducir movimiento» se quitan desplazamientos y giros y se mantienen los fundidos.
