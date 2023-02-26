/**
 * writes a dataArray to an Excel workbook
 */
import keys from 'lodash/keys'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'
import toPairs from 'lodash/toPairs'
import sortBy from 'lodash/sortBy'
import findIndex from 'lodash/findIndex'

const getXlsxBuffer = async (jsonArray) => {
  const columns = uniq(flatten(jsonArray.map((object) => keys(object))))
  // add missing columns to each object
  jsonArray.forEach((o) => {
    columns.forEach((k) => {
      if (!o.hasOwnProperty(k)) {
        o[k] = ''
      }
    })
  })
  const values = jsonArray.map((object) =>
    sortBy(toPairs(object), (p) => findIndex(columns, (c) => c === p[0])).map(
      (a) => a[1],
    ),
  )
  const dataArray = [columns, ...values]
  // https://github.com/exceljs/exceljs/issues/1236#issuecomment-643023969
  const { Workbook } = await import('exceljs')
  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('Daten', {
    views: [
      {
        state: 'frozen',
        xSplit: 0,
        ySplit: 1,
      },
    ],
    autoFilter: {
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: 1,
        column: columns.length,
      },
    },
  })
  worksheet.addRows(dataArray)
  worksheet.getRow(1).fill = {
    type: 'gradient',
    gradient: 'angle',
    degree: 0,
    stops: [
      { position: 0, color: { argb: 'FFD3D3D3' } },
      { position: 1, color: { argb: 'FFD3D3D3' } },
    ],
  }
  worksheet.getRow(1).font = {
    bold: true,
  }
  worksheet.getRow(1).border = {
    bottom: {
      style: 'thin',
    },
  }
  const buffer = await workbook.xlsx.writeBuffer()

  return buffer
}

export default getXlsxBuffer
