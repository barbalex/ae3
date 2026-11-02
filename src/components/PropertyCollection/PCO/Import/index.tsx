import { useState, useReducer } from 'react'
import { omit, union } from 'es-toolkit'
import { some } from 'es-toolkit/compat'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Dropzone from 'react-dropzone'
import SimpleBar from 'simplebar-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { apiFetch } from '../../../../modules/api'
import { bulkUpsert } from '../../../../modules/bulkUpsert'
import { parseImportFile } from '../../../../modules/parseImportFile'
import { activeNodeArrayAtom } from '../../../../store'
import { isUuid } from '../../../../modules/isUuid'
import { DataTable } from '../../../shared/DataTable'
import { CountInput } from '../../../Export/PreviewColumn/CountInput'
import { PcoInstructions } from './Instructions'

import styles from './index.module.css'

type CheckState = {
  existsNoDataWithoutKey: boolean | undefined
  idsAreUuids: boolean | undefined
  idsExist: boolean | undefined
  idsAreUnique: boolean | undefined
  objectIdsExist: boolean | undefined
  pCOfOriginIdsExist: boolean | undefined
  objectIdsAreRealNotTested: boolean | undefined
  pCOfOriginIdsAreRealNotTested: boolean | undefined
  objectIdsAreUuid: boolean | undefined
  pCOfOriginIdsAreUuid: boolean | undefined
  propertyKeysDontContainApostroph: boolean | undefined
  propertyKeysDontContainBackslash: boolean | undefined
  propertyValuesDontContainApostroph: boolean | undefined
  propertyValuesDontContainBackslash: boolean | undefined
  existsPropertyKey: boolean | undefined
  // set by onDrop but not part of the initial state
  idsAreUuid?: boolean | undefined
}

const checkStateReducer = (a: CheckState, state: CheckState) => state

const initialCheckState: CheckState = {
  existsNoDataWithoutKey: undefined,
  idsAreUuids: undefined,
  idsExist: undefined,
  idsAreUnique: undefined,
  objectIdsExist: undefined,
  pCOfOriginIdsExist: undefined,
  objectIdsAreRealNotTested: undefined,
  pCOfOriginIdsAreRealNotTested: undefined,
  objectIdsAreUuid: undefined,
  pCOfOriginIdsAreUuid: undefined,
  propertyKeysDontContainApostroph: undefined,
  propertyKeysDontContainBackslash: undefined,
  propertyValuesDontContainApostroph: undefined,
  propertyValuesDontContainBackslash: undefined,
  existsPropertyKey: undefined,
}

const getobjectIdsUnreal = ({
  data,
  objectIds,
}: {
  data: any
  objectIds: string[]
}) => {
  const realObjectIds = (data?.allObjects?.nodes ?? []).map((o: any) => o.id)

  return objectIds.filter((i) => !realObjectIds.includes(i))
}

const getImportDataFields = (importData: any[]) => {
  let fields: string[] = []
  importData.forEach((d) => {
    fields = (union as unknown as (arr: any[]) => any[])([
      ...fields,
      ...Object.keys(d),
    ])
  })
  return fields
}

