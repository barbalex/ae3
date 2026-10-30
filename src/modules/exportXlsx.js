import FileSaver from 'file-saver'
import format from 'date-fns/format'

// the workbook is built off the main thread (see getXlsxBuffer.js)

export const exportXlsx = async ({ rows, onSetMessage }) => {
  const { getXlsxBuffer } = await import('./getXlsxBuffer.js')
  let buffer
  try {
    buffer = await getXlsxBuffer(rows)
  } catch (error) {
    console.log(error)
    onSetMessage(error)
  }
  FileSaver.saveAs(
    new Blob([buffer], {
      type: 'application/octet-stream',
    }),
    `arteigenschaften_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.xlsx`,
  )
}
