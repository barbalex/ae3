import { ImportPco } from './Import/index'
import { Collection } from '../Collection'
import type { CollectionSpec } from '../Collection'

const spec: CollectionSpec = {
  queryKey: 'pcoPreviewQuery',
  table: 'property_collection_object',
  keysView: 'v_property_collection_keys',
  baseColumns: ['Objekt ID', 'Objekt Name'],
  orderColumns: {
    'Objekt ID': 'object_id',
    'Objekt Name': 'objectByObjectId(name)',
  },
  rowSelect:
    'id,objectId:object_id,objectByObjectId:object_id(id,name),properties',
  extraRow: () => ({}),
  deleteRpc: 'delete_pco_of_pc',
  ImportComponent: ImportPco,
}

export const PCO = () => <Collection spec={spec} />
