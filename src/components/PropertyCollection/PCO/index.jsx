import { useState, Suspense } from 'react'
import { orderBy as doOrderBy, union } from 'es-toolkit'
import Button from '@mui/material/Button'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { ImportPco } from './Import/index.jsx'
import { booleanToJaNein } from '../../../modules/booleanToJaNein.js'
import { deletePcoOfPcMutation } from './deletePcoOfPcMutation.js'
import { loginUsernameAtom } from '../../../store/index.ts'
import { Spinner } from '../../shared/Spinner.jsx'
import { DataTable } from '../../shared/DataTable.jsx'
import { exists } from '../../../modules/exists.js'
import { CountInput } from '../../Export/PreviewColumn/CountInput.jsx'

import styles from './index.module.css'

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

const getPco = ({ pcoNodes, propKeys, sortDirection, orderBy }) => {
  const pCORaw = (pcoNodes ?? []).map((p) => {
    const nP = {}
    nP['Objekt ID'] = p.objectId
    nP['Objekt Name'] = p?.objectByObjectId?.name ?? null
    if (p.properties) {
      const props = JSON.parse(p.properties)
      Object.entries(props).forEach(([key, value]) => {
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
}

export const PCO = () => {
  const queryClient = useQueryClient()
  const apolloClient = useApolloClient()
  const { pcId } = useParams()

  const username = useAtomValue(loginUsernameAtom)

  const [count, setCount] = useState(15)

  const [xlsxExportLoading, setXlsxExportLoading] = useState(false)
  const [csvExportLoading, setCsvExportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { data, error } = useQuery({
    queryKey: ['pcoPreviewQuery', pcId, count],
    queryFn: () =>
      apolloClient.query({
        query: pcoPreviewQuery,
        variables: {
          pCId: pcId,
          first: count,
        },
      }),
  })
  const pcoData = data?.data

  // enable sorting
  const [orderBy, setOrderBy] = useState('Objekt Name')
  const [sortDirection, setSortDirection] = useState('asc')
  const setOrder = ({ orderBy, direction }) => {
    setOrderBy(orderBy)
    setSortDirection(direction.toLowerCase())
  }

  const [importing, setImport] = useState(false)

  const propKeys = (
    pcoData?.propertyCollectionById
      ?.vPropertyCollectionKeysByPropertyCollectionId?.nodes ?? []
  ).map((k) => k?.keys)

  const pCO = getPco({
    pcoNodes:
      pcoData?.propertyCollectionById
        ?.propertyCollectionObjectsByPropertyCollectionId?.nodes,
    propKeys,
    sortDirection,
    orderBy,
  })
  // collect all keys and sort property keys by name
  const keys = ['Objekt ID', 'Objekt Name', ...propKeys.sort()]
  const pCOWriters = (
    pcoData?.propertyCollectionById?.organizationByOrganizationId
      ?.organizationUsersByOrganizationId?.nodes ?? []
  ).filter((u) => ['orgAdmin', 'orgCollectionWriter'].includes(u.role))
  const writerNames = union(pCOWriters.map((w) => w.userByUserId.name))
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

  const fetchAllData = async () => {
    const { data } = await apolloClient.query({
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
        Object.entries(props).forEach(([key, value]) => {
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

    return pCO
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
    setCsvExportLoading(true)
    const data = await fetchAllData()
    const { exportCsv } = await import('../../../modules/exportCsv.js')
    exportCsv(data)
    setCsvExportLoading(false)
  }

  const onClickDelete = async () => {
    setDeleteLoading(true)
    await apolloClient.mutate({
      mutation: deletePcoOfPcMutation,
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
      queryKey: [`pcoPreviewQuery`],
    })
  }

  const onClickImport = () => setImport(true)

  if (error) {
    return (
      <div
        className={styles.container}
      >{`Error fetching data: ${error.message}`}</div>
    )
  }

  return (
    <div className={styles.container}>
      <Suspense fallback={<Spinner />}>
        {!showImportPco && (
          <div className={styles.total}>
            {`${totalCount?.toLocaleString?.(
              'de-CH',
            )} Datensätze, ${propKeys?.length?.toLocaleString?.('de-CH')} Feld${
              propKeys?.length === 1 ? '' : 'er'
            }${pCO.length > 0 ? ':' : ''}, Erste `}
            <CountInput
              count={count}
              setCount={setCount}
            />
            {' :'}
          </div>
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
            <div className={styles.buttonsContainer}>
              <div className={styles.exportButtons}>
                <Button
                  onClick={onClickXlsx}
                  variant="outlined"
                  color="inherit"
                  className={`button ${xlsxExportLoading ? styles.buttonLoading : ''}`}
                >
                  xlsx exportieren
                </Button>
                <Button
                  onClick={onClickCsv}
                  variant="outlined"
                  color="inherit"
                  className={`button ${csvExportLoading ? styles.buttonLoading : ''}`}
                >
                  csv exportieren
                </Button>
              </div>
              {userIsWriter && (
                <div className={styles.mutationButtons}>
                  <Button
                    onClick={onClickImport}
                    variant="outlined"
                    color="inherit"
                  >
                    importieren
                  </Button>
                  <Button
                    onClick={onClickDelete}
                    variant="outlined"
                    color="inherit"
                    className={`button ${deleteLoading ? styles.buttonLoading : ''}`}
                  >
                    Daten löschen
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
        {showImportPco && <ImportPco setImport={setImport} />}
      </Suspense>
    </div>
  )
}
