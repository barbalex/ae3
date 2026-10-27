import { useState } from 'react'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { rpc } from '../../../modules/api.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { CountInput } from './CountInput.jsx'
import { DataTable } from '../../shared/DataTable.jsx'
import {
  exportTaxonomiesAtom,
  exportIdsAtom,
  exportTaxPropertiesAtom,
  exportTypeAtom,
  exportPcoPropertiesAtom,
  exportRcoPropertiesAtom,
  exportTaxFiltersAtom,
  exportPcoFiltersAtom,
  exportRcoFiltersAtom,
  exportWithSynonymDataAtom,
} from '../../../store/index.ts'

import styles from './Preview.module.css'


const removeBadChars = (str) =>
  str
    .trim()
    .toLowerCase()
    .replaceAll(' ', '_')
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll('-', '')
    .replaceAll('↵', '')

const getSortFieldForQuery = (sortField) => {
  if (!sortField) return undefined
  const sf = { ...sortField }
  delete sf.columnName
  return sf
}

export const Preview = () => {
  const taxFilters = useAtomValue(exportTaxFiltersAtom)
  const pcoFilters = useAtomValue(exportPcoFiltersAtom)
  const rcoFilters = useAtomValue(exportRcoFiltersAtom)
  const withSynonymData = useAtomValue(exportWithSynonymDataAtom)
  const pcoProperties = useAtomValue(exportPcoPropertiesAtom)
  const rcoProperties = useAtomValue(exportRcoPropertiesAtom)
  const taxFields = useAtomValue(exportTaxPropertiesAtom)
  const taxonomies = useAtomValue(exportTaxonomiesAtom)
  const exportIds = useAtomValue(exportIdsAtom)
  const type = useAtomValue(exportTypeAtom)

  const [count, setCount] = useState(15)
  const [sortField, setSortField] = useState()

  const sortFieldForQuery = getSortFieldForQuery(sortField)

  const onGridSort = (column, direction) => {
    if (direction === 'NONE') return setSortField(undefined)
    // setSortFields
    // 1. build array of sortFields including their column name
    //    will be used to find the correct sortField
    const sortFieldsWithColumn = []
    taxFields.forEach((taxField) => {
      sortFieldsWithColumn.push({
        tname: 'object',
        pcname: taxField.taxname,
        pname: taxField.pname,
        relationtype: '',
        direction,
        columnName: removeBadChars(`${taxField.taxname}__${taxField.pname}`),
      })
    })
    pcoProperties.forEach((pcoProperty) => {
      sortFieldsWithColumn.push({
        tname: 'property_collection_object',
        pcname: pcoProperty.pcname,
        pname: pcoProperty.pname,
        relationtype: '',
        direction,
        columnName: removeBadChars(
          `${pcoProperty.pcname}__${pcoProperty.pname}`,
        ),
      })
    })
    rcoProperties.forEach((rcoProperty) => {
      sortFieldsWithColumn.push({
        tname: 'relation',
        pcname: rcoProperty.pcname,
        pname: rcoProperty.pname,
        relationtype: rcoProperty.relationtype,
        direction: direction,
        columnName: removeBadChars(
          `${rcoProperty.pcname}__${rcoProperty.relationtype}__${rcoProperty.pname}`,
        ),
      })
    })
    // 2. find sortField, remove columnName, setSortFields
    const sortField = sortFieldsWithColumn.find(
      (sf) => sf.columnName === column,
    )

    if (sortField) {
      setSortField(sortField)
    }
  }

  const setOrder = ({ by, direction }) => onGridSort(by, direction)

  const {
    isLoading: exportLoading,
    error: exportError,
    data: exportData,
  } = useQuery({
    queryKey: [
      'exportQuery',
      type,
      taxonomies,
      taxFields,
      taxFilters,
      pcoFilters,
      pcoProperties,
      rcoFilters,
      rcoProperties,
      withSynonymData,
      exportIds,
      sortField,
      count,
    ],
    queryFn: async () => {
      if (taxonomies.length === 0) return []

      const data = await (async () => {
          const r = await rpc(
            'export_all_json',
            {
              typ: type.toLowerCase(),
              taxonomies,
              taxFields,
              taxFilters,
              pcoFilters,
              pcoProperties,
              rcoFilters,
              rcoProperties,
              useSynonyms: withSynonymData,
              count,
              objectIds: exportIds,
              sortField: sortFieldForQuery,
            },
            // the wrapper takes one jsonb parameter
            { headers: { Prefer: 'params=single-object' } },
          )
          return {
            data: {
              exportAll: {
                exportDatum: { count: r.count, exportData: r.export_data },
              },
            },
          }
        })()
      return data
    },
  })

  const rowCount = exportData?.data?.exportAll?.exportDatum?.count
  const rows =
    exportData?.data?.exportAll?.exportDatum?.exportData ?
      exportData?.data?.exportAll?.exportDatum?.exportData
    : []
  const [message, setMessage] = useState('')

  const onSetMessage = (message) => {
    setMessage(message)
    if (message) {
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const fields = rows[0] ? Object.keys(rows[0]).map((k) => k) : []

  const anzFelder = fields.length ?? 0

  const onClickXlsx = async () => {
    // 1. download the full rows
    // 2. rowsFromObjects
    const r = await rpc(
      'export_all_json',
      {
        typ: type.toLowerCase(),
        taxonomies,
        taxFields,
        taxFilters,
        pcoFilters,
        pcoProperties,
        rcoFilters,
        rcoProperties,
        useSynonyms: withSynonymData,
        count: 0,
        objectIds: exportIds,
        sortField: sortFieldForQuery,
      },
      // the wrapper takes one jsonb parameter
      { headers: { Prefer: 'params=single-object' } },
    )
    const data = {
      data: {
        exportAll: {
          exportDatum: { count: r.count, exportData: r.export_data },
        },
      },
    }
    const rows =
      data?.data?.exportAll?.exportDatum?.exportData ?
        data?.data?.exportAll?.exportDatum?.exportData
      : []
    const { exportXlsx } = await import('../../../modules/exportXlsx.js')
    exportXlsx({ rows, onSetMessage })
  }

  const onClickCsv = async () => {
    const { exportCsv } = await import('../../../modules/exportCsv.js')
    exportCsv(rows)
  }

  if (exportError) {
    return (
      <div className={styles.errorContainer}>
        `Error fetching data: ${exportError.message}`
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        {rowCount > 0 && (
          <div className={styles.topButtonsContainer}>
            <Button
              className={styles.button}
              onClick={onClickXlsx}
              color="inherit"
            >
              .xlsx herunterladen
            </Button>
            <Button
              className={styles.button}
              onClick={onClickCsv}
              color="inherit"
            >
              .csv herunterladen
            </Button>
          </div>
        )}
        {rowCount > 0 && (
          <div className={styles.spreadsheetContainer}>
            <div className={styles.total}>
              {`${rowCount.toLocaleString(
                'de-CH',
              )} Datensätze, ${anzFelder.toLocaleString('de-CH')} ${
                anzFelder === 1 ? 'Feld' : 'Felder'
              }. Erste `}
              <CountInput
                count={count}
                setCount={setCount}
              />
              {' :'}
            </div>
            <DataTable
              data={rows}
              order={sortField?.direction ?? 'ASC'}
              orderBy={sortField?.columnName ?? 'id'}
              setOrder={setOrder}
            />
          </div>
        )}
        {rowCount === 0 && (
          <div className={styles.spreadsheetContainer}>
            <div className={styles.total}>{`${rowCount.toLocaleString(
              'de-CH',
            )} Datensätze`}</div>
          </div>
        )}
        {rowCount > 0 && (
          <div className={styles.buttonsContainer}>
            <Button
              className={styles.button}
              onClick={onClickXlsx}
              color="inherit"
            >
              .xlsx herunterladen
            </Button>
            <Button
              className={styles.button}
              onClick={onClickCsv}
              color="inherit"
            >
              .csv herunterladen
            </Button>
          </div>
        )}
        <Snackbar
          className={styles.snackbar}
          open={!!message}
          message={message}
        />
        <Snackbar
          className={styles.snackbar}
          open={exportLoading}
          message="Lade Daten..."
        />
      </div>
    </ErrorBoundary>
  )
}
