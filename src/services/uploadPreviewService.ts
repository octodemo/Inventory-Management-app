export interface InventoryUploadRow {
  itemCode: string
  itemName: string
  quantity: number
}

export interface PreviewError {
  row: number
  message: string
}

export interface UploadPreviewResponse {
  preview: InventoryUploadRow[]
  errors: PreviewError[]
}

const PREVIEW_ROW_LIMIT = 10

export const validateRow = (row: InventoryUploadRow, rowNumber: number): PreviewError[] => {
  const errors: PreviewError[] = []

  if (!row.itemCode?.trim()) {
    errors.push({ row: rowNumber, message: 'itemCode is required' })
  }

  if (!row.itemName?.trim()) {
    errors.push({ row: rowNumber, message: 'itemName is required' })
  }

  if (!Number.isFinite(row.quantity) || row.quantity <= 0) {
    errors.push({ row: rowNumber, message: 'quantity must be a positive number' })
  }

  return errors
}

export const handleUploadInventory = async (
  rows: InventoryUploadRow[],
  preview: boolean,
  insertRows: (validRows: InventoryUploadRow[]) => Promise<void>,
): Promise<UploadPreviewResponse> => {
  const rowsWithErrors = rows.map((row, index) => ({
    row,
    rowErrors: validateRow(row, index + 1),
  }))

  const validationErrors = rowsWithErrors.flatMap((rowWithError) => rowWithError.rowErrors)

  if (preview) {
    return {
      preview: rows.slice(0, PREVIEW_ROW_LIMIT),
      errors: validationErrors,
    }
  }

  const validRows = rowsWithErrors
    .filter((rowWithError) => rowWithError.rowErrors.length === 0)
    .map((rowWithError) => rowWithError.row)

  await insertRows(validRows)

  return {
    preview: [],
    errors: validationErrors,
  }
}
