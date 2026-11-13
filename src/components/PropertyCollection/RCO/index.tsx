import { ImportRco } from './Import/index'
import { Collection } from '../Collection'
import type { CollectionSpec } from '../Collection'

const spec: CollectionSpec = {
  queryKey: 'rcoPreviewQuery',
  table: 'relation',
  keysView: 'v_relation_collection_keys',
  baseColumns: [
    'Objekt ID',
    'Objekt Name',
    'Beziehung ID',
    'Beziehung Name',
    'Art der Beziehung',
  ],
  orderColumns: {
    'Objekt ID': 'object_id',
    'Objekt Name': 'objectByObjectId(name)',
    'Beziehung ID': 'object_id_relation',
    'Beziehung Name': 'objectByObjectIdRelation(name)',
    'Art der Beziehung': 'relation_type',
  },
  rowSelect:
    'id,objectId:object_id,objectByObjectId:object!relation_object_id_fkey(id,name),objectIdRelation:object_id_relation,objectByObjectIdRelation:object!relation_object_id_relation_fkey(id,name),relationType:relation_type,properties',
  extraRow: (row) => ({
    'Beziehung ID': row.objectIdRelation,
    'Beziehung Name': row?.objectByObjectIdRelation?.name ?? null,
    'Art der Beziehung': row.relationType,
  }),
  deleteRpc: 'delete_rco_of_pc',
  uniqueKeyCombo: ['Objekt ID', 'Beziehung ID'],
  ImportComponent: ImportRco,
}

export const RCO = () => <Collection spec={spec} />
