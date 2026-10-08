# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React (Vite) en `PW_Frontend/`: sitio **solo público**, sin panel ni login. El contenido llega de una **API de solo lectura** que expone el sistema de RR.HH. existente del colegio. El papel de `PW_Backend/` (Laravel/PHP) queda por decidir tras el cambio de arquitectura del 2026-10-07.

## Users

- **Familias interesadas (principal):** padres que evalúan matricular a sus hijos en CATA. Necesitan entender quién es el colegio, sus niveles y cómo es el proceso de admisión.
- **Familias y alumnos actuales (principal):** la comunidad escolar vigente. Necesitan noticias, comunicados, eventos y la información del colegio.
- **Personal del colegio (editores):** no son el público del sitio, pero administran el contenido del portal desde un módulo nuevo dentro del sistema de RR.HH. que el colegio ya usa.
- Exalumnos y comunidad en general quedan fuera del alcance por ahora.

## Product Purpose

El portal web institucional de CATA, colegio de educación básica regular con nivel **inicial, primario y secundario**. Presenta el colegio a las familias que lo evalúan y mantiene informada a la comunidad actual. El contenido del portal (fotos, banners, textos de secciones y noticias) debe ser **editable por el personal** desde el sistema de RR.HH., sin depender de un desarrollador.

Se considera un éxito cuando el personal publica y actualiza contenido por su cuenta y las familias encuentran rápido lo que buscan.

## Positioning

El contenido del portal lo gestiona el propio colegio desde su sistema de RR.HH., no desde el código.

## Operating Context

- Contenido en español. El colegio está en Perú (dominio `cata.edu.pe`).
- Ya existe una web, que es la fuente del contenido actual que se debe migrar o tomar como referencia.
- Las familias entran al sitio público. El personal no entra al portal: edita el contenido en el sistema de RR.HH.
- **Accesibilidad:** WCAG 2.2 AA es requisito.

## Capabilities and Constraints

- El portal es solo lectura: consume una API del sistema de RR.HH. Cada imagen llega con url y texto alternativo; los textos varían de largo y pueden faltar.
- Publicación de noticias y comunicados desde el módulo de RR.HH.
- «Solicitar información» no envía datos a ningún servidor: abre WhatsApp con un mensaje ya escrito (decidido el 2026-10-07).
- **Contrato de la API:** definido en `docs/API_CONTRACT.md` (v1.0, 2026-10-08), con su JSON Schema en `docs/api-contract.schema.json`.
- **Sin decidir:** si el módulo expondrá además menús o ajustes del sitio, la estructura del proceso de admisión, la necesidad de calendario o eventos como módulo propio, y si el sitio será bilingüe. Los roles y permisos del personal pertenecen al sistema de RR.HH.

## Brand Commitments

- **Logo oficial:** se usa tal cual. Está en `PW_Frontend/public/brand/`, descargado de cata.edu.pe. Falta confirmar si la versión con la cinta «1971 – 2022» es la vigente y conseguir un SVG.
- **Colores institucionales (paleta oficial, 2026-10-08):** celeste #0090CD y blanco #FFFFFF como protagonistas (≈ 30 % celeste, 60 % blanco); azul marino #212853 para textos, cabecera, pie y fondos de contraste; dorado #FFBD59 solo para acentos (líneas, subrayados, botón ICRM, botones principales), nunca para fondos grandes. Sobre celeste solo va texto grande o en negrita; el texto normal va en marino sobre blanco o blanco sobre marino; sobre dorado, texto marino.

## Evidence on Hand

- Web actual del colegio (cata.edu.pe): fuente del contenido real usado como datos iniciales.
- El repositorio todavía no tiene fotos, textos, testimonios, cifras ni logros. No se deben inventar testimonios, cifras de alumnos, resultados, premios ni costos de pensión.

## Product Principles

1. **El colegio es dueño de su portal:** cualquier contenido visible debe poder editarlo personal no técnico desde el sistema de RR.HH.
2. **Dos públicos, caminos claros:** quien evalúa matricular a sus hijos y quien ya es parte del colegio buscan cosas distintas, y el portal no debe obligar a ninguno a pasar por lo del otro.
3. **Contenido real, no relleno:** solo se muestran información, imágenes y datos verdaderos del colegio.
4. **Fiel a la identidad institucional:** se respetan el logo y los colores oficiales.
