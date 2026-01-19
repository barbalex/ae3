import { useState, useReducer, useContext, useMemo } from 'react'
import { omit, union } from 'es-toolkit'
import { some } from 'es-toolkit/compat'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Dropzone from 'react-dropzone'
import { read, utils } from '@e965/xlsx'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'
import SimpleBar from 'simplebar-react'
import { getSnapshot } from 'mobx-state-tree'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { upsertPCOMutation } from './upsertPCOMutation.js'
import { storeContext } from '../../../../storeContext.js'
import { isUuid } from '../../../../modules/isUuid.js'
import { DataTable } from '../../../shared/DataTable.jsx'
import { CountInput } from '../../../Export/PreviewColumn/CountInput.jsx'
import { PcoInstructions } from './Instructions.jsx'

import {
  container,
  dropzoneContainer,
  dropzone,
  dropzoneActive,
  button,
  total,
  snackbar,
} from './index.module.css'

const importPcoQuery = gql`
  query pCOQuery(
    $getObjectIds: Boolean!
    $getPCOfOriginIds: Boolean!
    $pCOfOriginIds: [UUID!]
  ) {
    allObjects @include(if: $getObjectIds) {
      nodes {
        id
      }
    }
    allPropertyCollections(filter: { id: { in: $pCOfOriginIds } })
      @include(if: $getPCOfOriginIds) {
      nodes {
        id
      }
    }
  }
`

const checkStateReducer = (a, state) => state

