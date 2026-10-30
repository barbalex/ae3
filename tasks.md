# Tasks

Performance optimizations identified in the 2026-10 analysis (see chat
for details). Done first:

- [x] virtualize the tree + bound its list queries (branch
      `virtual-tree`: flat-row model in `Tree/treeModel.js`, `virtua`
      VList, 500-row pages with auto-load, path-hole pagination for deep
      links). The original note below preferred
      https://tanstack.com/virtual — `virtua` was used instead (same
      problem class, smaller); swapping later is an option if wanted.

Remaining, in priority order:

- [x] bulk upsert for PCO/RCO imports (branch `bulk-upsert`:
      `src/modules/bulkUpsert.js`, chunked POST with
      `Prefer: resolution=merge-duplicates` on the tables' unique
      constraints; also fixed the pre-existing `.nodes` writer bug that
      had made the import UI unreachable)

## 2. Move export/import processing into a web worker

Done (branch `web-workers`): exceljs workbook build, `@json2csv`
parse and `@e965/xlsx` file parsing each run in their own worker
(`src/workers/*.worker.js`, one-shot rpc via
`src/modules/runInWorker.js`; the heavy libraries load inside the
workers only). `worker.format: 'es'` keeps the libraries in shared
lazy chunks instead of one inlined copy per worker.

## 3. Single RPC for the filter's ancestor path

Done (branch `filter-rpc`): `ae.object_path(uuid)` (recursive CTE,
in `src/sql/createFunctions.sql` + migration
`2026-10-30-object-path.sql` — PostgREST needs `NOTIFY pgrst,
'reload schema'` or a restart after creating it) returns the ancestor
ids root-first. `attachParentChain` and the tree filter's
`getObjectForUrl` use it — one request instead of one per parent
level. Also fixes the old `?id=` redirect (IdParameter) and object
page chains the same way. Guarded by a smoke e2e that asserts no
per-level parent fetches run.

## 4. Stop precaching exceljs/xlsx in the service worker

Done (branch `sw-precache`): `globIgnores` in `vite.config.js` keeps
`exceljs.min-*.js` and `xlsx-*.js` out of the precache (first visit
downloads 1.7 MB instead of 3.0 MB). A `CacheFirst` runtime route
caches them on first export/import, so repeated offline exports keep
working after all. Guarded by `e2e/sw-precache.spec.js`, which serves
the built app and asserts the chunks are absent from the precache but
land in the `excel-chunks` runtime cache.

---

TODO:

Still open from earlier, whenever you get to it: the repo changes are
uncommitted for your review, and I'd suggest rotating the arteigenschaften
JWT secret at some point since part of it was echoed into this session's
output during the failed first attempt.

---

---

---

replace all simplebar usages with narrow native bar?
