import { omit } from 'es-toolkit'

import { ImportCollection } from '../../ImportCollection'
import type { ImportSpec } from '../../ImportCollection'
import { PcoInstructions } from './Instructions'

// rows are matched by the unique constraint
// (object_id, property_collection_id) - the former check-then-write
// per row is a single bulk upsert request per chunk now
const spec: ImportSpec = {
  queryKey: 'importPcoQuery',
  previewQueryKey: 'pcoPreviewQuery',
  Instructions: PcoInstructions,
  systemFields: ['id', 'objectId', 'propertyCollectionOfOrigin'],
  buildUpsertRow: (d, pCId) => ({
    object_id: d.objectId || null,
    property_collection_id: pCId,
    property_collection_of_origin: d.propertyCollectionOfOrigin || null,
    // send the object: the properties column is jsonb, a string
    // here would be stored as a jsonb string (double serialized)
    properties: omit(d, [
      'id',
      'objectId',
      'propertyCollectionId',
      'propertyCollectionOfOrigin',
    ]),
  }),
  upsertPath: '/property_collection_object',
  onConflict: 'object_id,property_collection_id',
}

export const ImportPco = ({
  setImport,
}: {
  setImport: (importing: boolean) => void
}) => (
  <ImportCollection
    spec={spec}
    setImport={setImport}
  />
)
