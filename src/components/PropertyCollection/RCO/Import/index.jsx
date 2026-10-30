import { useState, useReducer, useMemo } from 'react'
import { omit, union } from 'es-toolkit'
import { some } from 'es-toolkit/compat'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Dropzone from 'react-dropzone'
import isUuid from 'is-uuid'
import SimpleBar from 'simplebar-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { apiFetch } from '../../../../modules/api.js'
import { bulkUpsert } from '../../../../modules/bulkUpsert.js'
import { parseImportFile } from '../../../../modules/parseImportFile.js'
import { activeNodeArrayAtom } from '../../../../store/index.ts'
import { DataTable } from '../../../shared/DataTable.jsx'
import { CountInput } from '../../../Export/PreviewColumn/CountInput.jsx'
import { RcoInstructions } from './Instructions.jsx'

import styles from './index.module.css'

// rows are matched by the unique constraint (property_collection_id,
// object_id, object_id_relation, relation_type) in a single bulk
// upsert per chunk. The former check-then-write matched without
// relation_type, so importing a different type for an existing pair
// overwrote it - now it inserts a second relation, which is what the
// constraint models

const checkStateReducer = (a, state) => state

const initialCheckState = {
  existsNoDataWithoutKey: undefined,
  idsExist: undefined,
  idsAreUuids: undefined,
  idsAreUnique: undefined,
  objectIdsExist: undefined,
  objectIdsAreUuid: undefined,
  objectIdsAreRealNotTested: undefined,
  objectRelationIdsExist: undefined,
  objectRelationIdsAreUuid: undefined,
  objectRelationIdsAreRealNotTested: undefined,
  relationTypeExist: undefined,
  pCOfOriginIdsExist: undefined,
  pCOfOriginIdsAreUuid: undefined,
  pCOfOriginIdsAreReal: undefined,
  pCOfOriginIdsAreRealNotTested: undefined,
  propertyKeysDontContainApostroph: undefined,
  propertyKeysDontContainBackslash: undefined,
  propertyValuesDontContainApostroph: undefined,
  propertyValuesDontContainBackslash: undefined,
}

const getObjectIdsUnreal = ({ data, objectIds }) => {
  const realIds = (data?.allObjects?.nodes ?? []).map((o) => o.id)

  return objectIds.filter((i) => !realIds.includes(i))
}

const getObjectRelationIdsUnreal = ({ data, objectRelationIds }) => {
  const realIds = (data?.allObjectRelations?.nodes ?? []).map((o) => o.id)

  return objectRelationIds.filter((i) => !realIds.includes(i))
}

const getPCOfOriginIdsUnreal = ({ data, pCOfOriginIds }) => {  const realIds = (data?.allPropertyCollections?.nodes ?? []).map((o) => o.id)

  return pCOfOriginIds.filter((i) => !realIds.includes(i))
}

const getImportDataFields = (importData) => {
  let fields = []
  importData.forEach((d) => {
    fields = union([...fields, ...Object.keys(d)])
  })
  return fields
}

