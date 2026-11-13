import { useState } from 'react'
import type { ComponentType } from 'react'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Dropzone from 'react-dropzone'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { apiFetch } from '../../modules/api'
import { bulkUpsert } from '../../modules/bulkUpsert'
import { parseImportFile } from '../../modules/parseImportFile'
import { activeNodeArrayAtom } from '../../store'
import { DataTable } from '../shared/DataTable'
import { CountInput } from '../Export/PreviewColumn/CountInput'
import {
  getImportDataFields,
  validateImportData,
} from './validateImportData'
import type { ImportCheckState } from './validateImportData'

import styles from './Import.module.css'

// per-row validation results; all undefined until a file is dropped.
// keys not used by a collection kind are simply never set
type CheckState = ImportCheckState

// what differs between the PCO (properties) and RCO (relations) import
export type ImportSpec = {
  // react-query key of the existence-check query, e.g. 'importPcoQuery'
  queryKey: string
  // preview query invalidated after a successful import
  previewQueryKey: string
  // the checklist shown above the dropzone
  Instructions: ComponentType<Record<string, boolean | undefined>>
  // relation target column (rco only): import-data field and the
  // checkState keys it feeds
  relationField?: {
    dataKey: 'objectIdRelation'
    existsKey: string
    uuidKey: string
    realNotTestedKey: string
  }
  // rco only: every row must carry a relationType
  requiresRelationType?: boolean
  // import-data fields that are not property keys
  systemFields: string[]
  // maps an import row to the bulk-upsert row
  buildUpsertRow: (row: any, pCId: any) => any
  upsertPath: string
  onConflict: string
  // columns whose combination is unique per row (rco), if not objectId alone
  uniqueKeyCombo?: string[]
}

const idsUnreal = ({ realIds, ids }: { realIds: any[]; ids: string[] }) =>
  ids.filter((i) => !realIds.includes(i))

export const ImportCollection = ({
  spec,
  setImport,
}: {
  spec: ImportSpec
  setImport: (importing: boolean) => void
}) => {
  const queryClient = useQueryClient()

  const activeNodeArray = useAtomValue(activeNodeArrayAtom)
  const pCId =
    activeNodeArray.length > 0 ?
      activeNodeArray[1]
    : '99999999-9999-9999-9999-999999999999'

  const [objectIds, setObjectIds] = useState<any[]>([])
  const [objectRelationIds, setObjectRelationIds] = useState<any[]>([])
  const [pCOfOriginIds, setPCOfOriginIds] = useState<any[]>([])

  const [count, setCount] = useState(15)

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

  const relation = spec.relationField

  const { isLoading, error, data } = useQuery({
    queryKey: [
      spec.queryKey,
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
      const fetchIds = (ids: any[]) =>
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

  const [importData, setImportData] = useState<any[]>([])
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState(0)
  const [importError, setImportError] = useState(null)
  const [checkState, setCheckState] = useState<CheckState>({})

  if (error && error.message) {
    console.log('error', error.message)
  }

  const objectIdsUnreal = idsUnreal({
    realIds: (data?.allObjects?.nodes ?? []).map((o: any) => o.id),
    ids: objectIds,
  })
  const objectIdsAreReal =
    !isLoading && objectIds.length > 0 ?
      objectIdsUnreal.length === 0
    : undefined
  const objectRelationIdsUnreal = idsUnreal({
    realIds: (data?.allObjectRelations?.nodes ?? []).map((o: any) => o.id),
    ids: objectRelationIds,
  })
  const objectRelationIdsAreReal =
    !isLoading && objectRelationIds.length > 0 ?
      objectRelationIdsUnreal.length === 0
    : undefined
  const pCOfOriginIdsUnreal = idsUnreal({
    realIds: (data?.allPropertyCollections?.nodes ?? []).map((o: any) => o.id),
    ids: pCOfOriginIds,
  })
  const pCOfOriginIdsAreReal =
    !isLoading && pCOfOriginIds.length > 0 ?
      pCOfOriginIdsUnreal.length === 0
    : undefined

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
    (relation ?
      checkState[relation.existsKey] ?
        checkState[relation.uuidKey] &&
        (objectRelationIdsAreReal || checkState[relation.realNotTestedKey])
      : false
    : true) &&
    (!spec.requiresRelationType || checkState.relationTypeExist) &&
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

  const importDataFields = getImportDataFields(importData)
  const propertyFields = importDataFields.filter(
    (f) => !spec.systemFields.includes(f),
  )

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async () => {
        const data = await parseImportFile(reader.result as ArrayBuffer)
        // test the data
        setImportData(data)
        const validation = validateImportData(
          data,
          spec.relationField,
          spec.requiresRelationType,
        )
        setObjectIds(validation.objectIds)
        setObjectRelationIds(validation.objectRelationIds)
        setPCOfOriginIds(validation.pCOfOriginIds)
        setCheckState(validation.checkState)
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
    // loop all rows, build variables and create the rows
    const rows = importData.map((d) => spec.buildUpsertRow(d, pCId))
    try {
      await bulkUpsert({
        path: spec.upsertPath,
        onConflict: spec.onConflict,
        rows,
        onChunkDone: (chunkSize) => setImported((count) => count + chunkSize),
      })
      setImport(false)
      queryClient.invalidateQueries({
        queryKey: ['tree'],
      })
      queryClient.invalidateQueries({
        queryKey: [spec.previewQueryKey],
      })
    } catch (error) {
      // keep the dialog open so the failed import can be retried
      setImportError(error.message)
    } finally {
      setImporting(false)
    }
  }

  const completedFraction = imported / importData.length

  const Instructions = spec.Instructions

  return (
    <div style={{ maxHeight: '100%', height: '100%', overflow: 'auto' }}>
      <div className={styles.container}>
        <Instructions
          {...checkState}
          objectIdsAreReal={objectIdsAreReal}
          objectRelationIdsAreReal={objectRelationIdsAreReal}
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
              uniqueKeyCombo={spec.uniqueKeyCombo}
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
    </div>
  )
}
