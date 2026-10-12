# Portal Web CATA

Public website for the school CATA (Colegio Adventista Túpac Amaru, Juliaca).

## Architecture

- `PW_Frontend/` — React (Vite) public site. **Public only:** no admin panel, no login, no authenticated routes.
- `PW_Backend/` — role undecided after the architecture change below; do not build an admin or CMS here.
- **Content source:** all editable content (photos, banners, section texts, news) is managed in the school's existing HR system (RR.HH.), as a new module inside that system. That system exposes a **read-only API**; the portal only reads from it.
- Design every surface assuming text and images come from that API:
  - Every image arrives as `{ url, alt }`. Render `alt` as given. An empty `alt` means decorative.
  - Text length varies. Layouts must hold short, typical and very long values without breaking or truncating meaning.
  - Content can be missing or empty. Every block needs an empty state, or must hide cleanly.

## API contract and data layer

- **Contract:** `docs/API_CONTRACT.md` (v2.13) is the source of truth for every endpoint, field, nullability, date format and image rule. `docs/api-contract.schema.json` is its JSON Schema, generated with `npm run esquema` in `PW_Frontend/`; never edit it by hand. Any change to the contract is agreed with the HR team first and updates both files, the types and the mock data together. Do not invent endpoints in the HR system.
- **Types and validation:** `PW_Frontend/src/api/tipos.ts` (TypeScript types) and `PW_Frontend/src/api/esquemas.ts` (zod schemas). A compile-time check asserts both describe the same shapes.
- **Data layer:** `PW_Frontend/src/api/servicios.ts` is the only place that fetches data. Components call its `obtener*()` functions and never know where data comes from. Every response, local or remote, is validated against the contract; an invalid response becomes that section's error state.
  - `VITE_API_URL` empty: reads the local mock data.
  - `VITE_API_URL` set: calls the real API.
- **Mock data:** `PW_Frontend/src/api/mock/<escenario>/<recurso>.json`, with full response bodies that match the contract. Scenarios: `tipico` (real school content), `corto`, `largo`, `sin-foto`, `alt-vacio`, `vacio`; `error` is simulated. Regenerate with `npm run mocks` (`scripts/generar-mocks.mjs`); `npm test` validates every file against the contract. In the browser, `?escenario=<name>` switches scenario and `?retraso=1500` shows loading states.
- **Section states:** every section loads its own endpoint through `useRecurso` and handles loading, error (with retry) and empty on its own.

## Builds

- `npm run dev`: local development; uses mock data unless `VITE_API_URL` is set.
- `npm run build`: production. **Fails if `VITE_API_URL` is not set**, so test data is never published. With the API set, the mock JSON is excluded from the bundle.
- `npm run build:demo`: deliberately builds a version with mock data, even if `VITE_API_URL` is set. It is used to present the proposal, so the «Datos de prueba» strip with the scenario selector is hidden there (add `?pruebas` to the URL to show it); «Foto de prueba» marks and «por confirmar» notices stay visible. In `npm run dev` the strip is always shown. `PW_Frontend/demo/LEEME.txt` is the readme that goes inside the demo zip.
- **Hosting (Apache, GoDaddy/cPanel):**
  - **The demo is published at https://cata.edu.pe/PW/**, so `npm run build:demo` (and `vite preview --mode demo`) uses base `/PW/` (`BASE_DEMO` in `vite.config.ts`). Development and the production build keep base `/`. **If the demo moves to the domain root or to another folder, change `BASE_DEMO`** (leading and trailing slash) and rebuild; otherwise every asset returns 404. `VITE_BASE=/otra/` overrides the base in any mode without editing the file (in Git Bash, prefix `MSYS_NO_PATHCONV=1`, or it rewrites `/otra/` into a Windows path).
  - `.htaccess` is **generated** into the build output by a plugin in `vite.config.ts`, with `RewriteBase` and the fallback `RewriteRule ^ <base>index.html` taken from the same base, so routes survive a reload. Do not add it to `public/`.
  - The router (`basename`), the favicon in `index.html` (`%BASE_URL%`), the emblem and the test media all follow `import.meta.env.BASE_URL`: never hard-code a path starting with `/` for a public file.
- `npm run pdf`: regenerates the printable A4 PDFs in `docs/pdf/` (`SOLICITUD_AL_COLEGIO.pdf`, `API_CONTRACT.pdf`) with `scripts/generar-pdf.mjs`. The PDFs are versioned: rerun it and commit them whenever either `.md` changes. It uses Playwright's Chromium (`playwright` is pinned to 1.62.1, revision 1234, which is installed on this machine); `CHROME_EXE` overrides the browser.
- **Run every npm command from `PW_Frontend/`**: the repository root has no `package.json`. Dev server: `cd "F:/CATA/Portal Web/PW_Frontend" && npm run dev -- --port 5173 --strictPort`, in the background; it is ready when `curl http://localhost:5173/` returns 200.
- When the dev server is stopped by killing its `node` process (for example `Stop-Process -Force` on the process listening on 5173), the background task reports «exit code 127». That is the kill, not a failed start: check the task log for `VITE … ready`. With `--strictPort`, a start fails only if another server is still holding port 5173; stop that one first.

## Site structure

