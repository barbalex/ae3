import { useState, useContext, useMemo, Suspense } from 'react'
import styled from '@emotion/styled'
import { orderBy as doOrderBy, union } from 'es-toolkit'
import Button from '@mui/material/Button'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { ImportRco } from './Import/index.jsx'
import { booleanToJaNein } from '../../../modules/booleanToJaNein.js'
import { deleteRcoOfPcMutation } from './deleteRcoOfPcMutation.js'
import { storeContext } from '../../../storeContext.js'
import { Spinner } from '../../shared/Spinner.jsx'
import { DataTable } from '../../shared/DataTable.jsx'
import { CountInput } from '../../Export/PreviewColumn/CountInput.jsx'
import { exists } from '../../../modules/exists.js'

import {
  container,
  total,
  buttonsContainer,
  exportButtons,
  mutationButtons,
  button,
  buttonLoading,
} from './index.module.css'

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`
const ExportButtons = styled.div`
  display: flex;
  justify-content: space-between;
`
const MutationButtons = styled.div`
  display: flex;
  justify-content: space-between;
`
const StyledButton = styled(Button)`
  margin: 5px !important;
  ${(props) => props['data-loading'] && `font-style: italic;`}
  ${(props) =>
    props['data-loading'] && `animation: blinker 1s linear infinite;`}
  ${(props) =>
    props['data-loading'] && `animation: blinker 1s linear infinite;`}
  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`

export const rcoQuery = gql`
  query rCOQuery($pCId: UUID!) {
    propertyCollectionById(id: $pCId) {
      id
      vRelationCollectionKeysByPropertyCollectionId(
        filter: { propertyCollectionId: { equalTo: $pCId } }
      ) {
        nodes {
          keys
        }
      }
      organizationByOrganizationId {
        id
        name
        organizationUsersByOrganizationId {
          nodes {
            id
            userId
            role
            userByUserId {
              id
              name
            }
          }
        }
      }
      relationsByPropertyCollectionId {
        totalCount
        nodes {
          id
          objectId
          objectByObjectId {
            id
            name
          }
          objectIdRelation
          objectByObjectIdRelation {
            id
            name
          }
          relationType
          properties
        }
      }
    }
  }
`
export const rcoPreviewQuery = gql`
  query rcoPreviewQuery($pCId: UUID!, $count: Int!) {
    propertyCollectionById(id: $pCId) {
      id
      vRelationCollectionKeysByPropertyCollectionId(
        filter: { propertyCollectionId: { equalTo: $pCId } }
      ) {
        nodes {
          keys
        }
      }
      organizationByOrganizationId {
        id
        name
        organizationUsersByOrganizationId {
          nodes {
            id
            userId
            role
            userByUserId {
              id
              name
            }
          }
        }
      }
      relationsByPropertyCollectionId(first: $count) {
        totalCount
        nodes {
          id
          objectId
          objectByObjectId {
            id
            name
          }
          objectIdRelation
          objectByObjectIdRelation {
            id
            name
          }
          relationType
          properties
        }
      }
    }
  }
