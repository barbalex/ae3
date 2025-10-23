import { useState, useContext } from 'react'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import styled from '@emotion/styled'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { storeContext } from '../../../storeContext.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { CountInput } from './CountInput.jsx'
import { DataTable } from '../../shared/DataTable.jsx'

const Container = styled.div`
  padding-top: 5px;
`
const ErrorContainer = styled.div`
  padding: 9px;
`
const SpreadsheetContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const TopButtonsContainer = styled.div`
  padding: 10px 8px 2px 8px;
  > button:not(:first-of-type) {
    margin-left: 10px;
  }
`
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 8px;
`
const TotalDiv = styled.div`
  font-size: small;
  padding-left: 9px;
  margin-top: 4px;
  margin-bottom: 4px;
  user-select: none;
`
const StyledButton = styled(Button)`
  border: 1px solid !important;
`
const StyledSnackbar = styled(Snackbar)`
  div {
    min-width: auto;
    background-color: #2e7d32 !important;
  }
`
const exportMutation = gql`
  mutation exportDataMutation(
    $typ: String!
    $taxonomies: [String]!
    $taxFields: [TaxFieldInput]!
    $taxFilters: [TaxFilterInput]!
    $pcoFilters: [PcoFilterInput]!
    $pcoProperties: [PcoPropertyInput]!
    $rcoFilters: [RcoFilterInput]!
    $rcoProperties: [RcoPropertyInput]!
    $useSynonyms: Boolean!
    $count: Int!
    $objectIds: [UUID]!
    $sortField: SortFieldInput
  ) {
    exportAll(
      input: {
        typ: $typ
        taxonomies: $taxonomies
        taxFields: $taxFields
        taxFilters: $taxFilters
        pcoFilters: $pcoFilters
        pcoProperties: $pcoProperties
        rcoFilters: $rcoFilters
        rcoProperties: $rcoProperties
        useSynonyms: $useSynonyms
        count: $count
        objectIds: $objectIds
        sortField: $sortField
      }
    ) {
      exportDatum {
        id
        count
        exportData
      }
    }
  }
`

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

export const Preview = observer(() => {
  const apolloClient = useApolloClient()
  const store = useContext(storeContext)
  const {
    withSynonymData,
    type,
    pcoFilters: pcoFiltersPassed,
    rcoFilters: rcoFiltersPassed,
    taxFilters: taxFiltersPassed,
    rcoProperties: rcoPropertiesPassed,
    pcoProperties: pcoPropertiesPassed,
    taxProperties: taxPropertiesPassed,
  } = store.export
  // 2019 08 20: No idea why suddenly need to getSnapshot
  // because without changes are not detected????
  const pcoFilters = getSnapshot(pcoFiltersPassed)
  const rcoFilters = getSnapshot(rcoFiltersPassed)
  const taxFilters = getSnapshot(taxFiltersPassed)
  const rcoProperties = getSnapshot(rcoPropertiesPassed)
  const pcoProperties = getSnapshot(pcoPropertiesPassed)
  const taxFields = getSnapshot(taxPropertiesPassed)
  const taxonomies = store.export.taxonomies.toJSON()
  const exportIds = store.export.ids.toJSON()

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

      const data = await apolloClient.mutate({
        mutation: exportMutation,
        variables: {
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
        fetchPolicy: 'no-cache',
      })
      return data
    },
  })

  const rowCount = exportData?.data?.exportAll?.exportDatum?.count
  const rows =
    exportData?.data?.exportAll?.exportDatum?.exportData ?
      JSON.parse(exportData?.data?.exportAll?.exportDatum?.exportData)
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
    const data = await apolloClient.mutate({
      mutation: exportMutation,
      variables: {
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
      fetchPolicy: 'no-cache',
    })
    const rows =
      data?.data?.exportAll?.exportDatum?.exportData ?
        JSON.parse(data?.data?.exportAll?.exportDatum?.exportData)
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
      <ErrorContainer>
        `Error fetching data: ${exportError.message}`
      </ErrorContainer>
    )
  }

  return (
    <ErrorBoundary>
      <Container>
        {rowCount > 0 && (
          <TopButtonsContainer>
            <StyledButton
              onClick={onClickXlsx}
              color="inherit"
            >
              .xlsx herunterladen
            </StyledButton>
            <StyledButton
              onClick={onClickCsv}
              color="inherit"
            >
              .csv herunterladen
            </StyledButton>
          </TopButtonsContainer>
        )}
        {rowCount > 0 && (
          <SpreadsheetContainer>
            <TotalDiv>
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
            </TotalDiv>
            <DataTable
              data={rows}
              order={sortField?.direction ?? 'ASC'}
              orderBy={sortField?.columnName ?? 'id'}
              setOrder={setOrder}
            />
          </SpreadsheetContainer>
        )}
        {rowCount === 0 && (
          <SpreadsheetContainer>
            <TotalDiv>{`${rowCount.toLocaleString(
              'de-CH',
            )} Datensätze`}</TotalDiv>
          </SpreadsheetContainer>
        )}
        {rowCount > 0 && (
          <ButtonsContainer>
            <StyledButton
              onClick={onClickXlsx}
              color="inherit"
            >
              .xlsx herunterladen
            </StyledButton>
            <StyledButton
              onClick={onClickCsv}
              color="inherit"
            >
              .csv herunterladen
            </StyledButton>
          </ButtonsContainer>
        )}
        <StyledSnackbar
          open={!!message}
          message={message}
        />
        <StyledSnackbar
          open={exportLoading}
          message="Lade Daten..."
        />
      </Container>
    </ErrorBoundary>
  )
})
