Goal: cut production over from PostGraphile to PostgREST directly — no parallel serving. The frontend conversion is already complete (everything goes through `src/modules/api.js`); what remains is removing the PostGraphile stack, cleaning stale GraphQL references, syncing the canonical SQL, and writing the deploy runbook.

## 1. Remove PostGraphile from both compose stacks

- `backend/docker-compose.yml`: delete the `graphql` service block; change caddy `depends_on` from `[graphql, postgrest]` to `[postgrest]`.
- `backend-dev/docker-compose.yml`: delete the `graphql` service (nothing uses port 5000 anymore — the frontend and e2e hit PostgREST on 3000).
- `backend/caddy/Caddyfile`: remove the `/graphql*` and `/graphiql*` routes; keep `handle_path /postgrest/*`. Drop the commented-out `api.artdaten.ch` block's graphql routes (leave a postgrest-only commented variant).
- Delete now-dead files: `backend/graphql/`, `backend-dev/graphql/`, legacy root `graphql/`, `src/graphql/exportTests.gql`.

## 2. Sync canonical SQL in src/sql with the applied migration

`backend/db/migrations/2026-10-27-postgrest-auth.sql` was applied to dev but `src/sql/` (the declared source of truth) still has the old versions:
- `createFunctions.sql`: replace `ae.login` (full claim set: role, username, exp, aud) and `public.current_user_name()` (reads `request.jwt.claims` JSON, falls back to per-claim GUC) with the migration's versions.
- `exportFunction.sql`: add the `ae.export_all_json(params jsonb)` wrapper.

## 3. Frontend / config / in-app docs cleanup

- `vite.config.js`: remove the dead apollo/graphql `manualChunks` rule.
- `playwright.config.js` + `e2e/smoke.spec.js`: update stale comments (backend is PostgREST on localhost:3000).
- `src/components/Layout/AppBar/MoreMenu.jsx`: remove commented-out GraphiQL handler.
- `src/components/Docs/docs/Projektbeschreibung.jsx` (~line 154): fix the stale "API mit GraphQL aufgebaut" claim.
- `src/components/Docs/docs/Schnittstellen.jsx`: rewrite in German for PostgREST — document `https://api.arteigenschaften.ch/postgrest` as the data interface, mention the self-documenting OpenAPI root endpoint and postgrest.org docs, note that read access works anonymously (anon role) and write access requires login. Keep the historical EvAB/Artenlistentool paragraph, update the date.
- Touch up the handful of misleading stale comments (e.g. `AppBar/index.jsx:54` "passed to GraphQL"); keep the deliberate historical ones ("formerly recursive graphql").

## 4. Update CLAUDE.md to describe the PostgREST architecture

- Intro: frontend talks to a PostgREST/Postgres backend.
- Commands: e2e needs the PostgREST backend on localhost:3000 (`cd backend-dev && docker compose up`).
- Backend section: db + postgrest (v12.2.3, PGRST_* env, shared JWT secret) + caddy (`/postgrest/*` → `ae_postgrest:3000`); drop the graphql/graphiql service description; fix the roles note (`orgTaxonomyWriter` is an app-level role on `organization_user.role`, not a DB role).
- Frontend architecture: provider stack without Apollo; document `src/modules/api.js` (`postgrestUri`/`apiFetch`/`rpc`/`apiCount`, Bearer token from `loginTokenAtom`), React Query + Jotai; remove references to `src/client.js` and `graphQlUri.js` (both deleted long ago).

## 5. tasks.md: replace the parallel-serving deploy note with the direct-cutover runbook

Replace the "docker compose up -d postgrest caddy … PostGraphile still serves the old endpoint in parallel" and the vermehrung paragraphs with this runbook and its known consequences.

**Server runbook (one session):**
1. Pre-flight locally: manual smoke pass (login, tree context-menu create/delete, object edit, PCO/RCO import, xlsx export with filters) against backend-dev, plus `npm test` / `npm run test:e2e`.
2. On the server: pull this branch; apply the auth migration: `docker exec -i ae_db psql -U postgres -d ae < backend/db/migrations/2026-10-27-postgrest-auth.sql` (function replacements only — backward compatible, safe while PostGraphile still runs).
3. Verify the JWT secret: `SELECT length(current_setting('app.jwt_secret'));` must be ≥ 32 and match `JWT_SECRET` in `backend/.env` (escape `$` as `$$`).
4. `docker compose up -d --remove-orphans` in `backend/`: starts `ae_postgrest`, recreates caddy with only the `/postgrest` route, stops and removes `ae_graphql`. From this moment the old GraphQL frontend is dead until step 5.
5. Build and deploy the new frontend (`npm ci && npm run build`, upload `dist/` as arteigenschaften.ch is currently hosted).
6. Verify: app loads, tree renders, login works, an export runs; `curl https://api.arteigenschaften.ch/postgrest/taxonomy?select=id&limit=1` → 200 JSON; `/graphql` → 404.

**Known consequences (accepted):**
- vermehrung's Hasura remote schema (`https://api.arteigenschaften.ch/graphql`) breaks at cutover; its postgres_fdw path is unaffected. Follow-up in vermehrung's repo: serve its existing fdw foreign tables as native Hasura tables.
- Users with a PWA-cached old frontend need one reload to pick up the new build.

**Rollback:** `git checkout` the previous commit on the server, `docker compose up -d graphql caddy` (image is still cached), redeploy the old frontend. No data rollback needed — the migration only replaced functions.

## 6. Local verification

- `docker compose config` in `backend/` and `backend-dev/` to validate both files; `docker compose up -d --remove-orphans` locally (drops the local ae_graphql container).
- `npm test`, `npx eslint` on touched files, `npm run build`, and `npm run test:e2e` if the dev stack is up.
- No commits unless you ask.