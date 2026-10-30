# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**arteigenschaften.ch** — German-language (de-CH) Swiss SPA for looking up, importing, and exporting the *properties* of flora, fauna, mosses, and habitats (Lebensräume). Full-stack: a React PWA frontend talks to a PostgREST/Postgres backend. Most UI strings, route segments, and domain identifiers are German words (e.g. `Arten`, `Lebensräume`, `Eigenschaften-Sammlungen`) — preserve this when adding routes, labels, or SQL.

## Commands

```bash
npm run dev        # Vite dev server on http://localhost:5174 (note: not the default 5173)
npm run build      # production build → dist/
npm run preview    # serve the production build
npm test           # vitest: unit tests for src/modules helpers + component smoke tests
npm run test:watch # vitest in watch mode
npm run test:e2e   # playwright e2e smoke tests (starts dev server + needs backend-dev running)
npm run deploy     # deploy production: bump patch version + date, push main, fast-forward the artdaten + ae branches (Vercel deploys artdaten.ch + arteigenschaften.ch)
npm run deploy minor # same with a minor bump (or: major)
npm run deploy major ae # same with a major bump, but only fast-forward the ae branch (or: artdaten; default: both)
```

There is **no `lint`/`format` npm script**. ESLint config exists at [eslint.config.mjs](eslint.config.mjs) — run linter directly with `npx eslint .`. Prettier is a dependency but has no config file (defaults).

Testing: [vitest.config.js](vitest.config.js) (jsdom, deliberately separate from vite.config.js — no PWA/svgr/babel plugins). Tests are co-located as `*.test.js(x)` next to the module/component. E2e specs live in [e2e/](e2e/) with [playwright.config.js](playwright.config.js), which starts the dev server itself but needs the PostgREST backend on localhost:8093 (`cd backend-dev && docker compose up`).

Installing deps: the project pins exact versions and guards against supply-chain risk via `.npmrc` (`force=true`, `save-exact=true`, `allow-git=none`) and updates through `npm run ncu using cooldown` (`ncu --cooldown 5 --interactive` — skips packages released <5 days ago). The canonical install command uses an `sfw` wrapper: `npm run how-to-install-using-sfw`.

## Backend (Docker)

Two compose stacks under [backend/](backend/) (production) and [backend-dev/](backend-dev/) (local dev):

