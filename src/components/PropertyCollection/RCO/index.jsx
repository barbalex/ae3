import { useState, Suspense } from 'react'
import { orderBy as doOrderBy, union } from 'es-toolkit'
import Button from '@mui/material/Button'
import { useQueryClient, useQuery, keepPreviousData } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { booleanToJaNein } from '../../../modules/booleanToJaNein.js'
import { apiFetch, apiCount, rpc } from '../../../modules/api.js'
import { ImportRco } from './Import/index.jsx'
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

const rcoRowsPath = (pcId, orderBy, sortDirection) => {
  const params = new URLSearchParams({
    property_collection_id: `eq.${pcId}`,
    select:
      'id,objectId:object_id,objectByObjectId:object!relation_object_id_fkey(id,name),objectIdRelation:object_id_relation,objectByObjectIdRelation:object!relation_object_id_relation_fkey(id,name),relationType:relation_type,properties',
    order: collectionOrder(orderBy, sortDirection, {
      'Objekt ID': 'object_id',
      'Objekt Name': 'objectByObjectId(name)',
      'Beziehung ID': 'object_id_relation',
      'Beziehung Name': 'objectByObjectIdRelation(name)',
      'Art der Beziehung': 'relation_type',
    }),
  })
  return `/relation?${params}`
}

// fetch the pc with its keys, organization and relations;
// optionally limited to the first n relations
export const fetchRcoData = async (
  pcId,
  first = 15,
  orderBy = 'Objekt Name',
  sortDirection = 'asc',
) => {
  const firstPagePath = rcoRowsPath(pcId, orderBy, sortDirection)
  const firstPageParams = new URLSearchParams(firstPagePath.split('?')[1])
  firstPageParams.set('limit', String(first))
  firstPageParams.set('offset', '0')
  const [pcs, totalCount, initialRows] = await Promise.all([
    apiFetch(
      `/property_collection?id=eq.${pcId}&select=id,keys:v_relation_collection_keys(keys),organizationByOrganizationId:organization_id(id,name,organizationUsersByOrganizationId:organization_user(id,userId:user_id,role,userByUserId:user_id(id,name)))`,
    ),
    apiCount(`/relation?property_collection_id=eq.${pcId}`),
    apiFetch(`/relation?${firstPageParams}`),
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
  const relationNodes =
    apiSortDirection === sortDirection ? initialRows
    : await apiFetch(
        `/relation?${new URLSearchParams({
          ...Object.fromEntries(firstPageParams),
          order: collectionOrder(orderBy, apiSortDirection, {
            'Objekt ID': 'object_id',
            'Objekt Name': 'objectByObjectId(name)',
            'Beziehung ID': 'object_id_relation',
            'Beziehung Name': 'objectByObjectIdRelation(name)',
            'Art der Beziehung': 'relation_type',
          }),
        })}`,
      )
  // shape like the former graphql result
  pC.vRelationCollectionKeysByPropertyCollectionId = {
    nodes: pC.keys ?? [],
  }
  pC.relationsByPropertyCollectionId = {
    totalCount,
    nodes: relationNodes ?? [],
  }
  return { propertyCollectionById: pC }
}

const buildRcoRows = ({ rcoNodes, propKeys }) =>
  (rcoNodes ?? []).map((p) => {
    const nP = {}
    nP['Objekt ID'] = p.objectId
    nP['Objekt Name'] = p?.objectByObjectId?.name ?? null
    nP['Beziehung ID'] = p.objectIdRelation
    nP['Beziehung Name'] = p?.objectByObjectIdRelation?.name ?? null
    nP['Art der Beziehung'] = p.relationType
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

export const RCO = () => {
  const queryClient = useQueryClient()
  const { pcId } = useParams()

  const username = useAtomValue(loginUsernameAtom)

  const [count, setCount] = useState(15)
  const [orderBy, setOrderBy] = useState('Objekt Name')
  const [sortDirection, setSortDirection] = useState('asc')

  const { data, error } = useQuery({
    queryKey: ['rcoPreviewQuery', pcId, count, orderBy, sortDirection],
    placeholderData: keepPreviousData,
    queryFn: () => fetchRcoData(pcId, count, orderBy, sortDirection),
  })
  const rcoData = data

  const [importing, setImport] = useState(false)

  const [xlsxExportLoading, setXlsxExportLoading] = useState(false)
  const [csvExportLoading, setCsvExportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const propKeys = (
    rcoData?.propertyCollectionById
      ?.vRelationCollectionKeysByPropertyCollectionId?.nodes ?? []
  ).map((k) => k?.keys)

  const rCO = doOrderBy(
    buildRcoRows({
      rcoNodes:
        rcoData?.propertyCollectionById?.relationsByPropertyCollectionId
          ?.nodes,
      propKeys,
    }),
    orderBy,
    sortDirection,
  )
  // collect all keys and sort property keys by name
  const keys = [
    'Objekt ID',
    'Objekt Name',
    'Beziehung ID',
    'Beziehung Name',
    'Art der Beziehung',
    ...propKeys.sort(),
  ]
  // PostgREST returns the org users as a plain array (no .nodes
  // wrapper like the former graphql result)
  const rCOWriters = (
    rcoData?.propertyCollectionById?.organizationByOrganizationId
      ?.organizationUsersByOrganizationId ?? []
  ).filter((u) => ['orgAdmin', 'orgCollectionWriter'].includes(u.role))
  const writerNames = union(rCOWriters.map((w) => w.userByUserId.name))
  const userIsWriter = !!username && writerNames.includes(username)
  const showImportRco =
    (rcoData?.propertyCollectionById?.relationsByPropertyCollectionId
      ?.totalCount === 0 &&
      userIsWriter) ||
    importing

  const totalCount =
    rcoData?.propertyCollectionById?.relationsByPropertyCollectionId?.totalCount

  // enable sorting
  const setOrder = ({ orderBy, direction }) => {
    setOrderBy(orderBy)
    setSortDirection(direction.toLowerCase())
  }

  // TODO: key in data table should be unique, thus: objectId + objectIdRelation
  const exportPages = async function* () {
    const nodePage =
      rcoData?.propertyCollectionById?.relationsByPropertyCollectionId
        ?.nodes ?? []
    const exportDirection = collectionSortDirection(
      orderBy,
      sortDirection,
      propKeys,
      nodePage,
    )
    for await (const nodes of fetchCollectionPages(
      rcoRowsPath(pcId, orderBy, exportDirection),
      { totalCount },
    )) {
      yield buildRcoRows({ rcoNodes: nodes, propKeys })
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
    // download all data
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
    await rpc('delete_rco_of_pc', { pc_id: pcId })
    setDeleteLoading(false)
    queryClient.invalidateQueries({
      queryKey: ['tree'],
    })
    queryClient.invalidateQueries({
      queryKey: [`rcoPreviewQuery`],
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
        {!showImportRco && (
          <div className={styles.total}>
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
        {showImportRco && <ImportRco setImport={setImport} />}
      </Suspense>
    </div>
  )
}
