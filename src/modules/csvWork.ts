import { Parser } from '@json2csv/plainjs'

/**
 * stringifies rows as csv. Runs inside workers/csvExport.worker.ts -
 * @json2csv is loaded only there
 */
export const buildCsv = (jsonData: any[]): string =>
  new Parser().parse(jsonData)

export const buildCsvChunk = (
  jsonData: any[],
  fields: string[] | undefined,
  includeHeader: boolean,
): string => {
  const csv = new Parser({ fields, header: includeHeader }).parse(jsonData)
  return includeHeader || !csv ? csv : `\n${csv}`
}
