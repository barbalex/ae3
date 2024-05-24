import { Parser } from '@json2csv/plainjs'
import fileDownload from 'js-file-download'
import format from 'date-fns/format'

export const exportCsv = (jsonData) => {
  const parse = (data, opts) => new Parser(opts).parse(data)
  const csvData = parse(jsonData)
  fileDownload(
    csvData,
    `arteigenschaften_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.csv`,
  )
}

export default exportCsv
