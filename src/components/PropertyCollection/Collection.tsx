import { useState, Suspense } from 'react'
import type { ReactElement } from 'react'
import { uniq } from 'es-toolkit'
import Button from '@mui/material/Button'
import {
  useQueryClient,
  useQuery,
  keepPreviousData,
} from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { booleanToJaNein } from '../../modules/booleanToJaNein'
import { apiFetch, apiCount, rpc } from '../../modules/api'
import { loginUsernameAtom } from '../../store'
import { Spinner } from '../shared/Spinner'
import { DataTable } from '../shared/DataTable'
import { exists } from '../../modules/exists'
import { CountInput } from '../Export/PreviewColumn/CountInput'
import { parseProperties } from '../../modules/parseProperties'
import {
  collectionOrder,
  collectionSortDirection,
  fetchCollectionPages,
} from '../../modules/collectionExport'

import loadingStyles from './loading.module.css'
import styles from './Collection.module.css'

// everything that differs between the PCO (properties) and RCO (relations)
// views of a property collection
export type CollectionSpec = {
  // react-query key prefix and preview query name, e.g. 'pcoPreviewQuery'
  queryKey: string
  // PostgREST table of the rows
  table: string
  // view delivering the property keys, e.g. 'v_property_collection_keys'
  keysView: string
  // columns present on every row, before the property keys
  baseColumns: string[]
  // column name -> order= term passed to collectionOrder
  orderColumns: Record<string, string>
  // select= parameter for the row queries
  rowSelect: string
  // base columns beyond Objekt ID / Objekt Name, per row
  extraRow: (row: any) => Record<string, any>
  // rpc deleting all rows of this collection
  deleteRpc: string
  // columns whose combination is unique per row (rco), if not Objekt ID alone
  uniqueKeyCombo?: string[]
  // import ui shown when the collection is empty
  ImportComponent: (props: { setImport: (v: boolean) => void }) => ReactElement
}

const rowsPath = (
  spec: CollectionSpec,
  pcId: string | undefined,
  orderBy: string,
  sortDirection: string,
) => {
  const params = new URLSearchParams({
    property_collection_id: `eq.${pcId}`,
    select: spec.rowSelect,
    order: collectionOrder(orderBy, sortDirection, spec.orderColumns),
  })
  return `/${spec.table}?${params}`
}

// fetch the pc with its keys, organization and rows;
// optionally limited to the first n rows
const fetchCollectionData = async (
  spec: CollectionSpec,
  pcId: string | undefined,
  first: number = 15,
  orderBy: string = 'Objekt Name',
  sortDirection: string = 'asc',
) => {
  const firstPagePath = rowsPath(spec, pcId, orderBy, sortDirection)
  const firstPageParams = new URLSearchParams(firstPagePath.split('?')[1])
  firstPageParams.set('limit', String(first))
  firstPageParams.set('offset', '0')
  const [pcs, totalCount, initialRows] = await Promise.all([
    apiFetch(
      `/property_collection?id=eq.${pcId}&select=id,keys:${spec.keysView}(keys),organizationByOrganizationId:organization_id(id,name,organizationUsersByOrganizationId:organization_user(id,userId:user_id,role,userByUserId:user_id(id,name,email)))`,
    ),
    apiCount(`/${spec.table}?property_collection_id=eq.${pcId}`),
    apiFetch(`/${spec.table}?${firstPageParams}`),
  ])
  const pC = pcs?.[0]
  if (!pC) return null
  const propKeys = (pC.keys ?? []).map((key: any) => key.keys)
  const apiSortDirection = collectionSortDirection(
    orderBy,
    sortDirection,
    propKeys,
    initialRows,
  )
  const nodes =
    apiSortDirection === sortDirection ? initialRows : (
      await apiFetch(
        `/${spec.table}?${new URLSearchParams({
          ...Object.fromEntries(firstPageParams),
          order: collectionOrder(orderBy, apiSortDirection, spec.orderColumns),
        })}`,
      )
    )
  return { pc: pC, nodes: nodes ?? [], totalCount }
}

