import { toPairs } from 'es-toolkit/compat'
import { sortBy } from 'es-toolkit'

/**
 * writes a dataArray to an Excel workbook. Runs inside
 * workers/xlsxExport.worker.js - @e965/xlsx is loaded only there
 * (same library as the import worker).
 * note: the community edition writes no cell styles and no frozen
 * panes - the exceljs header styling and frozen header row are gone
 */
export const buildXlsxBuffer = async (jsonArray) => {
  const columns = [
    ...new Set(jsonArray.map((object) => Object.keys(object))?.flat?.()),
  ]
  // add missing columns to each object
  jsonArray.forEach((o) => {
    columns.forEach((k) => {
      if (!(k in o)) {
        o[k] = ''
      }
    })
  })
  const values = jsonArray.map((object) =>
    sortBy(toPairs(object), [(p) => columns.findIndex((c) => c === p[0])]).map(
      (a) => a[1],
    ),
  )
  const dataArray = [columns, ...values]
  const XLSX = await import('@e965/xlsx')
  const worksheet = XLSX.utils.aoa_to_sheet(dataArray)
  // autofilter over the header row, like exceljs did before
  worksheet['!autofilter'] = {
    ref: `A1:${XLSX.utils.encode_col(columns.length - 1)}1`,
  }
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Daten')
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
}
