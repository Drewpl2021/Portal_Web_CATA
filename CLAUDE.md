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

- **Contract:** `docs/API_CONTRACT.md` (v2.2) is the source of truth for every endpoint, field, nullability, date format and image rule. `docs/api-contract.schema.json` is its JSON Schema, generated with `npm run esquema` in `PW_Frontend/`; never edit it by hand. Any change to the contract is agreed with the HR team first and updates both files, the types and the mock data together. Do not invent endpoints in the HR system.
- **Types and validation:** `PW_Frontend/src/api/tipos.ts` (TypeScript types) and `PW_Frontend/src/api/esquemas.ts` (zod schemas). A compile-time check asserts both describe the same shapes.
- **Data layer:** `PW_Frontend/src/api/servicios.ts` is the only place that fetches data. Components call its `obtener*()` functions and never know where data comes from. Every response, local or remote, is validated against the contract; an invalid response becomes that section's error state.
  - `VITE_API_URL` empty: reads the local mock data.
  - `VITE_API_URL` set: calls the real API.
- **Mock data:** `PW_Frontend/src/api/mock/<escenario>/<recurso>.json`, with full response bodies that match the contract. Scenarios: `tipico` (real school content), `corto`, `largo`, `sin-foto`, `alt-vacio`, `vacio`; `error` is simulated. Regenerate with `npm run mocks` (`scripts/generar-mocks.mjs`); `npm test` validates every file against the contract. In the browser, `?escenario=<name>` switches scenario and `?retraso=1500` shows loading states.
- **Section states:** every section loads its own endpoint through `useRecurso` and handles loading, error (with retry) and empty on its own.

## Builds

- `npm run dev`: local development; uses mock data unless `VITE_API_URL` is set.
- `npm run build`: production. **Fails if `VITE_API_URL` is not set**, so test data is never published. With the API set, the mock JSON is excluded from the bundle.
- `npm run build:demo`: deliberately builds a version with mock data and the visible «Datos de prueba» strip, even if `VITE_API_URL` is set.

## Site structure

- `PW_Frontend/src/portal/` is the site: `Layout.tsx` (fixed header, page transitions, footer), `paginas/` (one file per page), `secciones/` (page sections), `portal.css`.
- Inicio (`/`) starts with the **banner carousel** (`GET /v1/portada/banners`). The carousel is used **only on Inicio**; every other page starts with its own header.
- Propuesta Educativa (`/propuesta-educativa`) starts with the header scene (students in front of the emblem ring, with the medal rotating inside the ring).
- Other pages in the site map (Proyectos, Nosotros, Matrícula, Logros, Contacto) are built one at a time, with the same design and motion level as Inicio and without a carousel.

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