const buildRows = ({
  nodes,
  propKeys,
  spec,
}: {
  nodes: any
  propKeys: any[]
  spec: CollectionSpec
}) =>
  (nodes ?? []).map((p: any) => {
    const nP: Record<string, any> = { ...spec.extraRow(p) }
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

export const Collection = ({ spec }: { spec: CollectionSpec }) => {
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
    queryKey: [spec.queryKey, pcId, count, orderBy, sortDirection],
    placeholderData: keepPreviousData,
    queryFn: () =>
      fetchCollectionData(spec, pcId, count, orderBy, sortDirection),
  })
  const collectionData = data

  const [importing, setImport] = useState(false)

  const pC = collectionData?.pc

  const propKeys = (pC?.keys ?? []).map((k: any) => k?.keys)

  const rows = buildRows({
    nodes: collectionData?.nodes,
    propKeys,
    spec,
  })
  // collect all keys and sort property keys by name
  const keys = [...spec.baseColumns, ...propKeys.sort()]
  const writers = (
    pC?.organizationByOrganizationId?.organizationUsersByOrganizationId ?? []
  ).filter((u: any) => ['orgAdmin', 'orgCollectionWriter'].includes(u.role))
  const writerNames = uniq(writers.map((w: any) => w.userByUserId.name))
  const userIsWriter = !!username && writerNames.includes(username)
  const showImport =
    (collectionData?.totalCount === 0 && userIsWriter) || importing

  const totalCount = collectionData?.totalCount

  // enable sorting
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

  const exportPages = async function* () {
    const nodePage = collectionData?.nodes ?? []
    const exportDirection = collectionSortDirection(
      orderBy,
      sortDirection,
      propKeys,
      nodePage,
    )
    for await (const nodes of fetchCollectionPages(
      rowsPath(spec, pcId, orderBy, exportDirection as string),
      { totalCount },
    )) {
      yield buildRows({ nodes, propKeys, spec })
    }
  }

  const onClickXlsx = async () => {
    setXlsxExportLoading(true)
    try {
      const { exportXlsxFromPages } = await import('../../modules/exportXlsx')
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
      const { exportCsvFromPages } = await import('../../modules/exportCsv')
      await exportCsvFromPages({ columns: keys, pages: exportPages() })
    } finally {
      setCsvExportLoading(false)
    }
  }

  const onClickDelete = async () => {
    setDeleteLoading(true)
    await rpc(spec.deleteRpc, { pc_id: pcId })
    setDeleteLoading(false)
    queryClient.invalidateQueries({
      queryKey: ['tree'],
    })
    queryClient.invalidateQueries({
      queryKey: [spec.queryKey],
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

  const ImportComponent = spec.ImportComponent

  return (
    <div className={styles.container}>
      <Suspense fallback={<Spinner />}>
        {!showImport && (
          <div className={styles.total}>
            {`${totalCount?.toLocaleString?.(
              'de-CH',
            )} Datensätze, ${propKeys?.length?.toLocaleString?.('de-CH')} Feld${
              propKeys?.length === 1 ? '' : 'er'
            }${rows.length > 0 ? ':' : ''}, Erste `}
            <CountInput
              count={count}
              setCount={setCount}
            />
            {' :'}
          </div>
        )}
        {!importing && rows.length > 0 && (
          <>
            <DataTable
              data={rows}
              sorted
              idKey="Objekt ID"
              {...{ keys }}
              setOrder={setOrder}
              orderBy={orderBy}
              order={sortDirection}
              uniqueKeyCombo={spec.uniqueKeyCombo}
            />
            <div className={styles.buttonsContainer}>
              <div className={styles.exportButtons}>
                <Button
                  onClick={onClickXlsx}
                  variant="outlined"
                  color="inherit"
                  className={`button ${xlsxExportLoading ? loadingStyles.buttonLoading : ''}`}
                >
                  xlsx exportieren
                </Button>
                <Button
                  onClick={onClickCsv}
                  variant="outlined"
                  color="inherit"
                  className={`button ${csvExportLoading ? loadingStyles.buttonLoading : ''}`}
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
                    className={`button ${deleteLoading ? loadingStyles.buttonLoading : ''}`}
                  >
                    Daten löschen
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
        {showImport && <ImportComponent setImport={setImport} />}
      </Suspense>
    </div>
  )
}
