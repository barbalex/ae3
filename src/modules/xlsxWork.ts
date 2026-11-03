import type { SheetData } from 'write-excel-file/browser'

import { autoFilterFeature } from './autoFilterFeature'

type XlsxBuilder = {
  appendRows: (jsonArray: any[]) => void
  toBuffer: () => Promise<ArrayBuffer>
}

/**
 * writes a dataArray to an Excel workbook. Runs inside
 * workers/xlsxExport.worker.ts - write-excel-file is loaded only there.
 * the header row is frozen, styled and filterable - like the old
 * exceljs exports (before the @e965/xlsx interlude, which could
 * write neither cell styles nor frozen panes)
 */
export const createXlsxBuilder = async (
  columns: string[],
): Promise<XlsxBuilder> => {
  const writeXlsxFile = (await import('write-excel-file/browser')).default
  const rows: any[][] = []

  return {
    appendRows: (jsonArray: any[]) => {
      const values = jsonArray.map((object) =>
        columns.map((column) =>
          column in object ? object[column] : '',
        ),
      )
      rows.push(...values)
    },
    toBuffer: async () => {
      const data: SheetData = [
        columns.map((column) => ({
          value: column,
          fontWeight: 'bold',
          backgroundColor: '#D3D3D3',
          bottomBorderStyle: 'thin',
        })),
        ...rows,
      ]
      const blob = await writeXlsxFile(
        [{ sheet: 'Daten', stickyRowsCount: 1, data }],
        { features: [autoFilterFeature] },
      ).toBlob()
      return blob.arrayBuffer()
    },
  }
}

export const buildXlsxBuffer = async (
  jsonArray: any[],
): Promise<ArrayBuffer> => {
  const columns = [...new Set(jsonArray.flatMap((object) => Object.keys(object)))]
  const builder = await createXlsxBuilder(columns)
  builder.appendRows(jsonArray)
  return builder.toBuffer()
}
