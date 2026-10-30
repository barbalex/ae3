/**
 * writes a dataArray to an Excel workbook. Runs inside
 * workers/xlsxExport.worker.js - @e965/xlsx is loaded only there
 * (same library as the import worker).
 * note: the community edition writes no cell styles and no frozen
 * panes - the exceljs header styling and frozen header row are gone
 */
export const createXlsxBuilder = async (columns) => {
  const XLSX = await import('@e965/xlsx')
  const worksheet = XLSX.utils.aoa_to_sheet([columns])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Daten')

  return {
    appendRows: (jsonArray) => {
      const values = jsonArray.map((object) =>
        columns.map((column) =>
          column in object ? object[column] : '',
        ),
      )
      if (values.length) {
        XLSX.utils.sheet_add_aoa(worksheet, values, { origin: -1 })
      }
    },
    toBuffer: () => {
      if (columns.length) {
        worksheet['!autofilter'] = {
          ref: `A1:${XLSX.utils.encode_col(columns.length - 1)}1`,
        }
      }
      return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    },
  }
}

export const buildXlsxBuffer = async (jsonArray) => {
  const columns = [...new Set(jsonArray.flatMap((object) => Object.keys(object)))]
  const builder = await createXlsxBuilder(columns)
  builder.appendRows(jsonArray)
  return builder.toBuffer()
}
