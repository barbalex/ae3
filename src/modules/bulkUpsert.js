import { apiFetch } from './api.js'

// PostgREST bulk upsert: POSTing an array with
// Prefer: resolution=merge-duplicates makes every row an
// INSERT ... ON CONFLICT (onConflict) DO UPDATE, so existing rows are
// updated and new ones inserted - one request per chunk instead of
// the two requests per row the imports needed before.
// onConflict must name the columns of a unique constraint of the
// table (e.g. 'object_id,property_collection_id' for
// property_collection_object).
export const bulkUpsert = async ({
  path,
  onConflict,
  rows,
  chunkSize = 500,
  onChunkDone,
}) => {
  for (let start = 0; start < rows.length; start += chunkSize) {
    const chunk = rows.slice(start, start + chunkSize)
    await apiFetch(`${path}?on_conflict=${onConflict}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // replaces apiFetch's default Prefer: return=minimal
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(chunk),
    })
    onChunkDone?.(chunk.length)
  }
}