`

const getRCO = ({ propKeys, rcoData, sortDirection, orderBy }) => {
  const rCOUnsorted = (
    rcoData?.propertyCollectionById?.relationsByPropertyCollectionId?.nodes ??
    []
  ).map((p) => {
    const nP = {}
    nP['Objekt ID'] = p.objectId
    nP['Objekt Name'] = p?.objectByObjectId?.name ?? null
    nP['Beziehung ID'] = p.objectIdRelation
    nP['Beziehung Name'] = p?.objectByObjectIdRelation?.name ?? null
    nP['Art der Beziehung'] = p.relationType
    if (p.properties) {
      const props = JSON.parse(p.properties)
      if (Object.keys(props).length) {
        Object.defineProperties(props).forEach(([key, value]) => {
          if (typeof value === 'boolean') {
            nP[key] = booleanToJaNein(value)
          } else {
            nP[key] = value
          }
        })
      }
    }
    // add keys that may be missing
    for (const key of propKeys) {
      if (!exists(nP[key])) {
        nP[key] = null
      }
    }
    return nP
  })
  return doOrderBy(rCOUnsorted, orderBy, sortDirection)
}

export const RCO = observer(() => {
  const queryClient = useQueryClient()
  const apolloClient = useApolloClient()
  const { pcId } = useParams()

  const store = useContext(storeContext)
  const { login } = store

  const [count, setCount] = useState(15)

  const { data, error } = useQuery({
    queryKey: ['rcoPreviewQuery', pcId, count],
    queryFn: () =>
      apolloClient.query({
        query: rcoPreviewQuery,
        variables: { pCId: pcId, count },
        fetchPolicy: 'no-cache',
      }),
  })
  const rcoData = data?.data

  const [orderBy, setOrderBy] = useState('Objekt Name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [importing, setImport] = useState(false)

  const [xlsxExportLoading, setXlsxExportLoading] = useState(false)
  const [csvExportLoading, setCsvExportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const propKeys = (
    rcoData?.propertyCollectionById
      ?.vRelationCollectionKeysByPropertyCollectionId?.nodes ?? []
  ).map((k) => k?.keys)

  const rCO = getRCO({
    propKeys,
    rcoData,
    sortDirection,
    orderBy,
  })
  // collect all keys and sort property keys by name
  const keys = [
    'Objekt ID',
    'Objekt Name',
    'Beziehung ID',
    'Beziehung Name',
    'Art der Beziehung',
    ...propKeys.sort(),
  ]
  const rCOWriters = (
    rcoData?.propertyCollectionById?.organizationByOrganizationId
      ?.organizationUsersByOrganizationId?.nodes ?? []
  ).filter((u) => ['orgAdmin', 'orgCollectionWriter'].includes(u.role))
  const writerNames = union(rCOWriters.map((w) => w.userByUserId.name))
  const { username } = login
  const userIsWriter = !!username && writerNames.includes(username)
  const showImportRco =
    ((
      rcoData?.propertyCollectionById?.relationsByPropertyCollectionId?.nodes ??
      []
    ).length === 0 &&
      userIsWriter) ||
    importing

  const totalCount =
    rcoData?.propertyCollectionById?.relationsByPropertyCollectionId?.totalCount

  // enable sorting
  const setOrder = ({ orderBy, direction }) => {
    setOrderBy(orderBy)
    setSortDirection(direction.toLowerCase())
  }

  // TODO: key in data table should bu unique, thus: objectId + objectIdRelation
  const fetchAllData = async () => {
    const { data } = await apolloClient.query({
      query: rcoQuery,
      variables: {
        pCId: pcId,
      },
    })
    const rCORaw = (
      data?.propertyCollectionById?.relationsByPropertyCollectionId?.nodes ?? []
    ).map((p) => {
      const nP = {}
      nP['Objekt ID'] = p.objectId
      nP['Objekt Name'] = p?.objectByObjectId?.name ?? null
      nP['Beziehung ID'] = p.objectIdRelation
      nP['Beziehung Name'] = p?.objectByObjectIdRelation?.name ?? null
      nP['Art der Beziehung'] = p.relationType
      if (p.properties) {
        const props = JSON.parse(p.properties)
        Object.defineProperties(props).forEach(([key, value]) => {
          if (typeof value === 'boolean') {
            nP[key] = booleanToJaNein(value)
          } else {
            nP[key] = value
          }
        })
      }
      // add keys that may be missing
      for (const key of propKeys) {
        if (!exists(nP[key])) {
          nP[key] = null
        }
      }
      return nP
    })
    return doOrderBy(rCORaw, orderBy, sortDirection)
  }

  const onClickXlsx = async () => {
    setXlsxExportLoading(true)
    const data = await fetchAllData()
    const { exportXlsx } = await import('../../../modules/exportXlsx.js')
    exportXlsx({
      rows: data,
      onSetMessage: console.log,
    })
    setXlsxExportLoading(false)
  }

  const onClickCsv = async () => {
    // download all data
    setCsvExportLoading(true)
    const data = await fetchAllData()
    const { exportCsv } = await import('../../../modules/exportCsv.js')
    exportCsv(data)
    setCsvExportLoading(false)
  }

  const onClickDelete = async () => {
    setDeleteLoading(true)
    await apolloClient.mutate({
      mutation: deleteRcoOfPcMutation,
      variables: { pcId: pcId },
    })
    setDeleteLoading(false)
    queryClient.invalidateQueries({
      queryKey: ['tree'],
    })
    queryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    queryClient.invalidateQueries({
      queryKey: [`treePcs`],
    })
    queryClient.invalidateQueries({
      queryKey: [`rcoPreviewQuery`],
    })
  }

  const onClickImport = () => setImport(true)

  if (error) {
    return (
      <div className={container}>{`Error fetching data: ${error.message}`}</div>
    )
  }

  return (
    <div className={container}>
      <Suspense fallback={<Spinner />}>
        {!showImportRco && (
          <div className={total}>
            {`${totalCount?.toLocaleString?.(
              'de-CH',
            )} Datensätze, ${propKeys?.length?.toLocaleString?.('de-CH')} Feld${
              propKeys?.length === 1 ? '' : 'er'
            }${rCO?.length > 0 ? ':' : ''}, Erste `}
            <CountInput
              count={count}
              setCount={setCount}
            />
            {' :'}
          </div>
        )}
        {!importing && rCO?.length > 0 && (
          <>
            <DataTable
              data={rCO}
              idKey="Objekt ID"
              keys={keys}
              setOrder={setOrder}
              orderBy={orderBy}
              order={sortDirection}
              uniqueKeyCombo={['Objekt ID', 'Beziehung ID']}
            />
            <ButtonsContainer>
              <ExportButtons>
                <StyledButton
                  onClick={onClickXlsx}
                  variant="outlined"
                  color="inherit"
                  data-loading={xlsxExportLoading}
                >
                  xlsx exportieren
                </StyledButton>
                <StyledButton
                  onClick={onClickCsv}
                  variant="outlined"
                  color="inherit"
                  data-loading={csvExportLoading}
                >
                  csv exportieren
                </StyledButton>
              </ExportButtons>
              {userIsWriter && (
                <MutationButtons>
                  <StyledButton
                    onClick={onClickImport}
                    variant="outlined"
                    color="inherit"
                  >
                    importieren
                  </StyledButton>
                  <StyledButton
                    onClick={onClickDelete}
                    variant="outlined"
                    color="inherit"
                    data-loading={deleteLoading}
                  >
                    Daten löschen
                  </StyledButton>
                </MutationButtons>
              )}
            </ButtonsContainer>
          </>
        )}
        {showImportRco && <ImportRco setImport={setImport} />}
      </Suspense>
    </div>
  )
})
