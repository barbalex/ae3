import React, { useState, useCallback, useContext, useMemo } from 'react'
import styled from '@emotion/styled'
import forOwn from 'lodash/forOwn'
import union from 'lodash/union'
import doOrderBy from 'lodash/orderBy'
import Button from '@mui/material/Button'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import ImportPco from './Import/index.jsx'
import { booleanToJaNein } from '../../../modules/booleanToJaNein.js'
import deletePcoOfPcMutation from './deletePcoOfPcMutation.js'
import storeContext from '../../../storeContext.js'
import { Spinner } from '../../shared/Spinner.jsx'
import { DataTable } from '../../shared/DataTable.jsx'
import { exists } from '../../../modules/exists.js'
import CountInput from '../../Export/PreviewColumn/CountInput.jsx'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .react-grid-Container {
    font-size: small;
  }
  .react-grid-HeaderCell:not(:first-of-type) {
    border-left: #c7c7c7 solid 1px !important;
  }
  .react-grid-Cell {
    border: #ddd solid 1px !important;
  }
  .react-grid-Canvas {
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px !important;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 3px;
      box-shadow: inset 0 0 7px #e65100;
    }
    ::-webkit-scrollbar-track {
      border-radius: 1rem;
      box-shadow: none;
    }
  }
`
const TotalDiv = styled.div`
  font-size: small;
  padding-left: 9px;
  margin-top: 8px;
  user-select: none;
`
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
export const StyledProgressText = styled.span`
  margin-left: 10px;
  font-style: italic;
  animation: blinker 1s linear infinite;
  white-space: nowrap;
  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`

export const pcoQuery = gql`
  query pCOQuery($pCId: UUID!) {
    propertyCollectionById(id: $pCId) {
      id
      vPropertyCollectionKeysByPropertyCollectionId(
        filter: { propertyCollectionId: { equalTo: $pCId } }
      ) {
        totalCount
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
              email
            }
          }
        }
      }
      propertyCollectionObjectsByPropertyCollectionId {
        totalCount
        nodes {
          id
          objectId
          objectByObjectId {
            id
            name
          }
          properties
        }
      }
    }
  }
`
export const pcoPreviewQuery = gql`
  query pCOPreviewQuery($pCId: UUID!, $first: Int!) {
    propertyCollectionById(id: $pCId) {
      id
      vPropertyCollectionKeysByPropertyCollectionId(
        filter: { propertyCollectionId: { equalTo: $pCId } }
      ) {
        totalCount
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
              email
            }
          }
        }
      }
      propertyCollectionObjectsByPropertyCollectionId(first: $first) {
        totalCount
        nodes {
          id
          objectId
          objectByObjectId {
            id
            name
          }
          properties
        }
      }
    }
  }
