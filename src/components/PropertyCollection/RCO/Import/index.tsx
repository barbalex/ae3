import { omit } from 'es-toolkit'

import { ImportCollection } from '../../ImportCollection'
import type { ImportSpec } from '../../ImportCollection'
import { RcoInstructions } from './Instructions'

// rows are matched by the unique constraint (property_collection_id,
// object_id, object_id_relation, relation_type) in a single bulk
// upsert per chunk. The former check-then-write matched without
// relation_type, so importing a different type for an existing pair
// overwrote it - now it inserts a second relation, which is what the
// constraint models
const spec: ImportSpec = {
  queryKey: 'importRcoQuery',
  previewQueryKey: 'rcoPreviewQuery',
  Instructions: RcoInstructions,
  relationField: {
    dataKey: 'objectIdRelation',
    existsKey: 'objectRelationIdsExist',
    uuidKey: 'objectRelationIdsAreUuid',
    realNotTestedKey: 'objectRelationIdsAreRealNotTested',
  },
  requiresRelationType: true,
  systemFields: [
    'id',
    'objectId',
    'objectIdRelation',
    'relationType',
    'propertyCollectionOfOrigin',
  ],
  buildUpsertRow: (d, pCId) => ({
    object_id: d.objectId || null,
    object_id_relation: d.objectIdRelation || null,
    property_collection_id: pCId,
    property_collection_of_origin: d.propertyCollectionOfOrigin || null,
    relation_type: d.relationType || null,
    // send the object: the properties column is jsonb, a string
    // here would be stored as a jsonb string (double serialized)
    properties: omit(d, [
      'id',
      'objectId',
      'objectIdRelation',
      'propertyCollectionId',
      'propertyCollectionOfOrigin',
      'relationType',
    ]),
  }),
  upsertPath: '/relation',
  onConflict:
    'property_collection_id,object_id,object_id_relation,relation_type',
  uniqueKeyCombo: ['objectId', 'objectIdRelation', 'propertyCollectionId'],
}

export const ImportRco = ({
  setImport,
}: {
  setImport: (importing: boolean) => void
}) => (
  <ImportCollection
    spec={spec}
    setImport={setImport}
  />
)
