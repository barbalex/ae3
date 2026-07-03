# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**arteigenschaften.ch** — German-language (de-CH) Swiss SPA for looking up, importing, and exporting the *properties* of flora, fauna, mosses, and habitats (Lebensräume). Full-stack: a React PWA frontend talks to a PostGraphile/Postgres backend. Most UI strings, route segments, and domain identifiers are German words (e.g. `Arten`, `Lebensräume`, `Eigenschaften-Sammlungen`) — preserve this when adding routes, labels, or SQL.

## Commands

```bash
npm run dev        # Vite dev server on http://localhost:5174 (note: not the default 5173)
npm run build      # production build → dist/
npm run preview    # serve the production build
```

There is **no test runner** and **no `lint`/`format` npm script**. ESLint config exists at [eslint.config.mjs](eslint.config.mjs) — run linter directly with `npx eslint .`. Prettier is a dependency but has no config file (defaults).

Installing deps: the project pins exact versions and guards against supply-chain risk via `.npmrc` (`force=true`, `save-exact=true`, `allow-git=none`) and updates through `npm run ncu using cooldown` (`ncu --cooldown 5 --interactive` — skips packages released <5 days ago). The canonical install command uses an `sfw` wrapper: `npm run how-to-install-using-sfw`.

## Backend (Docker)

Two compose stacks under [backend/](backend/) (production) and [backend-dev/](backend-dev/) (local dev):

- **`db`** (container `ae_db`) — Postgres 18, schema `ae`. Initialized from `ae.backup` via `pg_restore` ([db/init/](backend/db/init/)), only on first start. Exposed on port **5432**.
- **`graphql`** (container `ae_graphql`) — PostGraphile 4.14 auto-generating the GraphQL API from the `ae` schema, on port **5000**. Plugins: `connection-filter`, `pg-order-by-related`, `upsert`. JWT auth type `auth.jwt_token`, default role `anon`, query batching + 300kb body limit.
- **`caddy`** — only in [backend/](backend/), terminates TLS and reverse-proxies `api.arteigenschaften.ch/{graphql,graphiql}` → `ae_graphql:5000`. [backend-dev/](backend-dev/) omits Caddy and exposes graphql/db directly with `host.docker.internal` for localhost connectivity.

Local backend: `cd backend-dev && docker compose up`. The frontend's [graphQlUri.js](src/modules/graphQlUri.js) targets `http://localhost:5000/graphql` on localhost, else `https://api.<hostname>/graphql`. DB roles: `anon`, `authenticator`, `org_admin`, `org_writer`, plus `orgTaxonomyWriter` (grants taxonomy write access).

Credentials/secrets live in `.env` (`JWT_SECRET`, `DATABASE_URL`, `POSTGRES_PASSWORD`, `AUTHENTICATOR_PASSWORD`).

## Source of truth for the database schema

[src/sql/](src/sql/) holds the canonical Postgres DDL/functions — **not** applied by the build, but the reference for the `ae` schema behind PostGraphile:
- `createTables.sql`, `createTypes.sql`, `createRoles.sql`, `createPolicies.sql` (row-level security), `createViews.sql`, `createFunctions.sql`
- `exportFunction.sql` — the server-side export query (large; drives the Export UI)
- `treeFunction.sql` / `tree_*.sql` — builds the navigation tree
- [src/sql/one-offs/](src/sql/one-offs/) — dated migration scripts

When the data model changes, update these files (and re-restore the backup or run the migration), since PostGraphile exposes whatever the live schema contains.

## Frontend architecture

**Entry chain:** [index.html](index.html) → [src/main.jsx](src/main.jsx) → [src/App.jsx](src/App.jsx) → [src/components/Router.jsx](src/components/Router.jsx).

**Provider stack** (App.jsx, outer→inner): `JotaiProvider` (custom store) → `ApolloProvider` → `QueryClientProvider` (React Query) → `StyledEngineProvider` → `ThemeProvider` (MUI). `Stacker.jsx` is also rendered to track window size.

**Three cooperating clients, all wired to the same Jotai store:**
- **Apollo Client** ([client.js](src/client.js)) — the GraphQL client. `BatchHttpLink` + an auth link that injects the JWT from `loginTokenAtom`; deliberately `fetchPolicy: 'no-cache'` everywhere. The instance is stored in `apolloClientAtom` *and* provided via context.
- **TanStack React Query** — used for component data fetching (e.g. the tree). `refetchOnWindowFocus: false`. Stored in `queryClientAtom` and provided via context.
- **Jotai** ([src/store/index.ts](src/store/index.ts)) — global UI state. Notable pattern: the Apollo and React Query *instances themselves* are atoms, so non-React modules (e.g. [client.js](src/client.js)) read them via `store.get(...)` instead of hooks. Login token/username persist to `localStorage` via `atomWithStorage`.

**URL is the navigation state.** Routes (react-router data router in [Router.jsx](src/components/Router.jsx)) encode the active node as path segments, and `activeNodeArrayAtom` is derived from the pathname ([getActiveNodeArrayFromPathname.js](src/modules/getActiveNodeArrayFromPathname.js)). Top-level routes mirror the domain: `/Arten/:taxId/:objId`, `/Lebensräume/...`, `/Eigenschaften-Sammlungen/:pcId/{Eigenschaften|Beziehungen}`, `/Benutzer/:userId`, `/Organisationen/:orgId`, plus `/Export`, `/Login`, `/Dokumentation/...`.

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
