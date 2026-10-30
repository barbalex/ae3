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

## 1. Bulk upsert for PCO/RCO imports

Imports write row by row: for every row a GET check, then PATCH or
POST, all fired via `Promise.all`
(`src/components/PropertyCollection/PCO/Import/index.jsx` ~290-315,
same in `RCO/Import/index.jsx`). PostgREST supports upsert in one
request: `POST` the whole (chunked) array with
`Prefer: resolution=merge-duplicates` — conflicts resolve against the
primary key. Replaces hundreds of round-trips with a handful. Watch
out: `api.js` sets `Prefer: return=minimal` for non-GET requests
(override, don't duplicate, the header); chunk large imports
(~1000 rows) to keep request sizes sane; errors currently surface per
row — decide how to report partial failures of a chunk.

## 2. Move export/import processing into a web worker

All heavy library work runs synchronously on the main thread and
freezes the UI on big exports/imports: exceljs workbook build
(`src/modules/getXlsxBuffer.js`), `@json2csv` parse
(`src/modules/exportCsv.js`), `@e965/xlsx` read + validation loops
(`PCO/Import/index.jsx` ~195ff, `RCO/Import/index.jsx` ~242ff). The
TODO at `src/modules/exportXlsx.js:4-8` planned exactly this once
worker modules were universally supported — they now are; no need for
the `import-from-worker` shim. The dynamic-import boundaries already
isolate these code paths, so a worker is contained. Pass rows in,
receive an ArrayBuffer/CSV string back; keep the loading spinners
honest (they can't repaint while the main thread is busy today).

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
