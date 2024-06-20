  SELECT DISTINCT
    json_data.key AS property
  FROM
    ae.object
    INNER JOIN ae.taxonomy ON ae.object.taxonomy_id = ae.taxonomy.id
    INNER JOIN ae.pco_of_object ON ae.pco_of_object.object_id = ae.object.id
    INNER JOIN ae.property_collection_object ON ae.property_collection_object.id = ae.pco_of_object.pco_id
    INNER JOIN ae.property_collection pc ON pc.id = ae.property_collection_object.property_collection_id,
    jsonb_each(ae.property_collection_object.properties) AS json_data
WHERE
  ae.taxonomy.name = ANY ('{"CSCF (2022)"}')
  AND pc.name = 'CH Rote Liste Bienen (2022)'
ORDER BY
  property;