`

const PCO = () => {
  const queryClient = useQueryClient()
  const client = useApolloClient()
  const { pcId } = useParams()

  const store = useContext(storeContext)
  const { login } = store

  const [count, setCount] = useState(15)

  const [xlsxExportLoading, setXlsxExportLoading] = useState(false)
  const [csvExportLoading, setCsvExportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const {
    data,
    isLoading: pcoLoading,
    error: pcoError,
  } = useQuery({
    queryKey: ['pcoPreviewQuery', pcId, count],
    queryFn: () =>
      client.query({
        query: pcoPreviewQuery,
        variables: {
          pCId: pcId,
          first: count,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  const pcoData = data?.data

  // enable sorting
  const [orderBy, setOrderBy] = useState('Objekt Name')
  const [sortDirection, setSortDirection] = useState('asc')
  const setOrder = useCallback(({ orderBy, direction }) => {
    setOrderBy(orderBy)
    setSortDirection(direction.toLowerCase())
  }, [])

  const [importing, setImport] = useState(false)

  const propKeys = (
    pcoData?.propertyCollectionById
      ?.vPropertyCollectionKeysByPropertyCollectionId?.nodes ?? []
  ).map((k) => k?.keys)

  const pCO = useMemo(() => {
    const pCORaw = (
      pcoData?.propertyCollectionById
        ?.propertyCollectionObjectsByPropertyCollectionId?.nodes ?? []
    ).map((p) => {
      const nP = {}
      nP['Objekt ID'] = p.objectId
      nP['Objekt Name'] = p?.objectByObjectId?.name ?? null
      if (p.properties) {
        const props = JSON.parse(p.properties)
        forOwn(props, (value, key) => {
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
    return doOrderBy(pCORaw, orderBy, sortDirection)
  }, [
    pcoData?.propertyCollectionById
      ?.propertyCollectionObjectsByPropertyCollectionId?.nodes,
    propKeys,
    sortDirection,
    orderBy,
  ])
  // collect all keys and sort property keys by name
  const keys = ['Objekt ID', 'Objekt Name', ...propKeys.sort()]
  const pCOWriters = (
    pcoData?.propertyCollectionById?.organizationByOrganizationId
      ?.organizationUsersByOrganizationId?.nodes ?? []
  ).filter((u) => ['orgAdmin', 'orgCollectionWriter'].includes(u.role))
  const writerNames = union(pCOWriters.map((w) => w.userByUserId.name))
  const { username } = login
  const userIsWriter = !!username && writerNames.includes(username)
  const showImportPco =
    ((
      pcoData?.propertyCollectionById
        ?.propertyCollectionObjectsByPropertyCollectionId?.nodes ?? []
    ).length === 0 &&
      userIsWriter) ||
    importing

  const totalCount =
    pcoData?.propertyCollectionById
      ?.propertyCollectionObjectsByPropertyCollectionId?.totalCount

  const fetchAllData = useCallback(async () => {
    const { data, loading, error } = await client.query({
      query: pcoQuery,
      variables: {
        pCId: pcId,
      },
    })
    // collect all keys
    const pCOUnsorted = (
      data?.propertyCollectionById
        ?.propertyCollectionObjectsByPropertyCollectionId?.nodes ?? []
    ).map((p) => {
      const nP = {}
      nP['Objekt ID'] = p.objectId
      nP['Objekt Name'] = p?.objectByObjectId?.name ?? null
      if (p.properties) {
        const props = JSON.parse(p.properties)
        forOwn(props, (value, key) => {
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
    const pCO = doOrderBy(pCOUnsorted, orderBy, sortDirection)
    return { data: pCO, loading, error }
  }, [client, pcId, propKeys, sortDirection, orderBy])

  const onClickXlsx = useCallback(async () => {
    setXlsxExportLoading(true)
    const { data } = await fetchAllData()
    const { default: exportXlsx } = await import(
      '../../../modules/exportXlsx.js'
    )
    exportXlsx({
      rows: data,
      onSetMessage: console.log,
    })
    setXlsxExportLoading(false)
  }, [fetchAllData])
  const onClickCsv = useCallback(async () => {
    setCsvExportLoading(true)
    const { data } = await fetchAllData()
    const { exportCsv } = await import('../../../modules/exportCsv.js')
    exportCsv(data)
    setCsvExportLoading(false)
  }, [fetchAllData])

  const onClickDelete = useCallback(async () => {
    setDeleteLoading(true)
    await client.mutate({
      mutation: deletePcoOfPcMutation,
      variables: { pcId: pcId },
    })
    setDeleteLoading(false)
    queryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    queryClient.invalidateQueries({
      queryKey: [`treePcs`],
    })
    queryClient.invalidateQueries({
      queryKey: [`pcoPreviewQuery`],
    })
  }, [client, pcId, queryClient])

  const onClickImport = useCallback(() => {
    setImport(true)
  }, [])

  if (pcoLoading) {
    return <Spinner />
  }
  if (pcoError) {
    return <Container>{`Error fetching data: ${pcoError.message}`}</Container>
  }

  return (
    <Container>
      {!showImportPco && (
        <TotalDiv>
          {`${totalCount.toLocaleString(
            'de-CH',
          )} Datensätze, ${propKeys.length.toLocaleString('de-CH')} Feld${
            propKeys.length === 1 ? '' : 'er'
          }${pCO.length > 0 ? ':' : ''}, Erste `}
          <CountInput count={count} setCount={setCount} />
          {' :'}
        </TotalDiv>
      )}
      {!importing && pCO.length > 0 && (
        <>
          <DataTable
            data={pCO}
            idKey="Objekt ID"
            keys={keys}
            setOrder={setOrder}
            orderBy={orderBy}
            order={sortDirection}
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
      {showImportPco && <ImportPco setImport={setImport} />}
    </Container>
  )
}

export default observer(PCO)
