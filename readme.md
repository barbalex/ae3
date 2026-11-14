Informationen über das Projekt finden Sie [in der Dokumentation](https://arteigenschaften.ch/Dokumentation/projektbeschreibung/)

## Refresh the dev environment after pulling

Run this whenever you come back to the repo (e.g. on the notebook) after pulling. Every step is idempotent — when in doubt, run all of it.

1. **Node 24** — `node -v` should print `v24.x` (the CI version).
2. **Dependencies** — `npm install` (versions are pinned via `package-lock.json` and `.npmrc`). Supply-chain-guarded variant: `npm run how-to-install-using-sfw`.
3. **backend-dev secrets** — `backend-dev/.env` is gitignored. If it is missing, copy `backend-dev/.env.example` and fill in the values; if it is old, diff it against the example. `JWT_SECRET` must be ≥ 32 chars and identical for db and PostgREST (both read it from this file).
4. **Backend up** — `cd backend-dev && docker compose up -d --build` (dev port block 5433/8093, coexists with other local stacks like apf2/ps). On a fresh volume, the first restore of `ae.backup` takes a minute — wait until `docker ps` shows `ae_db` as `(healthy)`.
5. **DB migrations** — [backend/db/migrations/](backend/db/migrations/) is applied manually, and every production backup predates at least the newest migrations. They are idempotent, so re-apply all of them:
   ```bash
   for f in backend/db/migrations/*.sql; do
     docker exec -i ae_db psql -U postgres -d ae -v ON_ERROR_STOP=1 < "$f" || break
   done
   ```
6. **Frontend** — `npm run dev` → http://localhost:5174 (it targets PostgREST on localhost:8093 by itself).
7. **Sanity check** — log in at `/Login` with `test-org-admin` / `ae3-test-pass` (seeded by `backend-dev/db/init/05_test_users.sql` on the fresh volume; safe to re-apply on an existing one).

Optional, when the local data should match production again: `npm run fetchBackup` (writes `backend-dev/db/ae.backup`), then `cd backend-dev && docker compose down -v && docker compose up -d --build` — **this deletes local dev data** — then wait for healthy (step 4) and re-apply the migrations (step 5).