- `PW_Frontend/src/portal/` is the site: `Layout.tsx` (fixed header, page transitions, footer, and the floating social bar `BarraRedes.tsx`, shown only from 1360 px; social links come from `redes` in `/v1/sitio`), `paginas/` (one file per page), `secciones/` (page sections), `portal.css`.
- Inicio is in the main bundle; every other page is loaded on demand with `React.lazy` in `Layout.tsx` (new pages should follow the same pattern).
- `public/mock` (test images and audio) is removed from production builds by a plugin in `vite.config.ts`; the high-resolution emblem lives in `docs/marca/`, not in `public/`.
- Inicio (`/`) starts with the **banner carousel** (`GET /v1/portada/banners`). The carousel is used **only on Inicio**; every other page starts with its own header. The poster goes **full width, flush with the header**, with no frame or band (1900:700 shows whole; other ratios crop at `puntoFocal`). From 1100 px, only discreet controls float over it, in the poster's free bottom strip (measured on the school's posters): the solid gold button in the `ladoAccion` corner, arrows at the sides, dots and pause at the bottom centre, all sized in vw so they keep the same fraction of the poster. Below 1100 px they go under the poster. `textoEnImagen: true` shows only the button; `false` adds a solid navy plate with title and date.
- Propuesta Educativa (`/propuesta-educativa`) starts with the header scene (students in front of the emblem ring, with the medal rotating inside the ring).
- Every page in the site map is built, including the body of Propuesta Educativa (pillars, levels, digital platforms and pre-university academy), with the same design and motion level as Inicio and without a carousel.
- Do not use the «PDF informativo» linked on cata.edu.pe's Propuesta Educativa page: it is an Innova Schools template, not CATA content.
- The academic platform is **Cubicol** (since 2026; iCRM was used 2020-2025). The gold header button, the mobile menu and the footer only **link** to it (`portalAcademico` in `/v1/sitio`); the portal never replicates its login form or asks for a username or password.
- Logros publishes only achievements the school has confirmed, each with its `fuente`; unknown data stays `null` (never filled in) and incomplete data carries a visible `aclaracion` («Año por confirmar»). Unconfirmed achievements stay in the `largo` mock, marked «por confirmar» (see `docs/PENDIENTES.md`). The list is grouped and filtered by decade.
- **Content vs. interface (contract 2.13):** every visible content text comes from the API, including the menu, the Nosotros groups and subpages, section titles, header buttons and labels (`GET /v1/navegacion`, read through `useMapa()` in `src/sitio/mapa.ts`), the Inicio closing (`GET /v1/portada/cierre`), the request-form labels and the header brand lines. Only routes and interface text stay in code (contract §3.27 has the full list). Never hard-code a content text; add it to the contract instead.
- `npm run build` downloads `/v1/navegacion` (a plugin in `vite.config.ts`, exposed as `virtual:navegacion-inicial`), validates it and bundles it as the initial menu; the browser fetches it again and replaces it. **The build stops if the API does not answer or the response breaks the contract.** Without `VITE_API_URL` (dev, demo, tests) it uses `src/api/mock/tipico/navegacion.json`. `NAVEGACION_URL=<api base>` (no `VITE_` prefix, so it is not bundled) downloads it from another API with the same contract, such as a local one, when the production API does not answer yet; the bundle still reads `VITE_API_URL` in the browser.
- Menu labels have variable length: they wrap to two lines when needed, and if they still do not fit, `Cabecera.tsx` switches to the hamburger menu at any width.
- Nosotros subpages use the reusable content layout `portal/contenido/PaginaContenido.tsx`, which renders the API's list of blocks (`portal/contenido/Bloques.tsx`). A subpage opens only if it is in a group of `/v1/navegacion`; any other slug shows «Página no encontrada». Personal Docente adds the staff list from `GET /v1/docentes` (`portal/contenido/EquipoDocente.tsx`). Lists with a category filter use the shared `portal/secciones/Filtro.tsx` (selection kept in the URL, hidden with a single option).

## Responsive and scale (applies to every page, present and future)

- The site must work from 360 px to 4K. Before a page is done, check it with screenshots at **360, 390, 768, 1024, 1366, 1920, 2560 and 3840** px wide, with no horizontal scroll.
- **Measure everything in rem.** The root font size is fluid (`base.css`): 100 % up to 1920 px, then it grows with the viewport up to 200 % at 3840 px, so 2K and 4K look like 1080p, only larger. Keep px only for 1 px borders, media queries and text inside an SVG with a `viewBox`.
- **Cap content width:** sections use `--ancho` (77.5rem); full-bleed compositions use `--ancho-escena` (90rem). Backgrounds may be full width; content may not.
- **Fluid type** with `clamp(rem, vw, rem)`.
- **Group compositions:** pieces that form one picture (ring, medal, students, stripes) live in one container with a fixed `aspect-ratio`, and each piece is positioned and sized in % of that container, never relative to the viewport, so they scale and move together.

## Accessibility

WCAG 2.2 AA is a requirement, not a goal. In particular:

- Contrast: 4.5:1 for text, 3:1 for large text and UI components.
- Visible focus that is never obscured.
- Target size at least 24×24 px.
- No auto-advancing content without a visible pause control (the carousel pauses on hover, focus and hidden tab, and does not auto-advance with reduced motion).
- Respect `prefers-reduced-motion`.
- Semantic landmarks and headings.
- Form errors announced and tied to their fields.

## Design

- `PRODUCT.md` holds the product context.
- `DESIGN.md` holds the design system.
- `.impeccable/surfaces/` holds the surface briefs.

## gstack

gstack skills are installed globally at `~/.claude/skills/gstack`. Use `/browse` for all web browsing.

Available skills: /office-hours, /spec, /autoplan, /plan-ceo-review, /plan-eng-review,
/plan-design-review, /plan-devex-review, /design-consultation, /design-shotgun, /design-html,
/design-review, /review, /qa, /qa-only, /test-audit, /ship, /land-and-deploy, /canary,
/benchmark, /document-release, /document-generate, /browse, /scrape, /investigate, /retro,
/cso, /codex, /learn, /make-pdf, /diagram, /careful, /freeze, /guard, /unfreeze,
/setup-deploy, /gstack-upgrade.
