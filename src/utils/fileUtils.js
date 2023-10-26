import * as XLSX from 'xlsx'

export const readExcelFile = (file, callback) => {
  const reader = new FileReader()
  reader.onload = e => {
    const data = e.target.result
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    callback(sheet)
  }
  reader.readAsArrayBuffer(file)
}