// rows are matched by the unique constraint
// (object_id, property_collection_id) - the former check-then-write
// per row is a single bulk upsert request per chunk now
export const ImportPco = ({
  setImport,
}: {
  setImport: (importing: boolean) => void
}) => {
  const queryClient = useQueryClient()

  const activeNodeArray = useAtomValue(activeNodeArrayAtom)
  const pCId =
    activeNodeArray.length > 0 ?
      activeNodeArray[1]
    : '99999999-9999-9999-9999-999999999999'

  const [objectIds, setObjectIds] = useState<any[]>([])
  const [pCOfOriginIds, setPCOfOriginIds] = useState<any[]>([])

  const [count, setCount] = useState(15)

  // console.log('importPco render')

  const [orderBy, setOrderBy] = useState('objectId')
  const [sortDirection, setSortDirection] = useState('asc')
  const setOrder = ({
    orderBy,
    direction,
  }: {
    orderBy: string
    direction: string
  }) => {
    setOrderBy(orderBy)
    setSortDirection(direction.toLowerCase())
  }

  const { isLoading, error, data } = useQuery({
    queryKey: ['importPcoQuery', pCId, objectIds.length, pCOfOriginIds.length],
    queryFn: async () => {
      if (objectIds.length === 0 && pCOfOriginIds.length === 0) return {}
      const [objects, pcs] = await Promise.all([
        objectIds.length > 0 ?
          apiFetch(`/object?select=id&id=in.(${objectIds.join(',')})`)
        : Promise.resolve([]),
        pCOfOriginIds.length > 0 ?
          apiFetch(
            `/property_collection?select=id&id=in.(${pCOfOriginIds.join(',')})`,
          )
        : Promise.resolve([]),
      ])
      return {
        allObjects: { nodes: objects },
        allPropertyCollections: { nodes: pcs },
      }
    },
  })

  const [importData, setImportData] = useState<any[]>([])
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

  const objectIdsUnreal = getobjectIdsUnreal({ data, objectIds })
  const objectIdsAreReal =
    !isLoading && objectIds.length > 0 ?
      objectIdsUnreal.length === 0
    : undefined
  const pCOfOriginsCheckData = data?.allPropertyCollections?.nodes ?? []
  const pCOfOriginIdsAreReal =
    !isLoading && pCOfOriginIds.length > 0 ?
      pCOfOriginIds.length === pCOfOriginsCheckData.length
    : undefined
  const importDataFields = getImportDataFields(importData)

  const showImportButton =
    importData.length > 0 &&
    checkState.existsNoDataWithoutKey &&
    (checkState.idsExist ?
      checkState.idsAreUnique && checkState.idsAreUuids
    : true) &&
    (checkState.objectIdsExist ?
      checkState.objectIdsAreUuid &&
      (objectIdsAreReal || checkState.objectIdsAreRealNotTested)
    : false) &&
    (checkState.pCOfOriginIdsExist ?
      checkState.pCOfOriginIdsAreUuid &&
      (pCOfOriginIdsAreReal || checkState.pCOfOriginIdsAreRealNotTested)
    : true) &&
    checkState.existsPropertyKey &&
    checkState.propertyKeysDontContainApostroph &&
    checkState.propertyKeysDontContainBackslash &&
    checkState.propertyValuesDontContainApostroph &&
    checkState.propertyValuesDontContainBackslash
  const showPreview = importData.length > 0
  const propertyFields = importDataFields.filter(
    (f) => !['id', 'objectId', 'propertyCollectionOfOrigin'].includes(f),
  )

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async () => {
        const checkState = { ...initialCheckState }
        const data = await parseImportFile(reader.result as ArrayBuffer)
        // test the data
        setImportData(data)
        let importDataFields: string[] = []
        data.forEach((d: any) => {
          importDataFields = (union as unknown as (arr: any[]) => any[])([
            ...importDataFields,
            ...Object.keys(d),
          ])
        })
        const objectIdFieldExistsAndIsCorrectlySpelled =
          importDataFields.includes('objectId')
        checkState.existsNoDataWithoutKey =
          data.filter((d: any) => !!d.__EMPTY).length === 0
        const ids = data
          .map((d: any) => d.id)
          .filter((d: any) => d !== undefined)
        const _idsExist = ids.length > 0
        checkState.idsExist = _idsExist
        checkState.idsAreUuid =
          _idsExist ?
            !ids.map((d: any) => isUuid(d)).includes(false)
          : undefined
        checkState.idsAreUnique =
          _idsExist ? ids.length === new Set(ids).size : undefined
        const _objectIds = data
          .map((d: any) => d.objectId)
          .filter((d: any) => d !== undefined)

        checkState.objectIdsExist = objectIdFieldExistsAndIsCorrectlySpelled
        const _objectsIdsAreNotUuid = data.filter(
          (d: any) => !isUuid(d.objectId),
        )
        checkState.objectIdsAreUuid =
          objectIdFieldExistsAndIsCorrectlySpelled ?
            _objectsIdsAreNotUuid.length === 0
          : undefined
        setObjectIds(_objectIds)

        const _pCOfOriginIds = data
          .map((d: any) => d.propertyCollectionOfOrigin)
          .filter((d: any) => d !== undefined)
        const uniquePCOfOriginIds = [...new Set(_pCOfOriginIds)]
        const _pCOfOriginIdsExist = uniquePCOfOriginIds.length > 0
        checkState.pCOfOriginIdsExist = _pCOfOriginIdsExist
        checkState.pCOfOriginIdsAreUuid =
          _pCOfOriginIdsExist ?
            !uniquePCOfOriginIds.map((d: any) => isUuid(d)).includes(false)
          : undefined
        setPCOfOriginIds(uniquePCOfOriginIds)

        const propertyKeys = (union as unknown as (arr: any[]) => any[])(
          data
            .map((d: any) => Object.keys(omit(d, ['id', 'objectId'])))
            ?.flat?.(),
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
        const propertyValues = (union as unknown as (arr: any[]) => any[])(
          data.map((d: any) => Object.values(d))?.flat?.(),
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
    // loop all rows, build variables and create pco
    const rows = importData.map((d) => ({
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
    }))
    try {
      await bulkUpsert({
        path: '/property_collection_object',
        onConflict: 'object_id,property_collection_id',
        rows,
        onChunkDone: (chunkSize) => setImported((count) => count + chunkSize),
      })
      setImport(false)
      queryClient.invalidateQueries({
        queryKey: ['tree'],
      })
      queryClient.invalidateQueries({
        queryKey: [`pcoPreviewQuery`],
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
        <PcoInstructions
          {...checkState}
          objectIdsAreReal={objectIdsAreReal}
          pCOfOriginIdsAreReal={pCOfOriginIdsAreReal}
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
            disabled={importing}
            {...{ completed: imported / importData.length }}
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
              {...{ keys: importDataFields }}
              setOrder={setOrder}
              orderBy={orderBy}
              order={sortDirection}
            />
          </>
        )}
        <Snackbar
          className={styles.snackbar}
          open={isLoading}
          message="lade Daten..."
        />
        <Snackbar
          className={styles.snackbar}
          open={!!importError}
          message={`Import fehlgeschlagen: ${importError}`}
        />
      </div>
    </SimpleBar>
  )
}
