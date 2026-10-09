---
version: 1
slug: "pw-frontend-src-portal-paginas-inicio-tsx"
primary_target: "PW_Frontend/src/portal/paginas/Inicio.tsx"
related_targets: ["PW_Frontend/src/portal/secciones/CabeceraPropuesta.tsx","PW_Frontend/src/portal/secciones/Carrusel.tsx"]
---

# Inicio y cabecera de Propuesta Educativa

Modo: **Persuade**. Rutas `/` (Inicio) y `/propuesta-educativa` (por ahora solo su cabecera).

## Audiencia y trabajo

Familias que evalúan el colegio y comunidad actual. Inicio muestra primero lo último que publica el colegio (carrusel de banners) y luego presenta el colegio con energía; lleva a Matrícula y Propuesta Educativa y da acceso a ICRM. Sitio multipágina con el mapa de cata.edu.pe; las demás páginas se construyen una por una, con el mismo nivel de diseño y movimiento y sin carrusel. Todo el contenido llega de la API de solo lectura (docs/API_CONTRACT.md v2.0). WCAG 2.2 AA es requisito. 100 % responsivo de 360 px a 4K (ver «Escala y responsivo» en DESIGN.md).

## Direction contract

THESIS: El portal es un día de olimpiadas escolares de CATA: franjas diagonales como de camiseta, alumnos reales al frente y tipografía ancha en mayúsculas, con orgullo institucional (la medalla del emblema). Inicio abre con las novedades del colegio en un carrusel a todo el ancho, como en cata.edu.pe. Rechaza el minimalismo plano y las tarjetas iguales por nivel.

OWN-WORLD: Paleta oficial: celeste #0090CD y blanco dominan (≈30 % y 60 %), azul marino #212853 en cabecera, cifras, placas del carrusel y pie, dorado #FFBD59 solo en líneas, subrayados, ICRM y botones principales. Archivo Variable ancho (125 %) 900 en mayúsculas para títulos; botones y textos sobre imagen en placas inclinadas; franjas diagonales marino y blanco; anillo del emblema con la medalla girando dentro.

STORY: La familia ve primero lo último del colegio (matrículas, avisos, eventos), luego en segundos quién es CATA (55 años, 4 sedes, 3 niveles), recorre historia, niveles, sedes y noticias, y llega a Proceso de matrícula o a la propuesta educativa.

FIRST VIEWPORT: Inicio: cabecera marina fija con emblema, CATA, menú completo (Nosotros como mega menú) y botón ICRM dorado; debajo, el carrusel a todo el ancho con el banner más reciente, su título real en una placa marina inclinada con botón dorado y una cápsula de controles abajo al centro (flechas, indicadores con progreso, Pausar). Propuesta Educativa: cabecera celeste con titular blanco que se revela de izquierda a derecha, barras que crecen, bajada de 24 px, dos botones y la escena (dos alumnos delante del anillo del emblema, con la medalla girando centrada dentro del anillo), con franjas diagonales al fondo.

FORM: Polideportivo (propuesta A), candidato 3 de la lista propia; seed 19147af8. Integra la medalla de B (Desfile) y, de C (Muro de afiches), el titular que se revela, las barras que crecen y el anillo que gira con el scroll. Interacción firma: carrusel que avanza cada 6 s y se detiene con el mouse, el foco o el botón Pausar; en la escena, los alumnos siguen al puntero con un resorte y el anillo gira con el scroll; cada sección entra con su propia animación (cortina en títulos, cortina y asiento en fotos, tarjetas escalonadas, carriles, contadores con NumberFlow).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Decisiones abiertas

- Número de alumnos para las cifras: lo debe dar el colegio; no se inventa.
- Fotos reales de sedes, niveles y noticias (hoy son de prueba), recortes de alumnos en mayor resolución (los actuales miden 500 × 1000 px) e imágenes móviles 4:5 para los banners.
- Las fotos de estudiantes requieren autorización del colegio y de las familias.
- Emblema con cinta «1971 – 2022»: confirmar si sigue vigente.
- Movimiento: solo transform y opacity; el texto corrido nunca empieza oculto; con «reducir movimiento» se quitan desplazamientos y giros, el carrusel no avanza solo y cambia con un fundido.
