import React, {
  useState,
  useReducer,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import styled from '@emotion/styled'
import omit from 'lodash/omit'
import union from 'lodash/union'
import flatten from 'lodash/flatten'
import some from 'lodash/some'
import uniq from 'lodash/uniq'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Dropzone from 'react-dropzone'
import { read, utils } from 'xlsx'
import isUuid from 'is-uuid'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import SimpleBar from 'simplebar-react'
import { getSnapshot } from 'mobx-state-tree'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import upsertRCOMutation from './upsertRCOMutation.js'
import storeContext from '../../../../storeContext.js'
import { DataTable } from '../../../shared/DataTable.jsx'
import CountInput from '../../../Export/PreviewColumn/CountInput.jsx'
import { RcoInstructions } from './Instructions.jsx'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  .react-grid-Container {
    font-size: small;
  }
  .react-grid-Header {
  }
  .react-grid-HeaderRow {
    overflow: hidden;
  }
  .react-grid-HeaderCell:not(:first-of-type) {
    border-left: #c7c7c7 solid 1px !important;
  }
  .react-grid-HeaderCell__draggable {
    right: 16px !important;
  }
  .react-grid-Cell {
    border: #ddd solid 1px !important;
  }
`
const DropzoneContainer = styled.div`
  padding: 10px 8px;
  div {
    width: 100% !important;
    height: 124px !important;
    cursor: pointer;
  }
`
const DropzoneDiv = styled.div`
  padding: 8px;
  border-width: 2px;
  border-color: rgb(102, 102, 102);
  border-style: dashed;
  border-radius: 5px;
`
const DropzoneDivActive = styled(DropzoneDiv)`
  background-color: rgba(255, 224, 178, 0.2);
`
const StyledButton = styled(Button)`
  border: 1px solid !important;
  margin: 8px 8px 16px 8px !important;
  background-image: ${(props) =>
    `linear-gradient(to right, #4caf50 ${props.completed * 100}%, transparent ${
      props.completed * 100
    }% ${100 - props.completed * 100}%)`} !important;
`
const TotalDiv = styled.div`
  font-size: small;
  padding-left: 9px;
  margin-top: 8px;
`
const StyledSnackbar = styled(Snackbar)`
  div {
    min-width: auto;
    background-color: #2e7d32 !important;
  }
`

const importRcoQuery = gql`
  query rCOQuery(
    $getObjectIds: Boolean!
    $getObjectRelationIds: Boolean!
    $objectRelationIds: [UUID!]
    $getPCOfOriginIds: Boolean!
    $pCOfOriginIds: [UUID!]
  ) {
    allObjects @include(if: $getObjectIds) {
      nodes {
        id
      }
    }
    allObjectRelations: allObjects(filter: { id: { in: $objectRelationIds } })
      @include(if: $getObjectRelationIds) {
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

const ImportRco = ({ setImport }) => {
  const queryClient = useQueryClient()
  const client = useApolloClient()

  const store = useContext(storeContext)
  const activeNodeArray = getSnapshot(store.activeNodeArray)
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
  const setOrder = useCallback(({ orderBy, direction }) => {
    setOrderBy(orderBy)
    setSortDirection(direction.toLowerCase())
  }, [])

  const { isLoading, error, data } = useQuery({
    queryKey: [
      'importRcoQuery',
      pCId,
      objectIds.length,
      objectRelationIds.length,
      pCOfOriginIds.length,
    ],
    queryFn: async () => {
      const { data } = await client.query({
        query: importRcoQuery,
        variables: {
          getObjectIds: objectIds.length > 0,
          getObjectRelationIds: objectRelationIds.length > 0,
          objectRelationIds:
            objectRelationIds.length > 0 ?
              objectRelationIds
            : ['99999999-9999-9999-9999-999999999999'],
          getPCOfOriginIds: pCOfOriginIds.length > 0,
          pCOfOriginIds:
            pCOfOriginIds.length > 0 ?
              pCOfOriginIds
            : ['99999999-9999-9999-9999-999999999999'],
        },
        fetchPolicy: 'no-cache',
      })
      return data
    },
  })

  const [importData, setImportData] = useState([])
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState(0)
  const incrementImported = useCallback(
    () => setImported(() => imported + 1),
    [imported],
  )

  const [checkState, dispatch] = useReducer(
    checkStateReducer,
    initialCheckState,
  )

  if (error && error.message) {
    console.log('error', error.message)
  }

  const objectIdsUnreal = useMemo(() => {
    const realIds = (data?.allObjects?.nodes ?? []).map((o) => o.id)
    return objectIds.filter((i) => !realIds.includes(i))
  }, [data, objectIds])
  const objectIdsAreReal = useMemo(
    () =>
      !isLoading && objectIds.length > 0 ?
        objectIdsUnreal.length === 0
      : undefined,
    [isLoading, objectIds.length, objectIdsUnreal.length],
  )
  const objectRelationIdsUnreal = useMemo(() => {
    const realIds = (data?.allObjectRelations?.nodes ?? []).map((o) => o.id)
    return objectIds.filter((i) => !realIds.includes(i))
  }, [data, objectIds])
  const objectRelationIdsAreReal = useMemo(
    () =>
      !isLoading && objectRelationIds.length > 0 ?
        objectRelationIdsUnreal.length === 0
      : undefined,
    [isLoading, objectRelationIds.length, objectRelationIdsUnreal.length],
  )
  const pCOfOriginIdsUnreal = useMemo(() => {
    const realIds = (data?.allPropertyCollections?.nodes ?? []).map((o) => o.id)
    return pCOfOriginIds.filter((i) => !realIds.includes(i))
  }, [data, pCOfOriginIds])
  const pCOfOriginIdsAreReal = useMemo(
    () =>
      !isLoading && pCOfOriginIds.length > 0 ?
        pCOfOriginIdsUnreal.length === 0
      : undefined,
    [isLoading, pCOfOriginIds.length, pCOfOriginIdsUnreal.length],
  )

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
      objectRelationIdsAreReal,
      pCOfOriginIdsAreReal,
    ],
  )
  const showPreview = importData.length > 0

  const importDataFields = useMemo(() => {
    let fields = []
    importData.forEach((d) => {
      fields = union([...fields, ...Object.keys(d)])
    })
    return fields
  }, [importData])
  const propertyFields = useMemo(
    () =>
      importDataFields.filter(
        (f) => !['id', 'objectId', 'propertyCollectionOfOrigin'].includes(f),
      ),
    [importDataFields],
  )

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          const fileAsBinaryString = reader.result
          const workbook = read(fileAsBinaryString, {
              type: 'binary',
            }),
            sheetName = workbook.SheetNames[0],
            worksheet = workbook.Sheets[sheetName]
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
            _idsExist ?
              !ids.map((d) => isUuid.anyNonNil(d)).includes(false)
            : undefined
          checkState.idsAreUnique =
            _idsExist ? ids.length === uniq(ids).length : undefined
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
              !_objectRelationIds
                .map((d) => isUuid.anyNonNil(d))
                .includes(false)
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
              !uniquePCOfOriginIds
                .map((d) => isUuid.anyNonNil(d))
                .includes(false)
            : undefined
          setPCOfOriginIds(uniquePCOfOriginIds)

          const propertyKeys = union(
            flatten(data.map((d) => Object.keys(omit(d, ['id', 'objectId'])))),
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
            flatten(data.map((d) => Object.values(d))),
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
    },
    [checkState],
  )

  const onClickImport = useCallback(async () => {
    setImporting(true)
    const posts = []
    // need a list of all fields
    // loop all rows, build variables and create pco
    for (const d of importData) {
      const variables = {
        objectId: d.objectId || null,
        objectIdRelation: d.objectIdRelation || null,
        propertyCollectionId: pCId,
        propertyCollectionOfOrigin: d.propertyCollectionOfOrigin || null,
        relationType: d.relationType || null,
        properties: JSON.stringify(
          omit(d, [
            'id',
            'objectId',
            'objectIdRelation',
            'propertyCollectionId',
            'propertyCollectionOfOrigin',
            'relationType',
          ]),
        ),
      }
      posts.push(
        client
          .mutate({ mutation: upsertRCOMutation, variables })
          .then(() => incrementImported()),
      )
    }
    await Promise.all(posts)
    queryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    queryClient.invalidateQueries({
      queryKey: [`treePcs`],
    })
    queryClient.invalidateQueries({
      queryKey: [`rcoPreviewQuery`],
    })
    setImport(false)
    setImporting(false)
  }, [client, importData, incrementImported, pCId, queryClient, setImport])

  return (
    <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
      <Container>
        <RcoInstructions
          objectIdsAreReal={objectIdsAreReal}
          objectRelationIdsAreReal={objectRelationIdsAreReal}
          {...checkState}
        />
        {!importing && (
          <DropzoneContainer>
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
                    <DropzoneDivActive {...getRootProps()}>
                      Hier fallen lassen
                    </DropzoneDivActive>
                  )
                if (isDragReject)
                  return (
                    <DropzoneDivActive {...getRootProps()}>
                      njet!
                    </DropzoneDivActive>
                  )
                return (
                  <DropzoneDiv {...getRootProps()}>
                    <input {...getInputProps()} />
                    Datei hierhin ziehen.
                    <br />
                    Oder hier klicken, um eine Datei auszuwählen.
                    <br />
                    <br />
                    Akzeptierte Formate: xlsx, xls, csv, ods, dbf, dif
                  </DropzoneDiv>
                )
              }}
            </Dropzone>
          </DropzoneContainer>
        )}
        {showImportButton && (
          <StyledButton
            onClick={onClickImport}
            completed={imported / importData.length}
            disabled={importing}
            color="inherit"
          >
            {importing ? `${imported} importiert` : 'importieren'}
          </StyledButton>
        )}
        {showPreview && (
          <>
            <TotalDiv>
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
            </TotalDiv>
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
        <StyledSnackbar
          open={isLoading}
          message="lade Daten..."
        />
      </Container>
    </SimpleBar>
  )
}

export default observer(ImportRco)
