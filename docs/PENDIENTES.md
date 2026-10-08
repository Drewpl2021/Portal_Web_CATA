# Estado del portal CATA y pendientes

**Última sesión:** 2026-10-07 al 2026-10-08.

## Lo que se hizo

### Producto y arquitectura

- `PRODUCT.md` describe el producto. Lo principal:
  - Dos públicos con el mismo peso: familias que evalúan el colegio y la comunidad actual.
  - Contenido real tomado de cata.edu.pe.
  - WCAG 2.2 AA es requisito.
- **Cambio de arquitectura (2026-10-07):**
  - El portal es **solo público**: no tiene panel de administración ni login.
  - El contenido se edita en un módulo nuevo del **sistema de RR.HH.**, que expone una **API de solo lectura**.
  - Está registrado en `CLAUDE.md` y `PRODUCT.md`.
- **Colores** (confirmados por el usuario hasta recibir el Manual de Identidad): azul claro `#00afef`, azul del emblema `#3e4095` y dorado `#f0b92b`.
- **«Solicitar información»** no envía datos a ningún servidor: arma un mensaje con nombre y grado y abre WhatsApp.

### Diseño

- **Dirección visual «Tablero de ruta»:** la portada es como los letreros de ruta de las combis de Juliaca.
  - Dos placas: «Familias que nos conocen» y «Comunidad CATA».
  - Las sedes se muestran como paradas de una línea.
- **Brief y contrato de dirección:** `.impeccable/surfaces/pw-frontend-src-pages-home-tsx.md`.
- **Sistema de diseño:** `DESIGN.md` y `.impeccable/design.json`, actualizados a la versión 2.

### Contrato de la API (contrato primero)

- `docs/API_CONTRACT.md`: 8 endpoints `GET /v1/...`, cada uno con:
  - tablas de campos y la columna «¿Puede ser null?»
  - largos recomendados y ejemplos JSON
  - reglas de `alt` para WCAG
  - el comportamiento del portal en cada caso
- `docs/api-contract.schema.json`: JSON Schema que se genera desde las validaciones del portal con `npm run esquema` (en `PW_Frontend/`).

### Frontend (`PW_Frontend/`, React + Vite + TypeScript)

- **Tipos:** `src/api/tipos.ts`.
- **Validación:** `src/api/esquemas.ts`, con zod. Una comprobación en compilación garantiza que esquemas y tipos coinciden.
- **Capa única de datos:** `src/api/servicios.ts`.
  - `VITE_API_URL` vacío: lee los JSON de `src/api/mock/`.
  - `VITE_API_URL` con valor: llama a la API.
  - En los dos casos valida la respuesta contra el contrato.
- **Datos de prueba:** `src/api/mock/`, en los escenarios `tipico`, `corto`, `largo`, `sin-foto`, `alt-vacio` y `vacio`. Se regeneran con `npm run mocks`.
- **Probar escenarios en el navegador:**
  - `?escenario=<nombre>` cambia el escenario; `?escenario=error` simula una falla en todo.
  - `?retraso=1500` permite ver los estados de carga.
- **Estados por sección:** carga, error con «Reintentar» y vacío. Si una sección falla, el resto sigue funcionando.

### Verificación al cierre

- `npm run typecheck` pasa.
- `npm test` pasa las 49 pruebas, que validan cada JSON de prueba contra el contrato.
- axe (reglas WCAG 2.2 AA): 0 violaciones en 7 escenarios, en escritorio y en móvil.
- Un revisor independiente aprobó los arreglos de la última ronda.

## Pendientes

1. **El build de producción debe fallar sin `VITE_API_URL`.** Hoy solo muestra una advertencia y genera un sitio que usa los datos de prueba. Hay que cambiar `PW_Frontend/vite.config.ts` para que `vite build` termine con error si la variable está vacía, y dejar un modo explícito para builds de prueba (por ejemplo `--mode prueba`). Después, actualizar la nota de `PRODUCT.md` y la sección 4 de este archivo.
2. **El servidor de desarrollo de Vite quedó en mal estado.** Al cambiar `vite.config.ts` (a las 12:22 a. m. del 2026-10-08), su registro mostró «server restart failed». Siguió respondiendo con la configuración anterior. Se detuvo al cerrar la sesión. Al retomar:
   - Levantarlo de nuevo con `npm run dev` en `PW_Frontend/`.
   - Confirmar que arranca sin errores con la configuración actual, que usa `loadEnv` y necesita `@types/node`, ya instalado.
3. **Confirmar el emblema con el colegio.** El archivo oficial lleva la cinta «1971 – 2022». Hay que saber si sigue vigente y pedir una versión en SVG. Archivos: `PW_Frontend/public/brand/`.
4. **Prueba manual con teclado y lector de pantalla.** axe no cubre todo WCAG 2.2 AA. Falta revisar a mano:
   - El recorrido con Tab por toda la página, con foco visible y sin quedar tapado.
   - Abrir y cerrar el formulario de WhatsApp, y que el foco llegue al primer campo.
   - Que los errores del formulario se anuncien.
   - La lectura con NVDA (Windows) y TalkBack (Android) de las placas, las imágenes y los estados de carga y error.
5. **Entregar el contrato al equipo de RR.HH.** Enviar `docs/API_CONTRACT.md` y `docs/api-contract.schema.json`. Acordar con ellos:
   - la URL base
   - el dominio de pruebas para CORS
   - quién avisa cuando el contrato cambie

**Otros pendientes conocidos:**
- `PW_Backend/` no tiene ningún papel en la arquitectura actual. Hay que decidir si se elimina o para qué se usa.
- Faltan el Manual de Identidad y fotos reales de las sedes, los niveles y la portada.

## Siguiente paso

Hacer el **pendiente 1**: que el build de producción falle sin `VITE_API_URL`. Es un cambio pequeño, evita publicar datos de prueba por error, y conviene hacerlo antes de cualquier despliegue. En la misma sesión, levantar de nuevo el servidor de desarrollo (pendiente 2) y hacer la prueba manual con teclado (pendiente 4). En paralelo, el colegio puede entregar el contrato a RR.HH. (pendiente 5) y confirmar el emblema (pendiente 3).
