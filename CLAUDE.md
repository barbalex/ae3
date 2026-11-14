# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. It is symlinked as `AGENTS.md` so agent tools following that convention (ZCode, Cursor, …) load it too.

## Project

**arteigenschaften.ch** — German-language (de-CH) Swiss SPA for looking up, importing, and exporting the *properties* of flora, fauna, mosses, and habitats (Lebensräume). Full-stack: a React PWA frontend talks to a PostgREST/Postgres backend. Most UI strings, route segments, and domain identifiers are German words (e.g. `Arten`, `Lebensräume`, `Eigenschaften-Sammlungen`) — preserve this when adding routes, labels, or SQL.

## Commands

```bash
npm run dev        # Vite dev server on http://localhost:5174 (note: not the default 5173)
npm run build      # tsc --noEmit, then production build → dist/
npm run typecheck  # tsc --noEmit
npm run preview    # serve the production build
npm test           # vitest: unit tests for src/modules helpers + component smoke tests
npm run test:watch # vitest in watch mode
npm run test:e2e   # playwright e2e smoke tests (starts dev server + needs backend-dev running)
npm run deploy     # deploy production: bump patch version + date, push main, fast-forward the artdaten + ae branches (Vercel deploys artdaten.ch + arteigenschaften.ch)
npm run deploy minor # same with a minor bump (or: major)
npm run deploy major ae # same with a major bump, but only fast-forward the ae branch (or: artdaten; default: both)
```

There is **no `lint`/`format` npm script**. ESLint config exists at [eslint.config.ts](eslint.config.ts) (TS config file; requires the `jiti` devDependency) — run linter directly with `npx eslint .`. Prettier is a dependency but has no config file (defaults).

Testing: [vitest.config.ts](vitest.config.ts) (jsdom, deliberately separate from vite.config.ts — no PWA/svgr/babel plugins). Tests are co-located as `*.test.ts(x)` next to the module/component. E2e specs live in [e2e/](e2e/) with [playwright.config.ts](playwright.config.ts), which starts the dev server itself but needs the PostgREST backend on localhost:8093 (`cd backend-dev && docker compose up`); [e2e/roles.spec.ts](e2e/roles.spec.ts) additionally needs the seeded test users (see "Testing user roles"). CI ([ci.yml](.github/workflows/ci.yml)) runs typecheck + unit tests + eslint on every push/PR using **Node 24** — match that version locally.

Installing deps: the project pins exact versions and guards against supply-chain risk via `.npmrc` (`force=true`, `save-exact=true`, `allow-git=none`) and updates through `npm run ncu using cooldown` (`ncu --cooldown 5 --interactive` — skips packages released <5 days ago). The canonical install command uses an `sfw` wrapper: `npm run how-to-install-using-sfw`.

## Backend (Docker)

Two compose stacks under [backend/](backend/) (production) and [backend-dev/](backend-dev/) (local dev):

