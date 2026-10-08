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
  - Keep a local seed (`PW_Frontend/src/data/`) shaped like the API response, used as a fallback while the API is unavailable.
- The API contract is not defined yet. When it is, the frontend adapts to it; do not invent endpoints in the HR system.

## Accessibility

WCAG 2.2 AA is a requirement, not a goal. In particular:

- Contrast: 4.5:1 for text, 3:1 for large text and UI components.
- Visible focus that is never obscured.
- Target size at least 24×24 px.
- No auto-advancing content without pause.
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
