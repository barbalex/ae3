import { omit } from 'es-toolkit'

/**
 * parses an xlsx/xls/csv/ods/dbf/dif file into rows. Runs inside
 * workers/xlsxImport.worker.ts - @e965/xlsx is loaded only there
 */
export const parseXlsx = async (arrayBuffer: ArrayBuffer): Promise<any[]> => {
  const { read, utils } = await import('@e965/xlsx')
  const workbook = read(new Uint8Array(arrayBuffer), { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  return utils
    .sheet_to_json(worksheet)
    .map((d: any) => omit(d, ['__rowNum__']))
}