- **`db`** (container `ae_db`) — Postgres 18, schema `ae`. Initialized from `ae.backup` via `pg_restore` ([db/init/](backend/db/init/)), only on first start. Exposed on host port **5433** in dev (ae3 dev port block 5433/8093, so it coexists with other local projects claiming 5432; production `backend/` still publishes 5432). Date-stamped SQL migrations live in [backend/db/migrations/](backend/db/migrations/) and are applied manually. **After re-creating the volume / re-restoring the backup:** re-apply the migrations (the backup predates them). The `app.jwt_secret` database setting comes from init script `04_jwt_secret.sh` (`JWT_SECRET` env) — without it every login 401s, because the backup carries a literal `${JWT_SECRET}` placeholder there and `ae.login` signs tokens with whatever that setting contains while PostgREST verifies against the real secret.
- **`postgrest`** (container `ae_postgrest`) — PostgREST v12.2.3 exposing the `ae` schema as a REST API, on host port **8093** in dev (3000 inside the container). Stock image configured via `PGRST_*` env (`PGRST_DB_SCHEMAS: ae`, `PGRST_DB_ANON_ROLE: anon`, `PGRST_JWT_SECRET` from the shared `JWT_SECRET`, CORS enabled). Tokens issued by `ae.login` are Bearer tokens for this API; the JWT secret must be ≥32 chars (PostgREST's jose library rejects shorter HMAC secrets).
- **`caddy`** — only in [backend/](backend/), terminates TLS and reverse-proxies `api.arteigenschaften.ch/postgrest/*` → `ae_postgrest:3000`. [backend-dev/](backend-dev/) omits Caddy and exposes db (5433) and postgrest (8093) directly, with `DATABASE_URL` pointing at `host.docker.internal`.

Local backend: `cd backend-dev && docker compose up`. The frontend's [api.ts](src/modules/api.ts) (`postgrestUri()`) targets `http://localhost:8093` on localhost, else `https://api.<hostname>/postgrest`. Open psql in the dev db with `docker exec -it ae_db psql -U postgres -d ae`. DB roles: `anon`, `authenticator`, `org_admin`, `org_writer`. `orgTaxonomyWriter` is *not* a DB role — it is an application-level role on `ae.organization_user.role` granting taxonomy write access.

Credentials/secrets live in `.env` (`JWT_SECRET`, `DATABASE_URL`, `POSTGRES_PASSWORD`, `AUTHENTICATOR_PASSWORD`); both stacks have a committed `.env.example` documenting the values and their traps (`$$`-escaping, the unsupervised `${AUTHENTICATOR_PASSWORD}` literal in 01_db_users_roles.sql). `ae.backup` is gitignored — fetch a fresh one from production with `npm run fetchBackup` (see "Deploying the backend").

## Testing user roles

Two role layers — don't confuse them:

- **DB roles**: `anon`, `authenticator`, `org_admin`, `org_writer` ([createRoles.sql](src/sql/createRoles.sql)). `ae.user.role` holds one (enforced by the `ensure_user_role_exists` trigger — it must exist in `pg_roles`); `ae.login` puts it into the JWT and PostgREST switches to it. Row-level security lives in [createPolicies.sql](src/sql/createPolicies.sql).
- **Application roles**: `orgAdmin`, `orgTaxonomyWriter`, `orgCollectionWriter` on `ae.organization_user.role` (FK into `ae.role`). They gate UI and writes per organization: client-side in [useUserIsWriter.ts](src/components/shared/useUserIsWriter.ts) and the `taxWriterOnly` tree context menus ([menuConfig.ts](src/components/Tree/contextmenu/menuConfig.ts)), server-side through the views in [createViews.sql](src/sql/createViews.sql) (`current_user_writable_taxonomies`, `current_user_writable_collections`, …).

The dev backend seeds three test users via [05_test_users.sql](backend-dev/db/init/05_test_users.sql) (runs automatically on first volume creation; on an existing volume apply with `docker exec -i ae_db psql -U postgres -d ae < backend-dev/db/init/05_test_users.sql` — it is idempotent, safe to re-run any time). Password for all three: `ae3-test-pass`. Dev-only — never seed them in production.

| user | ae.user.role (DB) | organization_user.role (app) | effect |
|---|---|---|---|
| `test-org-admin` | org_admin | orgAdmin | everything: writes, org user management, writer menus |
| `test-taxonomy-writer` | org_writer | orgTaxonomyWriter | taxonomy/object writes, writer context menus |
| `test-collection-writer` | org_writer | orgCollectionWriter | property collection writes, **no** writer menus |

Log in through the UI at `/Login` (the login fires on blur of the pass field once both fields are filled). [e2e/roles.spec.ts](e2e/roles.spec.ts) covers login plus the writer-menu gating; run it like the other e2e specs.

## Deploying the backend (production)

The frontend deploys itself via Vercel (`npm run deploy`). The backend is deployed manually — no CI touches it:

- Host `api.arteigenschaften.ch`; the stack (a copy of [backend/](backend/): db + postgrest + caddy) lives at `/root/ae`. Caddy terminates TLS and proxies `api.arteigenschaften.ch/postgrest/*` → `ae_postgrest:3000`. The db port is bound to `127.0.0.1:5432` (loopback-only) — reach it through an SSH tunnel.
- Apply changes by copying the changed files of `backend/` to the server and running `docker compose up -d --build` there. (Transport is inferred from past ops commits — e.g. adb4adf — adjust this line if the actual flow differs.)
- Migrations in [backend/db/migrations/](backend/db/migrations/) are applied manually on the server db, e.g. `docker exec -i ae_db psql -U postgres -d ae < migrations/2026-11-02-export-all-on-commit-drop.sql`. Nothing applies them automatically.
- Backups: nightly cron on the server (`0 23 * * * /root/backup/backup.sh`, in-repo copy [host-backup.sh](backend/db/host-backup.sh)) runs [backup.sh](backend/db/backup.sh) inside `ae_db`: pg_dump → rclone upload to Nextcloud (`rclone.conf` mounted read-only from `/root/backup/rclone.conf`). Dumping is skipped when a data fingerprint (deterministic md5 over every `ae` table's rows, ~3s) is unchanged — this replaces the old size check, which silently skipped backups whose content changed at equal size. `/sik_data/last.backup` in the container is always the newest uploaded backup.
- Verify restorability with `ssh root@172.105.79.66 'docker exec -it ae_db bash ./test-restore.sh'` ([test-restore.sh](backend/db/test-restore.sh)): downloads the newest Nextcloud backup, restores it into a scratch database and compares its fingerprint against the live data.
- Seed backend-dev from production: `npm run fetchBackup` ([fetchBackup.mjs](scripts/fetchBackup.mjs)) triggers the server backup (cheap when unchanged — fingerprint skip), downloads `last.backup` into `backend-dev/db/ae.backup`, then rebuild the dev stack against it: `docker compose -f backend-dev/docker-compose.yaml down -v && docker compose -f backend-dev/docker-compose.yaml up -d --build` (deletes local dev data; the test users are seeded automatically on the fresh volume).
- `api.artdaten.ch` (139.162.190.8) runs a content-identical twin of the same stack (verified by fingerprint) — no own backups, no cron; only api.arteigenschaften.ch is backed up.

## Error telemetry (error_report)

Production client errors are collected in the `ae.error_report` PostgREST table (same pipeline as apflora):

- Client: [errorTelemetry.ts](src/modules/errorTelemetry.ts) — opt-in via `VITE_ERROR_TELEMETRY_URL`, set only in the committed [.env.production](.env.production) (`https://api.arteigenschaften.ch/postgrest/error_report`); without it (dev) every export is a no-op. `installErrorTelemetry()` in [main.tsx](src/main.tsx) hooks `window.error`/`unhandledrejection`; the ErrorBoundary/RouterErrorBoundary fallbacks report via `reportError('boundary', …)`. Payload: message, stack, url (path+search), user agent, release (package.json version) — deliberately no user identity. Fire-and-forget (`keepalive`, never rejects); capped at 25 events/session and 3 repeats/message.
- DB: table + insert-only RLS in [2026-11-14-error-report.sql](backend/db/migrations/2026-11-14-error-report.sql), canonical copy [errorReport.sql](src/sql/errorReport.sql). `anon` may only INSERT — read reports via `docker exec -it ae_db psql -U postgres -d ae` (`select … from ae.error_report order by created_at desc limit 50`). The migration ends with `NOTIFY pgrst, 'reload schema'` — postgrest runs with `PGRST_DB_CONFIG=false` and does not see new tables until notified (or restarted).
- Notifications: [notify-error-reports.sh](backend/notify-error-reports.sh) runs from cron on the server (deployed as `/root/ae/error-notify.sh`, with a mode-600 `.error-notify.env` next to it holding the ntfy-style `NOTIFY_URL`) and pushes one aggregated phone notification per 5 minutes. Reports land only on api.arteigenschaften.ch — both frontends POST to that fixed URL (CORS is open), the artdaten twin stack receives none — and `error_report` is not in backup.sh's explicit fingerprint table list, so it never triggers backup runs.
- Stacks are minified: symbolicate against the deployed sourcemaps (`build.sourcemap` is on; `.map` files are public but not precached).

## Source of truth for the database schema

[src/sql/](src/sql/) holds the canonical Postgres DDL/functions — **not** applied by the build, but the reference for the `ae` schema behind PostgREST:
- `createTables.sql`, `createTypes.sql`, `createRoles.sql`, `createPolicies.sql` (row-level security), `createViews.sql`, `createFunctions.sql`
- `exportFunction.sql` — the server-side export query (large; drives the Export UI)
- `errorReport.sql` — client error telemetry table (insert-only for `anon`)
- `treeFunction.sql` / `tree_*.sql` — builds the navigation tree
- [src/sql/one-offs/](src/sql/one-offs/) — dated migration scripts

When the data model changes, update these files (and re-restore the backup or run the migration), since PostgREST exposes whatever the live schema contains.

## Frontend architecture

**Entry chain:** [index.html](index.html) → [src/main.tsx](src/main.tsx) → [src/App.tsx](src/App.tsx) → [src/components/Router.tsx](src/components/Router.tsx).

**Provider stack** (App.tsx, outer→inner): `JotaiProvider` (custom store) → `QueryClientProvider` (React Query) → `StyledEngineProvider` → `ThemeProvider` (MUI). `Stacker.tsx` is also rendered to track window size.

**Three cooperating layers, all wired to the same Jotai store:**

**Dark mode** (ps-project pattern): `themeModeAtom` (`'ae-theme-mode'`: `system`/`light`/`dark`, default `system`) drives `ThemeProvider` ([theme.ts](src/theme.ts): `lightTheme`/`darkTheme`) and is mirrored to `html[data-theme]` by App.tsx; a pre-paint script in [index.html](index.html) resolves it from localStorage to avoid a flash. All colors go through the `--ae-*` CSS custom properties defined in [index.css](src/index.css) (dark variants on `html[data-theme='dark']`) — don't hardcode colors in components or CSS modules. Switcher: ThemeChooser in the AppBar.
- **PostgREST client** ([api.ts](src/modules/api.ts)) — all backend access goes through it. `postgrestUri()` picks `http://localhost:8093` vs `https://api.<hostname>/postgrest`; `apiFetch(path, options)` is the general wrapper (returns `Promise<any>` — PostgREST rows are dynamic) (throws `Error` with `.code`/`.status` from the PostgREST error body); `rpc(fn, args)` calls DB functions via `POST /rpc/<fn>`; `apiCount(path)` reads totals from `content-range` via `Prefer: count=exact`. `authHeaders()` injects the JWT from `loginTokenAtom` as a Bearer header and clears the login on expired tokens.
- **TanStack React Query** — component data fetching (e.g. the tree; query keys are inline arrays like `['tree', 'root', hasToken]`). `refetchOnWindowFocus: false`. Stored in `queryClientAtom` and provided via context.
- **Jotai** ([src/store/index.ts](src/store/index.ts)) — global UI state. Notable pattern: the React Query *instance itself* is an atom, so non-React modules (e.g. [api.ts](src/modules/api.ts)) read it via `store.get(...)` instead of hooks. Login token/username persist to `localStorage` via `atomWithStorage`.

**URL is the navigation state.** Routes (react-router data router in [Router.tsx](src/components/Router.tsx)) encode the active node as path segments, and `activeNodeArrayAtom` is derived from the pathname ([getActiveNodeArrayFromPathname.ts](src/modules/getActiveNodeArrayFromPathname.ts)). Top-level routes mirror the domain: `/Arten/:taxId/:objId`, `/Lebensräume/...`, `/Eigenschaften-Sammlungen/:pcId/{Eigenschaften|Beziehungen}`, `/Benutzer/:userId`, `/Organisationen/:orgId`, plus `/Export`, `/Login`, `/Dokumentation/...`.

**Tree** ([Tree/](src/components/Tree/)): the navigation tree is a virtualized flat list (`virtua` VList) rendered by [VirtualizedTree.tsx](src/components/Tree/VirtualizedTree.tsx). [treeModel.ts](src/components/Tree/treeModel.ts) walks the expanded levels (expansion = url prefix, like the former nested components) and builds the flat rows from the *results* of the tree's list queries (`useQueries`) — do not read the query cache directly during render there; it misses resolutions and leaves levels stuck loading. List queries are paginated (`limit`/`offset`, 500 rows, appended in the cached `{rows, complete, loading}` value via `fetchMoreTreeRows`); a mounted `LoadMoreRow` auto-loads the next page (virtua only mounts rows near the viewport), and `pathHoles` auto-paginate lists when a deep link expects a child beyond the loaded pages. `IntoViewScroller` scrolls to deep-linked rows through `treeScrollContext.ts` (virtualization keeps them unmounted). Mutations still invalidate the `['tree']` key prefix.

**Responsive layout:** [Stacker.tsx](src/components/Stacker.tsx) sets `stackedAtom` (true when width <700px). [Data/index.tsx](src/components/Data/index.tsx) switches between `DataFlexed` (side-by-side, `react-reflex`) and `DataStacked` (mobile tabs) based on it.

### Domain model
- **Taxonomy** (`Taxonomie`) — a classification; types are *Arten* (species) and *Lebensräume* (habitats). A **Taxonomy** page lists its objects; an **Objekt** page shows one taxon.
- **PropertyCollection** (`Eigenschaften-Sammlung`) — a reusable set of properties. **PCO** = properties of objects (*Eigenschaften*); **RCO** = relations between objects (*Beziehungen*).
- **Export** — multi-axis filter system (tax / pco / rco properties + filters) producing CSV/XLSX. See [src/modules/exportCsv.ts](src/modules/exportCsv.ts), [exportXlsx.ts](src/modules/exportXlsx.ts), [getXlsxBuffer.ts](src/modules/getXlsxBuffer.ts), and the `export*Atom` family in the store.

## Conventions

- **CSS Modules** use `camelCaseOnly` convention (`styles.someClass`).
- **React Compiler** is enabled via the babel preset in [vite.config.ts](vite.config.ts).
- **SVGs** import as React components via `vite-plugin-svgr`.
- Imports omit extensions for local source (enforced by eslint `import/extensions`); the store is imported extensionless too (`from '../store'`).
- **TypeScript everywhere** (strict; see [tsconfig.json](tsconfig.json)): components are `.tsx`, modules/workers/configs `.ts`; `npm run typecheck` (also part of `build`) runs `tsc --noEmit`. The store ([src/store/index.ts](src/store/index.ts)) exports the shared domain types (`TaxFilter`, `PcoProperty`, …); PostgREST row data flows as `any` (see [api.ts](src/modules/api.ts)) while props/handlers are typed precisely. Web workers keep `/// <reference lib="webworker" />` at the top. Libraries without type declarations get local shims in [src/types/](src/types/) (`react-reflex`, `luxon`). The node scripts in [scripts/](scripts/) run directly on Node's native type stripping.
