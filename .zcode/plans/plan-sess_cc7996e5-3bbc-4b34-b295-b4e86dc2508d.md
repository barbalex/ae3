Minimal fix for vermehrung's arteigenschaften.ch connection: delete the dangling remote-schema config from Hasura metadata (frontend never used it), apply to the live Hasura, and verify the fdw data path still works.

## 1. Repo edit (vermehrung)

Surgically remove from `src/hasuraMetadata/metadata.json` (510 KB JSON — edited with jq, not string edits):
- `metadata.remote_schemas` (the single `ae` entry pointing at https://api.arteigenschaften.ch/graphql)
- the `remote_relationships` block (`arteigenschaften`) on table `public.art` in `sources[0]`

Validate the result with jq; diff to confirm only those blocks changed.

## 2. Apply to the live Hasura — drift-safe

The repo metadata is a hand-versioned export (resource_version 83); the live server (139.162.172.14, container `v_graphql`, Hasura v2.51.0) may have drifted since. So:
1. `export_metadata` from the live server (ssh + curl to localhost:8080 with the admin secret from the server's `.env`).
2. Diff live export vs repo file. If they match (ignoring resource_version), apply the repo file; if live drifted, apply the same two jq deletions to the live export instead — never clobber live-only changes.
3. `replace_metadata` with `allow_inconsistent_metadata: false` (atomic — fails loudly rather than leaving broken state), then `get_inconsistent_metadata` (expect empty) and `/healthz`.

## 3. Verify the surviving data path

- GraphQL through the live API: `query { ae_art(limit: 1) { id name taxonomy } }` — the table the app subscribes to.
- fdw round-trip: `select count(*) from public.ae_art_live;` on vermehrung's prod db (`docker exec v_db psql …`) — this actually connects through to ae3's Postgres as fdw_user, proving the remaining arteigenschaften connection survived the cutover.

## 4. Local dev + bookkeeping

- If vermehrung's local dev Hasura is running, apply the same metadata there.
- Update the ae3 `tasks.md` note (vermehrung connection fixed). Both repos' changes stay uncommitted for your review.

Rollback: git checkout the metadata file / re-apply the old export — harmless since nothing used the removed blocks.

Note (pre-existing, out of scope): the refresh of `ae_art` from `ae_art_live` was a manual one-off in 2023 — no cron exists. If you want fresher ae3 data in vermehrung, that refresh SQL needs a run/schedule; I'll flag it but not touch it.