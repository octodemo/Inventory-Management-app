export interface ReportRow {
  branchName: string
  regionalOffice: string
  itemName: string
  vendorName: string
  quantity: number
  usageDate: string
}

export const excelHeaders = [
  'Branch',
  'Regional Office',
  'Item',
  'Vendor',
  'Quantity',
  'Usage Date',
] as const

export const excelColumnWidths = [150, 180, 220, 200, 120, 140] as const

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const toDateCellValue = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return escapeXml(value)
  }

  return date.toISOString().split('T')[0]
}

const buildStringCell = (value: string): string =>
  `<Cell><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`

const buildNumberCell = (value: number): string =>
  `<Cell><Data ss:Type="Number">${value}</Data></Cell>`

export const generateExcelReportXml = (rows: ReportRow[]): string => {
  const headerCells = excelHeaders
    .map((header) => `<Cell ss:StyleID="header"><Data ss:Type="String">${escapeXml(header)}</Data></Cell>`)
    .join('')

  const bodyRows = rows
    .map((row) => {
      const cells = [
        buildStringCell(row.branchName),
        buildStringCell(row.regionalOffice),
        buildStringCell(row.itemName),
        buildStringCell(row.vendorName),
        buildNumberCell(row.quantity),
        buildStringCell(toDateCellValue(row.usageDate)),
      ].join('')

      return `<Row>${cells}</Row>`
    })
    .join('')

  const columns = excelColumnWidths
    .map((width) => `<Column ss:AutoFitWidth="0" ss:Width="${width}"/>`)
    .join('')

  return `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="header">
   <Font ss:Bold="1"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Usage Report">
  <Table>
   ${columns}
   <Row>${headerCells}</Row>
   ${bodyRows}
  </Table>
 </Worksheet>
</Workbook>`
}

export const generateExcelReportBuffer = (rows: ReportRow[]): Buffer =>
  Buffer.from(generateExcelReportXml(rows), 'utf8')
