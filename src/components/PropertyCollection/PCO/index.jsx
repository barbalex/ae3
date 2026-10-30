import { useState, Suspense } from 'react'
import { union } from 'es-toolkit'
import Button from '@mui/material/Button'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { ImportPco } from './Import/index.jsx'
import { booleanToJaNein } from '../../../modules/booleanToJaNein.js'
import { apiFetch, apiCount, rpc } from '../../../modules/api.js'
import { loginUsernameAtom } from '../../../store/index.ts'
import { Spinner } from '../../shared/Spinner.jsx'
import { DataTable } from '../../shared/DataTable.jsx'
import { exists } from '../../../modules/exists.js'
import { CountInput } from '../../Export/PreviewColumn/CountInput.jsx'

import { parseProperties } from '../../../modules/parseProperties.js'
import {
  collectionOrder,
  collectionSortDirection,
  fetchCollectionPages,
} from '../../../modules/collectionExport.js'
import styles from './index.module.css'

const pcoRowsPath = (pcId, orderBy, sortDirection) => {
  const params = new URLSearchParams({
    property_collection_id: `eq.${pcId}`,
    select:
      'id,objectId:object_id,objectByObjectId:object_id(id,name),properties',
    order: collectionOrder(orderBy, sortDirection, {
      'Objekt ID': 'object_id',
      'Objekt Name': 'objectByObjectId(name)',
    }),
  })
  return `/property_collection_object?${params}`
}

// fetch the pc with its keys, organization and pcos;
// optionally limited to the first n pcos
export const fetchPcoData = async (
  pcId,
  first = 15,
  orderBy = 'Objekt Name',
  sortDirection = 'asc',
) => {
  const firstPagePath = pcoRowsPath(pcId, orderBy, sortDirection)
  const firstPageParams = new URLSearchParams(firstPagePath.split('?')[1])
  firstPageParams.set('limit', String(first))
  firstPageParams.set('offset', '0')
  const [pcs, totalCount, initialRows] = await Promise.all([
    apiFetch(
      `/property_collection?id=eq.${pcId}&select=id,keys:v_property_collection_keys(keys),organizationByOrganizationId:organization_id(id,name,organizationUsersByOrganizationId:organization_user(id,userId:user_id,role,userByUserId:user_id(id,name,email)))`,
    ),
    apiCount(
      `/property_collection_object?property_collection_id=eq.${pcId}`,
    ),
    apiFetch(
      `/property_collection_object?${firstPageParams}`,
    ),
  ])
  const pC = pcs?.[0]
  if (!pC) return null
  const propKeys = (pC.keys ?? []).map((key) => key.keys)
  const apiSortDirection = collectionSortDirection(
    orderBy,
    sortDirection,
    propKeys,
    initialRows,
  )
  const pcoNodes =
    apiSortDirection === sortDirection ? initialRows
    : await apiFetch(
        `/property_collection_object?${new URLSearchParams({
          ...Object.fromEntries(firstPageParams),
          order: collectionOrder(orderBy, apiSortDirection, {
            'Objekt ID': 'object_id',
            'Objekt Name': 'objectByObjectId(name)',
          }),
        })}`,
      )
  // shape like the former graphql result
  pC.vPropertyCollectionKeysByPropertyCollectionId = {
    nodes: pC.keys ?? [],
  }
  pC.propertyCollectionObjectsByPropertyCollectionId = {
    totalCount,
    nodes: pcoNodes ?? [],
  }
  return { propertyCollectionById: pC }
}

const buildPcoRows = ({ pcoNodes, propKeys }) =>
  (pcoNodes ?? []).map((p) => {
    const nP = {}
    nP['Objekt ID'] = p.objectId
    nP['Objekt Name'] = p?.objectByObjectId?.name ?? null
    if (p.properties) {
      const props = parseProperties(p.properties)
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

export const PCO = () => {
  const queryClient = useQueryClient()
  const { pcId } = useParams()

  const username = useAtomValue(loginUsernameAtom)

  const [count, setCount] = useState(15)
  const [orderBy, setOrderBy] = useState('Objekt Name')
  const [sortDirection, setSortDirection] = useState('asc')

  const [xlsxExportLoading, setXlsxExportLoading] = useState(false)
  const [csvExportLoading, setCsvExportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { data, error } = useQuery({
    queryKey: ['pcoPreviewQuery', pcId, count, orderBy, sortDirection],
    placeholderData: keepPreviousData,
    queryFn: () => fetchPcoData(pcId, count, orderBy, sortDirection),
  })
  const pcoData = data

  // enable sorting
  const setOrder = ({ orderBy, direction }) => {
    setOrderBy(orderBy)
    setSortDirection(direction.toLowerCase())
  }

  const [importing, setImport] = useState(false)

  const propKeys = (
    pcoData?.propertyCollectionById
      ?.vPropertyCollectionKeysByPropertyCollectionId?.nodes ?? []
  ).map((k) => k?.keys)

  const pCO = buildPcoRows({
    pcoNodes:
      pcoData?.propertyCollectionById
        ?.propertyCollectionObjectsByPropertyCollectionId?.nodes,
    propKeys,
  })
  // collect all keys and sort property keys by name
  const keys = ['Objekt ID', 'Objekt Name', ...propKeys.sort()]
  // PostgREST returns the org users as a plain array (no .nodes
  // wrapper like the former graphql result)
  const pCOWriters = (
    pcoData?.propertyCollectionById?.organizationByOrganizationId
      ?.organizationUsersByOrganizationId ?? []
  ).filter((u) => ['orgAdmin', 'orgCollectionWriter'].includes(u.role))
  const writerNames = union(pCOWriters.map((w) => w.userByUserId.name))
  const userIsWriter = !!username && writerNames.includes(username)
  const showImportPco =
    (pcoData?.propertyCollectionById
      ?.propertyCollectionObjectsByPropertyCollectionId?.totalCount === 0 &&
      userIsWriter) ||
    importing

  const totalCount =
    pcoData?.propertyCollectionById
      ?.propertyCollectionObjectsByPropertyCollectionId?.totalCount

  const exportPages = async function* () {
    const nodePage =
      pcoData?.propertyCollectionById
        ?.propertyCollectionObjectsByPropertyCollectionId?.nodes ?? []
    const exportDirection = collectionSortDirection(
      orderBy,
      sortDirection,
      propKeys,
      nodePage,
    )
    for await (const nodes of fetchCollectionPages(
      pcoRowsPath(pcId, orderBy, exportDirection),
      { totalCount },
    )) {
      yield buildPcoRows({ pcoNodes: nodes, propKeys })
    }
  }

  const onClickXlsx = async () => {
    setXlsxExportLoading(true)
    try {
      const { exportXlsxFromPages } = await import(
        '../../../modules/exportXlsx.js'
      )
      await exportXlsxFromPages({
        columns: keys,
        pages: exportPages(),
        onSetMessage: console.log,
      })
    } finally {
      setXlsxExportLoading(false)
    }
  }
  const onClickCsv = async () => {
    setCsvExportLoading(true)
    try {
      const { exportCsvFromPages } = await import(
        '../../../modules/exportCsv.js'
      )
      await exportCsvFromPages({ columns: keys, pages: exportPages() })
    } finally {
      setCsvExportLoading(false)
    }
  }

  const onClickDelete = async () => {
    setDeleteLoading(true)
    await rpc('delete_pco_of_pc', { pc_id: pcId })
    setDeleteLoading(false)
    queryClient.invalidateQueries({
      queryKey: ['tree'],
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
              sorted
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
