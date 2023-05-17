
DROP VIEW IF EXISTS ae.v_vermehrung_arten CASCADE;

CREATE OR REPLACE VIEW ae.v_vermehrung_arten AS
SELECT DISTINCT on (ae.object.id)
  ae.object.id,
  tax.name AS taxonomy,
  ae.object.name,
  ae.object.properties ->> 'Artname' AS name_latein,
  CASE WHEN ae.object.properties ->> 'Name Deutsch' IS NOT NULL THEN
    ae.object.properties ->> 'Name Deutsch'
  ELSE
    ae.object.properties ->> 'Artname'
  END AS name_deutsch,
  coalesce(synonym.object_id_synonym, synonym2.object_id) AS synonym,
  now() as changed,
  extract(epoch from now()) as _rev_at
FROM
  ae.object
  INNER JOIN ae.taxonomy tax ON tax.id = ae.object.taxonomy_id
  -- account for both ways an object can be defined as synonym
  -- ensure synonym is of other taxonomy
  LEFT JOIN ae.synonym synonym
    inner join ae.object syn_obj 
      inner join ae.taxonomy syn_tax on syn_tax.id = syn_obj.taxonomy_id
    on synonym.object_id_synonym = syn_obj.id
  ON ae.object.id = synonym.object_id 
  LEFT JOIN ae.synonym synonym2 
    inner join ae.object syn_obj2 
      inner join ae.taxonomy syn_tax2 on syn_tax2.id = syn_obj2.taxonomy_id 
    on synonym2.object_id = syn_obj2.id
  ON ae.object.id = synonym2.object_id_synonym
WHERE
  tax.id IN ('aed47d41-7b0e-11e8-b9a5-bd4f79edbcc4', 'c87f19f2-1b77-11ea-8282-bbc40e20aff6') -- only lowest hierarchy, not pure structural objects
  AND ae.object.properties ->> 'Taxonomie ID' IS NOT NULL
  and (syn_tax.id is null or syn_tax.id <> tax.id)
  and (syn_tax2.id is null or syn_tax2.id <> tax.id)
ORDER BY
  ae.object.id;