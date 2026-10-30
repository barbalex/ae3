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

Selecting a search result walks the object's parent chain one request
per level (`getObjectForUrl` in
`src/components/Tree/Filter/index.jsx` ~35-60), then the tree expands
level by level. Replace with one RPC (recursive CTE, e.g.
`get_object_path(id)`) returning the whole ancestor chain in one go;
add it to `src/sql/createFunctions.sql` and apply as a migration in
`backend/db/migrations/`. Collapses a visible sequential-loading
stutter into a single request.

## 4. Stop precaching exceljs/xlsx in the service worker

`vite.config.js` VitePWA `globPatterns` precaches ALL build output
with a 1 GB size cap — including `exceljs.min-*.js` (~930 KB) and
`xlsx-*.js` (~360 KB) that most users never load (they're lazily
imported on first export/import). Every first visit downloads
~1.3 MB of Excel code. Exclude those chunks from precaching so they
fetch on demand. Tradeoff: export/import stops working offline.

---

Still open from earlier, whenever you get to it: the repo changes are
uncommitted for your review, and I'd suggest rotating the arteigenschaften
JWT secret at some point since part of it was echoed into this session's
output during the failed first attempt.
