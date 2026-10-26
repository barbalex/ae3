import { useState, Suspense } from 'react'
import { orderBy as doOrderBy, union } from 'es-toolkit'
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
import styles from './index.module.css'

// fetch the pc with its keys, organization and pcos;
// optionally limited to the first n pcos
export const fetchPcoData = async (pcId, first) => {
  const limit = first ? `&limit=${first}` : ''
  const [pcs, totalCount] = await Promise.all([
    apiFetch(
      `/property_collection?id=eq.${pcId}&select=id,keys:v_property_collection_keys(keys),organizationByOrganizationId:organization_id(id,name,organizationUsersByOrganizationId:organization_user(id,userId:user_id,role,userByUserId:user_id(id,name,email))),propertyCollectionObjectsByPropertyCollectionId:property_collection_object!property_collection_object_property_collection_id_fkey(id,objectId:object_id,objectByObjectId:object_id(id,name),properties)${limit}`,
    ),
    apiCount(
      `/property_collection_object?property_collection_id=eq.${pcId}`,
    ),
  ])
  const pC = pcs?.[0]
  if (!pC) return null
  // shape like the former graphql result
  pC.vPropertyCollectionKeysByPropertyCollectionId = {
    nodes: pC.keys ?? [],
  }
  pC.propertyCollectionObjectsByPropertyCollectionId = {
    totalCount,
    nodes: pC.propertyCollectionObjectsByPropertyCollectionId ?? [],
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

  const [xlsxExportLoading, setXlsxExportLoading] = useState(false)
  const [csvExportLoading, setCsvExportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { data, error } = useQuery({
    queryKey: ['pcoPreviewQuery', pcId, count],
    placeholderData: keepPreviousData,
    queryFn: () => fetchPcoData(pcId, count),
  })
  const pcoData = data

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

  const pCO = doOrderBy(
    buildPcoRows({
      pcoNodes:
        pcoData?.propertyCollectionById
          ?.propertyCollectionObjectsByPropertyCollectionId?.nodes,
      propKeys,
    }),
    orderBy,
    sortDirection,
  )
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
    const data = await fetchPcoData(pcId)
    const pCOUnsorted = buildPcoRows({
      pcoNodes:
        data?.propertyCollectionById
          ?.propertyCollectionObjectsByPropertyCollectionId?.nodes,
      propKeys,
    })
    return doOrderBy(pCOUnsorted, orderBy, sortDirection)
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
