-- one rpc instead of per-level parent fetches when the frontend
-- builds deep links (tree filter, old ?id= urls).
-- Canonical definition lives in src/sql/createFunctions.sql
CREATE OR REPLACE FUNCTION ae.object_path(p_object_id uuid)
  RETURNS TABLE (object_id uuid)
  AS $$
    WITH RECURSIVE ancestors AS (
      SELECT o.id, o.parent_id, 0 AS depth
      FROM ae.object o
      WHERE o.id = p_object_id
      UNION ALL
      SELECT o.id, o.parent_id, a.depth + 1
      FROM ae.object o
      JOIN ancestors a ON o.id = a.parent_id
      -- cap against cycles in the data
      WHERE a.depth < 50
    )
    SELECT a.id
    FROM ancestors a
    ORDER BY a.depth DESC
$$
LANGUAGE sql
STABLE;

ALTER FUNCTION ae.object_path(p_object_id uuid) OWNER TO postgres;
