import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Box from '@mui/material/Box'
import { visuallyHidden } from '@mui/utils'
import SimpleBar from 'simplebar-react'
import { VGrid } from 'virtua'

import styles from './DataTable.module.css'

const virtualizeAfterRows = 100

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc' ?
      (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// data is array of objects
// keys are column names
// values are column values
export const DataTable = ({
  data,
  order = 'ASC',
  orderBy = 'id',
  setOrder = () => {
    console.log('no setOrder function provided')
  },
  idKey = 'id',
  sorted = false,
  // uniqueKeyCombo is an array of keys to use to create a unique key
  // needed for relations as only combination of objectId, objectIdRelation and pcId is unique
  uniqueKeyCombo,
}) => {
  const columnNames = Object.keys(data[0] ?? {})
  const direction = order.toLowerCase()
  const sortedData =
    sorted ? data : data.toSorted(getComparator(direction, orderBy))
  const isVirtualized = sortedData.length > virtualizeAfterRows
  const gridColumns = columnNames.map((name) => ({
    name,
    width: name === idKey ? 270 : 200,
  }))
  const gridRows = [null, ...sortedData]

  const onSort = (name) => {
    const nextDirection =
      orderBy === name ? (direction === 'asc' ? 'desc' : 'asc') : direction
    setOrder({ orderBy: name, direction: nextDirection })
  }

  const renderVirtualCell = (row, column, cell) => {
    const isHeader = cell.rowIndex === 0
    const cellClass =
      isHeader ? `${styles.virtualCell} ${styles.virtualHeader}`
      : styles.virtualCell
    if (isHeader) {
      if (column.name === idKey) {
        return <div className={cellClass}>{column.name}</div>
      }
      return (
        <div className={cellClass}>
          <TableSortLabel
            active={orderBy === column.name}
            direction={orderBy === column.name ? direction : 'asc'}
            onClick={() => onSort(column.name)}
          >
            {column.name}
            {orderBy === column.name && (
              <Box component="span" sx={visuallyHidden}>
                {direction === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </Box>
            )}
          </TableSortLabel>
        </div>
      )
    }
    const value = row?.[column.name]
    return (
      <div
        className={cellClass}
        title={typeof value === 'string' ? value : undefined}
      >
        {value}
      </div>
    )
  }

  return (
    <div
      className={`${styles.container} ${
        isVirtualized ? styles.virtualized : ''
      }`}
    >
      {isVirtualized ?
        <div className={styles.virtualContainer}>
          <VGrid
            rows={gridRows}
            cols={gridColumns}
            rowHeight={44}
            colWidth="width"
            headerRows={1}
            aria-label="Export Vorschau"
          >
            {renderVirtualCell}
          </VGrid>
        </div>
      : <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
        <Table
          sx={{
            minWidth: 650,
            fontSize: 'small !important',
            backgroundColor: 'var(--ae-bg-paper)',
            marginBottom: 0,
          }}
          size="small"
          aria-label="Export Vorschau"
          stickyHeader={true}
        >
          <TableHead>
            <TableRow className={styles.tableRow}>
              {columnNames.map((name) => {
                const active = orderBy === name
                if (name === idKey) {
                  return (
                    <TableCell
                      key={`${name}/header`}
                      sx={{
                        minWidth: 270,
                        '&:first-of-type': { paddingLeft: '6px !important' },
                        backgroundColor: 'var(--ae-bg-highlight) !important',
                      }}
                    >
                      {name}
                    </TableCell>
                  )
                }

                return (
                  <TableCell
                    key={`${name}/header`}
                    sortDirection={active ? order.toLowerCase() : false}
                    sx={{
                      '&:first-of-type': { paddingLeft: '6px !important' },
                      backgroundColor: 'var(--ae-bg-highlight) !important',
                      // prevent hideous high headers
                      minWidth: 200,
                    }}
                  >
                    <TableSortLabel
                      active={active}
                      direction={active ? direction : 'asc'}
                      onClick={() => onSort(name)}
                    >
                      {name}
                      {orderBy === name ?
                        <Box
                          component="span"
                          sx={visuallyHidden}
                        >
                          {direction === 'desc' ?
                            'sorted descending'
                          : 'sorted ascending'}
                        </Box>
                      : null}
                    </TableSortLabel>
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow
                className={styles.tableRow}
                key={
                  uniqueKeyCombo ?
                    uniqueKeyCombo.map((key) => row[key]).join('/')
                  : row[idKey]
                }
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                {columnNames.map((key) => {
                  if (key === idKey)
                    return (
                      <TableCell
                        key={`${row[idKey]}/${key}/cell`}
                        component="th"
                        scope="row"
                        sx={{
                          fontSize: '0.8rem',
                          paddingLeft: '6px !important',
                        }}
                      >
                        {row[idKey]}
                      </TableCell>
                    )
                  return (
                    <TableCell key={`${row[idKey]}/${key}/cell`}>
                      {row[key]}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SimpleBar>}
    </div>
  )
}
