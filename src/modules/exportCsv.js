import { Parser } from '@json2csv/plainjs'
import FileSaver from 'file-saver'
import format from 'date-fns/format'

export const exportCsv = (jsonData) => {
  const parse = (data, opts) => new Parser(opts).parse(data)
  const csvData = parse(jsonData)
  FileSaver.saveAs(
    new Blob([csvData], { type: 'text/csv;charset=utf-8' }),
    `arteigenschaften_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.csv`,
  )
}
