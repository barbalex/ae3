import { Parser } from '@json2csv/plainjs'

/**
 * stringifies rows as csv. Runs inside workers/csvExport.worker.js -
 * @json2csv is loaded only there
 */
export const buildCsv = (jsonData) => new Parser().parse(jsonData)