- **`db`** (container `ae_db`) — Postgres 18, schema `ae`. Initialized from `ae.backup` via `pg_restore` ([db/init/](backend/db/init/)), only on first start. Exposed on host port **5433** in dev (ae3 dev port block 5433/8093, so it coexists with other local projects claiming 5432; production `backend/` still publishes 5432). Date-stamped SQL migrations live in [backend/db/migrations/](backend/db/migrations/) and are applied manually.
- **`postgrest`** (container `ae_postgrest`) — PostgREST v12.2.3 exposing the `ae` schema as a REST API, on host port **8093** in dev (3000 inside the container). Stock image configured via `PGRST_*` env (`PGRST_DB_SCHEMAS: ae`, `PGRST_DB_ANON_ROLE: anon`, `PGRST_JWT_SECRET` from the shared `JWT_SECRET`, CORS enabled). Tokens issued by `ae.login` are Bearer tokens for this API; the JWT secret must be ≥32 chars (PostgREST's jose library rejects shorter HMAC secrets).
- **`caddy`** — only in [backend/](backend/), terminates TLS and reverse-proxies `api.arteigenschaften.ch/postgrest/*` → `ae_postgrest:3000`. [backend-dev/](backend-dev/) omits Caddy and exposes db (5433) and postgrest (8093) directly, with `DATABASE_URL` pointing at `host.docker.internal`.

Local backend: `cd backend-dev && docker compose up`. The frontend's [api.js](src/modules/api.js) (`postgrestUri()`) targets `http://localhost:8093` on localhost, else `https://api.<hostname>/postgrest`. DB roles: `anon`, `authenticator`, `org_admin`, `org_writer`. `orgTaxonomyWriter` is *not* a DB role — it is an application-level role on `ae.organization_user.role` granting taxonomy write access.

Credentials/secrets live in `.env` (`JWT_SECRET`, `DATABASE_URL`, `POSTGRES_PASSWORD`, `AUTHENTICATOR_PASSWORD`).

## Source of truth for the database schema

[src/sql/](src/sql/) holds the canonical Postgres DDL/functions — **not** applied by the build, but the reference for the `ae` schema behind PostgREST:
- `createTables.sql`, `createTypes.sql`, `createRoles.sql`, `createPolicies.sql` (row-level security), `createViews.sql`, `createFunctions.sql`
- `exportFunction.sql` — the server-side export query (large; drives the Export UI)
- `treeFunction.sql` / `tree_*.sql` — builds the navigation tree
- [src/sql/one-offs/](src/sql/one-offs/) — dated migration scripts

When the data model changes, update these files (and re-restore the backup or run the migration), since PostgREST exposes whatever the live schema contains.

## Frontend architecture

**Entry chain:** [index.html](index.html) → [src/main.jsx](src/main.jsx) → [src/App.jsx](src/App.jsx) → [src/components/Router.jsx](src/components/Router.jsx).

**Provider stack** (App.jsx, outer→inner): `JotaiProvider` (custom store) → `QueryClientProvider` (React Query) → `StyledEngineProvider` → `ThemeProvider` (MUI). `Stacker.jsx` is also rendered to track window size.

**Three cooperating layers, all wired to the same Jotai store:**

**Dark mode** (ps-project pattern): `themeModeAtom` (`'ae-theme-mode'`: `system`/`light`/`dark`, default `system`) drives `ThemeProvider` ([theme.js](src/theme.js): `lightTheme`/`darkTheme`) and is mirrored to `html[data-theme]` by App.jsx; a pre-paint script in [index.html](index.html) resolves it from localStorage to avoid a flash. All colors go through the `--ae-*` CSS custom properties defined in [index.css](src/index.css) (dark variants on `html[data-theme='dark']`) — don't hardcode colors in components or CSS modules. Switcher: ThemeChooser in the AppBar.
- **PostgREST client** ([api.js](src/modules/api.js)) — all backend access goes through it. `postgrestUri()` picks `http://localhost:8093` vs `https://api.<hostname>/postgrest`; `apiFetch(path, options)` is the general wrapper (throws `Error` with `.code`/`.status` from the PostgREST error body); `rpc(fn, args)` calls DB functions via `POST /rpc/<fn>`; `apiCount(path)` reads totals from `content-range` via `Prefer: count=exact`. `authHeaders()` injects the JWT from `loginTokenAtom` as a Bearer header and clears the login on expired tokens.
- **TanStack React Query** — component data fetching (e.g. the tree; query keys are inline arrays like `['tree', 'root', hasToken]`). `refetchOnWindowFocus: false`. Stored in `queryClientAtom` and provided via context.
- **Jotai** ([src/store/index.ts](src/store/index.ts)) — global UI state. Notable pattern: the React Query *instance itself* is an atom, so non-React modules (e.g. [api.js](src/modules/api.js)) read it via `store.get(...)` instead of hooks. Login token/username persist to `localStorage` via `atomWithStorage`.

**URL is the navigation state.** Routes (react-router data router in [Router.jsx](src/components/Router.jsx)) encode the active node as path segments, and `activeNodeArrayAtom` is derived from the pathname ([getActiveNodeArrayFromPathname.js](src/modules/getActiveNodeArrayFromPathname.js)). Top-level routes mirror the domain: `/Arten/:taxId/:objId`, `/Lebensräume/...`, `/Eigenschaften-Sammlungen/:pcId/{Eigenschaften|Beziehungen}`, `/Benutzer/:userId`, `/Organisationen/:orgId`, plus `/Export`, `/Login`, `/Dokumentation/...`.

**Tree** ([Tree/](src/components/Tree/)): the navigation tree is a virtualized flat list (`virtua` VList) rendered by [VirtualizedTree.jsx](src/components/Tree/VirtualizedTree.jsx). [treeModel.js](src/components/Tree/treeModel.js) walks the expanded levels (expansion = url prefix, like the former nested components) and builds the flat rows from the *results* of the tree's list queries (`useQueries`) — do not read the query cache directly during render there; it misses resolutions and leaves levels stuck loading. List queries are paginated (`limit`/`offset`, 500 rows, appended in the cached `{rows, complete, loading}` value via `fetchMoreTreeRows`); a mounted `LoadMoreRow` auto-loads the next page (virtua only mounts rows near the viewport), and `pathHoles` auto-paginate lists when a deep link expects a child beyond the loaded pages. `IntoViewScroller` scrolls to deep-linked rows through `treeScrollContext.js` (virtualization keeps them unmounted). Mutations still invalidate the `['tree']` key prefix.

**Responsive layout:** [Stacker.jsx](src/components/Stacker.jsx) sets `stackedAtom` (true when width <700px). [Data/index.jsx](src/components/Data/index.jsx) switches between `DataFlexed` (side-by-side, `react-reflex`) and `DataStacked` (mobile tabs) based on it.

### Domain model
- **Taxonomy** (`Taxonomie`) — a classification; types are *Arten* (species) and *Lebensräume* (habitats). A **Taxonomy** page lists its objects; an **Objekt** page shows one taxon.
- **PropertyCollection** (`Eigenschaften-Sammlung`) — a reusable set of properties. **PCO** = properties of objects (*Eigenschaften*); **RCO** = relations between objects (*Beziehungen*).
- **Export** — multi-axis filter system (tax / pco / rco properties + filters) producing CSV/XLSX. See [src/modules/exportCsv.js](src/modules/exportCsv.js), [exportXlsx.js](src/modules/exportXlsx.js), [getXlsxBuffer.js](src/modules/getXlsxBuffer.js), and the `export*Atom` family in the store.

## Conventions

- **Emotion is the JSX css-prop pragma** (`jsxImportSource: '@emotion/react'` in [vite.config.js](vite.config.js)) — `css={...}` works on elements without importing it.
- **CSS Modules** use `camelCaseOnly` convention (`styles.someClass`).
- **React Compiler** is enabled via the babel preset in [vite.config.js](vite.config.js).
- **SVGs** import as React components via `vite-plugin-svgr`.
- **Vendored code:** [src/modules/react-contextmenu/](src/modules/react-contextmenu/) was extracted in-tree from an archived package — edit locally, do not re-add the npm dependency.
- Imports omit `.jsx`/`.js`/`.ts` extensions for local source (enforced by eslint `import/extensions`); the one exception is cross-importing the TS store (`from '.../store/index.ts'`), which keeps the explicit extension.
- Mixed JSX/TS: components are `.jsx`; shared types and the store are `.ts` ([src/store/index.ts](src/store/index.ts)).
