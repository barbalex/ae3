# Production error reports in ae3, ported from apf2

apf2's "error_report" is a self-built, opt-in client telemetry pipeline (no Sentry): a module POSTs each browser error as one JSON row to a PostgREST table, global handlers feed it, error boundaries report through it, a cron script on the server pushes phone notifications. ae3 already has `react-error-boundary@6.1.6` and both boundary components — they just don't report anywhere. This plan ports the whole pipeline, adapted to ae3's conventions.

## Frontend (ae3 repo)

**1. `src/modules/errorTelemetry.ts` (new)** — verbatim port of apf2's module with two adaptations:
- release comes from `import { version } from '../../package.json'` (ae3 already imports package.json in `src/App.tsx:10`) instead of apf2's `__APP_VERSION__` define — avoids touching vite/vitest configs.
- comments reference `ae.error_report` instead of `apflora.error_report`.

Unchanged behavior: opt-in via build-time `VITE_ERROR_TELEMETRY_URL` (no-op otherwise, dev stays silent); payload only message/stack/url(path+search)/userAgent/release (no user identity); benign `ResizeObserver` noise filter; caps of 25 events/session, 3 repeats/message, 2000/5000 char clipping; `fetch(..., { keepalive: true })` with snake_case `user_agent`, timestamps stamped server-side; never rejects. Exports `reportError(kind, error)` and `installErrorTelemetry()` (window `error` + `unhandledrejection` listeners).

**2. `src/modules/errorTelemetry.test.ts` (new)** — port of apf2's tests (fresh module per case via `vi.resetModules()` + `vi.stubEnv`, stubbed window/navigator/fetch): wire format, no-op without env, per-message dedupe, session cap, network-failure resilience, non-Error serialization, benign-noise filter, handler installation. Imports without `.ts` extensions (ae3 eslint rule); release asserted against package.json's version.

**3. `src/main.tsx`** — call `installErrorTelemetry()` next to `registerSW()`.

**4. `src/components/shared/ErrorBoundary.tsx`** — add `onError={(error) => void reportError('boundary', error)}` to the `ErrorBoundaryComponent` props (fallback UI and reset flow stay as-is).

**5. `src/components/shared/RouterErrorBoundary.tsx`** — add `useEffect(() => { void reportError('boundary', error) }, [error])` (apf2 pattern; `useRouteError` value reported once).

**6. `.env.production` (new, committed)** — `VITE_ERROR_TELEMETRY_URL=https://api.arteigenschaften.ch/postgrest/error_report` with a comment pointing at the migration. Add `!.env.production` to `.gitignore` (it currently ignores `.env.*` except `.env.example`). Cross-origin POSTs from artdaten.ch are fine: PostgREST runs `PGRST_SERVER_CORS_ENABLED: true` without an origin allowlist (=> `*`).

**7. `vite.config.ts`** — add `sourcemap: true` to `build` (apf2 parity; maps deploy publicly alongside chunks for manual symbolication of reported stacks; the workbox precache globs don't include `.map`).

**8. `src/vite-env.d.ts`** — declare `VITE_ERROR_TELEMETRY_URL?: string` on `ImportMetaEnv` for documentation/typing.

## Database

**9. `backend/db/migrations/2026-11-14-error-report.sql` (new)** — adapted from apf2's `00_error_report.sql`:

```sql
CREATE TABLE IF NOT EXISTS ae.error_report (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  created_at timestamptz NOT NULL DEFAULT now(),
  release text CHECK (char_length(release) <= 40),
  kind text NOT NULL CHECK (kind IN ('window.error','unhandledrejection','boundary','manual')),
  message text NOT NULL CHECK (char_length(message) <= 2000),
  stack text CHECK (char_length(stack) <= 5000),
  url text CHECK (char_length(url) <= 2000),
  user_agent text CHECK (char_length(user_agent) <= 1000)
);
-- trigger forcing id/created_at regardless of client input (same as apf2)
-- ENABLE ROW LEVEL SECURITY; policy insert_anon FOR INSERT TO anon WITH CHECK (true)
```

ae3-specific grant handling (deviation from apf2, required by ae3's `grantRoles.sql`):
- `REVOKE ALL ON ae.error_report FROM PUBLIC, anon, org_writer, org_admin` before grants — ae3's default privileges would otherwise auto-grant SELECT to anon and ALL to org roles (they are application roles for org users and must not read global reports; RLS still guards, but revoking is explicit).
- Only `GRANT INSERT ON ae.error_report TO anon`. No read grants at all — ae3 has no `apflora_manager` equivalent; the operator reads via psql (`docker exec -it ae_db psql -U postgres -d ae`) through the SSH tunnel.
- `uuidv7()` is native on the PG 18 image; verify at apply time, fall back to `gen_random_uuid()` if the image lacks it.

**10. `src/sql/errorReport.sql` (new)** — canonical DDL copy (src/sql is the schema source of truth per AGENTS.md).

**11. `backend/notify-error-reports.sh` (new, executable)** — port of apf2's cron notifier: flock, `created_at` watermark in `.error-notify-last`, one psql round-trip via `docker exec ae_db psql -U postgres -d ae` against `ae.error_report`, ntfy webhook from `NOTIFY_URL` in a mode-600 `.error-notify.env`, at-least-once delivery, title `arteigenschaften: N neue(r) Client-Fehler`.

**12. `backend/db/backup.sh`** — **no change**: its fingerprint uses an explicit table list, so `error_report` is already excluded (it stays in the dumps themselves).

## Documentation

**13. `AGENTS.md`** (symlink of CLAUDE.md) — short "Error telemetry" section: pipeline overview, opt-in env var, reading reports via psql, notify-cron deployment on the server (copy to `/root/ae`, `.error-notify.env`, cron `*/5 * * * *`), and the migration-apply reminder.

## Local verification (dev backend `ae_db`/`ae_postgrest` is running)

1. Apply the migration: `docker exec -i ae_db psql -U postgres -d ae < backend/db/migrations/2026-11-14-error-report.sql`.
2. curl against `localhost:8093`: anon POST minimal row → 201; oversized message → 400; invalid kind → 400; anon GET → must not return rows (verify actual PostgREST status). If the default representation mode blocks inserts without SELECT (v12 `return` semantics), add `Prefer: return=minimal` to the module's fetch — apf2's stack runs fine without it, so this is just a checkpoint.
3. `npm test`, `npm run typecheck`, `npx eslint .` (CI parity).

## Deliberate deviations from apf2

- version via package.json import instead of a `__APP_VERSION__` vite define
- no manager read role / no API reads of reports (psql-only) — ae3's org roles are per-organization application roles
- no `api-tests/` runner port — verified with curl locally instead
- `installPreloadErrorRecovery` not ported (separate apf2 feature; ae3 has its own VersionCheck auto-update)

## Production rollout (documented, not executed here)

1. Apply the migration on the server db (SSH, same docker exec pattern).
2. Copy `notify-error-reports.sh` to `/root/ae/`, create `.error-notify.env`, add cron entry.
3. Frontend: `npm run deploy` (Vercel embeds the committed `.env.production` URL; release column then carries the bumped version).