const initialCheckState = {
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

const getobjectIdsUnreal = ({ data, objectIds }) => {
  const realObjectIds = (data?.allObjects?.nodes ?? []).map((o) => o.id)

  return objectIds.filter((i) => !realObjectIds.includes(i))
}

const getImportDataFields = (importData) => {
  let fields = []
  importData.forEach((d) => {
    fields = union([...fields, ...Object.keys(d)])
  })
  return fields
}

export const ImportPco = observer(({ setImport }) => {
  const queryClient = useQueryClient()
  const apolloClient = useApolloClient()

  const store = useContext(storeContext)
  const activeNodeArray = getSnapshot(store.activeNodeArray)
  const pCId =
    activeNodeArray.length > 0 ?
      activeNodeArray[1]
    : '99999999-9999-9999-9999-999999999999'

  const [objectIds, setObjectIds] = useState([])
  const [pCOfOriginIds, setPCOfOriginIds] = useState([])

  const [count, setCount] = useState(15)

  // console.log('importPco render')

  const [orderBy, setOrderBy] = useState('objectId')
  const [sortDirection, setSortDirection] = useState('asc')
  const setOrder = ({ orderBy, direction }) => {
    setOrderBy(orderBy)
    setSortDirection(direction.toLowerCase())
  }

  const {
    isLoading,
    error,
    data: rawData,
  } = useQuery({
    queryKey: ['importPcoQuery', pCId, objectIds.length, pCOfOriginIds.length],
    queryFn: () =>
      apolloClient.query({
        query: importPcoQuery,
        variables: {
          getObjectIds: objectIds.length > 0,
          getPCOfOriginIds: pCOfOriginIds.length > 0,
          pCOfOriginIds:
            pCOfOriginIds.length > 0 ?
              pCOfOriginIds
            : ['99999999-9999-9999-9999-999999999999'],
        },
      }),
  })
  const data = rawData?.data

  const [importData, setImportData] = useState([])
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState(0)
  const incrementImported = () => setImported(() => imported + 1)

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

  // keep this explicit memo because of the Object.values(checkState) dependency
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
      (checkState.pCOfOriginIdsExist ?
        checkState.pCOfOriginIdsAreUuid &&
        (pCOfOriginIdsAreReal || checkState.pCOfOriginIdsAreRealNotTested)
      : true) &&
      checkState.existsPropertyKey &&
      checkState.propertyKeysDontContainApostroph &&
      checkState.propertyKeysDontContainBackslash &&
      checkState.propertyValuesDontContainApostroph &&
      checkState.propertyValuesDontContainBackslash,
    [Object.values(checkState), importData.length, objectIdsAreReal],
  )
  const showPreview = importData.length > 0
  const propertyFields = importDataFields.filter(
    (f) => !['id', 'objectId', 'propertyCollectionOfOrigin'].includes(f),
  )

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async () => {
        const checkState = { ...initialCheckState }
        const fileAsBinaryString = reader.result
        const workbook = read(fileAsBinaryString, {
          type: 'binary',
        })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = utils
          .sheet_to_json(worksheet)
          .map((d) => omit(d, ['__rowNum__']))
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
          _idsExist ? !ids.map((d) => isUuid(d)).includes(false) : undefined
        checkState.idsAreUnique =
          _idsExist ? ids.length === new Set(ids).size : undefined
        const _objectIds = data
          .map((d) => d.objectId)
          .filter((d) => d !== undefined)

        checkState.objectIdsExist = objectIdFieldExistsAndIsCorrectlySpelled
        const _objectsIdsAreNotUuid = data.filter((d) => !isUuid(d.objectId))
        checkState.objectIdsAreUuid =
          objectIdFieldExistsAndIsCorrectlySpelled ?
            _objectsIdsAreNotUuid.length === 0
          : undefined
        setObjectIds(_objectIds)

        const _pCOfOriginIds = data
          .map((d) => d.propertyCollectionOfOrigin)
          .filter((d) => d !== undefined)
        const uniquePCOfOriginIds = [...new Set(_pCOfOriginIds)]
        const _pCOfOriginIdsExist = uniquePCOfOriginIds.length > 0
        checkState.pCOfOriginIdsExist = _pCOfOriginIdsExist
        checkState.pCOfOriginIdsAreUuid =
          _pCOfOriginIdsExist ?
            !uniquePCOfOriginIds.map((d) => isUuid(d)).includes(false)
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
      reader.readAsBinaryString(file)
    }
  }

  const onClickImport = async () => {
    setImporting(true)

    const posts = []
    // need a list of all fields
    // loop all rows, build variables and create pco
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const d of importData) {
      const variables = {
        objectId: d.objectId || null,
        propertyCollectionId: pCId,
        propertyCollectionOfOrigin: d.propertyCollectionOfOrigin || null,
        properties: JSON.stringify(
          omit(d, [
            'id',
            'objectId',
            'propertyCollectionId',
            'propertyCollectionOfOrigin',
          ]),
        ),
      }

      posts.push(
        apolloClient
          .mutate({
            mutation: upsertPCOMutation,
            variables,
          })
          .then(() => incrementImported()),
      )
    }
    await Promise.all(posts)
    setImport(false)
    setImporting(false)
    queryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    queryClient.invalidateQueries({
      queryKey: [`treePcs`],
    })
    queryClient.invalidateQueries({
      queryKey: [`pcoPreviewQuery`],
    })
  }

  const completedFraction = imported / importData.length

  return (
    <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
      <div className={container}>
        <PcoInstructions
          {...checkState}
          objectIdsAreReal={objectIdsAreReal}
          pCOfOriginIdsAreReal={pCOfOriginIdsAreReal}
        />
        {!importing && (
          <div className={dropzoneContainer}>
            <Dropzone
              onDrop={onDrop}
              types={[
                {
                  description: 'spreadsheet files',
                  accept: {
                    'text/plain': ['.dif'],
                    'application/dbf': ['.dbf'],
                    'text/csv': ['.csv'],
                    'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
                    'application/vnd.ms-excel': ['.xls'],
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                      ['.xlsx'],
                  },
                },
              ]}
              excludeAcceptAllOption={true}
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
                      className={dropzoneActive}
                      {...getRootProps()}
                    >
                      Hier fallen lassen
                    </div>
                  )
                if (isDragReject)
                  return (
                    <div
                      className={dropzoneActive}
                      {...getRootProps()}
                    >
                      njet!
                    </div>
                  )
                return (
                  <div
                    className={dropzone}
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
            completed={imported / importData.length}
            color="inherit"
            style={{
              backgroundImage: `linear-gradient(to right, #4caf50 ${completedFraction * 100}%, transparent ${
                completedFraction * 100
              }% ${100 - completedFraction * 100}%)`,
            }}
            className={button}
          >
            {importing ? `${imported} importiert` : 'importieren'}
          </Button>
        )}
        {showPreview && (
          <>
            <div className={total}>
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
            />
          </>
        )}
        <Snackbar
          className={snackbar}
          open={isLoading}
          message="lade Daten..."
        />
      </div>
    </SimpleBar>
  )
})