export const ImportRco = ({ setImport }) => {
  const queryClient = useQueryClient()

  const activeNodeArray = useAtomValue(activeNodeArrayAtom)
  const pCId =
    activeNodeArray.length > 0 ?
      activeNodeArray[1]
    : '99999999-9999-9999-9999-999999999999'

  const [objectIds, setObjectIds] = useState([])
  const [objectRelationIds, setObjectRelationIds] = useState([])
  const [pCOfOriginIds, setPCOfOriginIds] = useState([])

  const [count, setCount] = useState(15)

  const [orderBy, setOrderBy] = useState('objectId')
  const [sortDirection, setSortDirection] = useState('asc')
  const setOrder = ({ orderBy, direction }) => {
    setOrderBy(orderBy)
    setSortDirection(direction.toLowerCase())
  }

  const { isLoading, error, data } = useQuery({
    queryKey: [
      'importRcoQuery',
      pCId,
      objectIds.length,
      objectRelationIds.length,
      pCOfOriginIds.length,
    ],
    queryFn: async () => {
      if (
        objectIds.length === 0 &&
        objectRelationIds.length === 0 &&
        pCOfOriginIds.length === 0
      ) {
        return {}
      }
      const fetchIds = (ids) =>
        ids.length > 0 ?
          apiFetch(`/object?select=id&id=in.(${ids.join(',')})`)
        : Promise.resolve([])
      const [objects, objectRelations, pcs] = await Promise.all([
        fetchIds(objectIds),
        fetchIds(objectRelationIds),
        pCOfOriginIds.length > 0 ?
          apiFetch(
            `/property_collection?select=id&id=in.(${pCOfOriginIds.join(',')})`,
          )
        : Promise.resolve([]),
      ])
      return {
        allObjects: { nodes: objects },
        allObjectRelations: { nodes: objectRelations },
        allPropertyCollections: { nodes: pcs },
      }
    },
  })

  const [importData, setImportData] = useState([])
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState(0)
  const [importError, setImportError] = useState(null)

  const [checkState, dispatch] = useReducer(
    checkStateReducer,
    initialCheckState,
  )

  if (error && error.message) {
    console.log('error', error.message)
  }

  const objectIdsUnreal = getObjectIdsUnreal({ data, objectIds })
  const objectIdsAreReal =
    !isLoading && objectIds.length > 0 ?
      objectIdsUnreal.length === 0
    : undefined
  const objectRelationIdsUnreal = getObjectRelationIdsUnreal({
    data,
    objectRelationIds,
  })
  const objectRelationIdsAreReal =
    !isLoading && objectRelationIds.length > 0 ?
      objectRelationIdsUnreal.length === 0
    : undefined
  const pCOfOriginIdsUnreal = getPCOfOriginIdsUnreal({ data, pCOfOriginIds })
  const pCOfOriginIdsAreReal =
    !isLoading && pCOfOriginIds.length > 0 ?
      pCOfOriginIdsUnreal.length === 0
    : undefined

  // keep this memo due to Object.values(checkState) dependency
  const showImportButton = useMemo(
    () =>
      importData.length > 0 &&
      checkState.existsNoDataWithoutKey &&
      (checkState.idsExist ?
        checkState.idsAreUnique && checkState.idsAreUuids
      : true) &&
      (checkState.objectIdsExist ?
        checkState.objectIdsAreUuid &&
        (objectIdsAreReal || checkState.objectIdsAreRealNotTested)
      : false) &&
      (checkState.objectRelationIdsExist ?
        checkState.objectRelationIdsAreUuid &&
        (objectRelationIdsAreReal ||
          checkState.objectRelationIdsAreRealNotTested)
      : false) &&
      checkState.relationTypeExist &&
      (checkState.pCOfOriginIdsExist ?
        checkState.pCOfOriginIdsAreUuid &&
        (pCOfOriginIdsAreReal || checkState.pCOfOriginIdsAreRealNotTested)
      : true) &&
      checkState.existsPropertyKey &&
      checkState.propertyKeysDontContainApostroph &&
      checkState.propertyKeysDontContainBackslash &&
      checkState.propertyValuesDontContainApostroph &&
      checkState.propertyValuesDontContainBackslash,
    [
      Object.values(checkState),
      importData.length,
      objectIdsAreReal,
      objectRelationIdsAreReal,
      pCOfOriginIdsAreReal,
    ],
  )
  const showPreview = importData.length > 0

  const importDataFields = getImportDataFields(importData)
  const propertyFields = importDataFields.filter(
    (f) => !['id', 'objectId', 'propertyCollectionOfOrigin'].includes(f),
  )

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async () => {
        const data = await parseImportFile(reader.result)
        // test the data
        setImportData(data)
        let importDataFields = []
        data.forEach((d) => {
          importDataFields = union([...importDataFields, ...Object.keys(d)])
        })
        const objectIdFieldExistsAndIsCorrectlySpelled =
          importDataFields.includes('objectId')
        checkState.existsNoDataWithoutKey =
          data.filter((d) => !!d.__EMPTY).length === 0
        const ids = data.map((d) => d.id).filter((d) => d !== undefined)
        const _idsExist = ids.length > 0
        checkState.idsExist = _idsExist
        checkState.idsAreUuid =
          _idsExist ?
            !ids.map((d) => isUuid.anyNonNil(d)).includes(false)
          : undefined
        checkState.idsAreUnique =
          _idsExist ? ids.length === new Set(ids).size : undefined
        const _objectIds = data
          .map((d) => d.objectId)
          .filter((d) => d !== undefined)
        checkState.objectIdsExist = objectIdFieldExistsAndIsCorrectlySpelled
        checkState.objectIdsAreUuid =
          objectIdFieldExistsAndIsCorrectlySpelled ?
            !_objectIds.map((d) => isUuid.anyNonNil(d)).includes(false)
          : undefined
        setObjectIds(_objectIds)

        const _objectRelationIds = data
          .map((d) => d.objectIdRelation)
          .filter((d) => d !== undefined)
        const objectRelationIdFieldExistsAndIsCorrectlySpelled =
          importDataFields.includes('objectIdRelation')
        checkState.objectRelationIdsExist =
          objectRelationIdFieldExistsAndIsCorrectlySpelled
        checkState.objectRelationIdsAreUuid =
          objectRelationIdFieldExistsAndIsCorrectlySpelled ?
            !_objectRelationIds.map((d) => isUuid.anyNonNil(d)).includes(false)
          : undefined
        setObjectRelationIds(_objectRelationIds)

        const _relationTypes = data
          .map((d) => d.relationType)
          .filter((d) => d !== undefined)
        const relationTypeFieldExistsAndIsCorrectlySpelled =
          importDataFields.includes('objectIdRelation')
        checkState.relationTypeExist =
          relationTypeFieldExistsAndIsCorrectlySpelled &&
          _relationTypes.length === data.length

        const _pCOfOriginIds = data
          .map((d) => d.propertyCollectionOfOrigin)
          .filter((d) => d !== undefined)
        const uniquePCOfOriginIds = [...new Set(_pCOfOriginIds)]
        const _pCOfOriginIdsExist = uniquePCOfOriginIds.length > 0
        checkState.pCOfOriginIdsExist = _pCOfOriginIdsExist
        checkState.pCOfOriginIdsAreUuid =
          _pCOfOriginIdsExist ?
            !uniquePCOfOriginIds.map((d) => isUuid.anyNonNil(d)).includes(false)
          : undefined
        setPCOfOriginIds(uniquePCOfOriginIds)

        const propertyKeys = union(
          data.map((d) => Object.keys(omit(d, ['id', 'objectId'])))?.flat?.(),
        )
        const _existsPropertyKey = propertyKeys.length > 0
        checkState.existsPropertyKey = _existsPropertyKey
        checkState.propertyKeysDontContainApostroph =
          _existsPropertyKey ?
            !some(propertyKeys, (k) => {
              if (!k || !k.includes) return false
              return k.includes('"')
            })
          : undefined
        checkState.propertyKeysDontContainBackslash =
          _existsPropertyKey ?
            !some(propertyKeys, (k) => {
              if (!k || !k.includes) return false
              return k.includes('\\')
            })
          : undefined
        const propertyValues = union(
          data.map((d) => Object.values(d))?.flat?.(),
        )
        checkState.propertyValuesDontContainApostroph = !some(
          propertyValues,
          (k) => {
            if (!k || !k.includes) return false
            return k.includes('"')
          },
        )
        checkState.propertyValuesDontContainBackslash = !some(
          propertyValues,
          (k) => {
            if (!k || !k.includes) return false
            return k.includes('\\')
          },
        )

        dispatch(checkState)
      }
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.readAsArrayBuffer(file)
    }
  }

  const onClickImport = async () => {
    setImporting(true)
    setImportError(null)
    // need a list of all fields
    // loop all rows, build variables and create rco
    const rows = importData.map((d) => ({
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
    }))
    try {
      await bulkUpsert({
        path: '/relation',
        onConflict: 'property_collection_id,object_id,object_id_relation,relation_type',
        rows,
        onChunkDone: (chunkSize) => setImported((count) => count + chunkSize),
      })
      setImport(false)
      queryClient.invalidateQueries({
        queryKey: ['tree'],
      })
      queryClient.invalidateQueries({
        queryKey: [`rcoPreviewQuery`],
      })
    } catch (error) {
      // keep the dialog open so the failed import can be retried
      setImportError(error.message)
    } finally {
      setImporting(false)
    }
  }

  const completedFraction = imported / importData.length

  return (
    <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
      <div className={styles.container}>
        <RcoInstructions
          objectIdsAreReal={objectIdsAreReal}
          objectRelationIdsAreReal={objectRelationIdsAreReal}
          {...checkState}
        />
        {!importing && (
          <div className={styles.dropzoneContainer}>
            <Dropzone
              onDrop={onDrop}
              accept={{
                'text/plain': ['.dif'],
                'application/dbf': ['.dbf'],
                'text/csv': ['.csv'],
                'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
                'application/vnd.ms-excel': ['.xls'],
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                  ['.xlsx'],
              }}
              multiple={false}
            >
              {({
                getRootProps,
                getInputProps,
                isDragActive,
                isDragReject,
              }) => {
                if (isDragActive)
                  return (
                    <div
                      className={styles.dropzoneActive}
                      {...getRootProps()}
                    >
                      Hier fallen lassen
                    </div>
                  )
                if (isDragReject)
                  return (
                    <div
                      className={styles.dropzoneActive}
                      {...getRootProps()}
                    >
                      njet!
                    </div>
                  )
                return (
                  <div
                    className={styles.dropzone}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    Datei hierhin ziehen.
                    <br />
                    Oder hier klicken, um eine Datei auszuwählen.
                    <br />
                    <br />
                    Akzeptierte Formate: xlsx, xls, csv, ods, dbf, dif
                  </div>
                )
              }}
            </Dropzone>
          </div>
        )}
        {showImportButton && (
          <Button
            onClick={onClickImport}
            completed={imported / importData.length}
            disabled={importing}
            color="inherit"
            style={{
              backgroundImage: `linear-gradient(to right, #4caf50 ${completedFraction * 100}%, transparent ${
                completedFraction * 100
              }% ${100 - completedFraction * 100}%)`,
            }}
            className={styles.button}
          >
            {importing ? `${imported} importiert` : 'importieren'}
          </Button>
        )}
        {showPreview && (
          <>
            <div className={styles.total}>
              {`${importData.length.toLocaleString(
                'de-CH',
              )} Datensätze, ${propertyFields.length.toLocaleString(
                'de-CH',
              )} Feld${propertyFields.length === 1 ? '' : 'er'}${
                importData.length > 0 ? ':' : ''
              }, Erste `}
              <CountInput
                count={count}
                setCount={setCount}
              />
              {' :'}
            </div>
            <DataTable
              data={importData.slice(0, count)}
              idKey="objectId"
              keys={importDataFields}
              setOrder={setOrder}
              orderBy={orderBy}
              order={sortDirection}
              uniqueKeyCombo={[
                'objectId',
                'objectIdRelation',
                'propertyCollectionId',
              ]}
            />
          </>
        )}
        <Snackbar
          open={isLoading}
          message="lade Daten..."
          className={styles.snackbar}
        />
        <Snackbar
          open={!!importError}
          message={`Import fehlgeschlagen: ${importError}`}
          className={styles.snackbar}
        />
      </div>
    </SimpleBar>
  )
}
