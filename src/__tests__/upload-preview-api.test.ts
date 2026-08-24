import { handleUploadInventory, InventoryUploadRow } from '../services/uploadPreviewService'

describe('POST /api/upload/inventory (preview=true)', () => {
  it('returns first 10 rows without database insertion', async () => {
    const rows: InventoryUploadRow[] = Array.from({ length: 12 }, (_, index) => ({
      itemCode: `ITEM-${index + 1}`,
      itemName: `Item ${index + 1}`,
      quantity: index + 1,
    }))

    const insertRows = jest.fn<Promise<void>, [InventoryUploadRow[]]>().mockResolvedValue(undefined)

    const result = await handleUploadInventory(rows, true, insertRows)

    expect(result.preview).toHaveLength(10)
    expect(result.preview[0]).toEqual(rows[0])
    expect(result.preview[9]).toEqual(rows[9])
    expect(insertRows).not.toHaveBeenCalled()
  })

  it('validates preview rows and returns format validation errors', async () => {
    const rows: InventoryUploadRow[] = [
      { itemCode: 'ITEM-1', itemName: 'Stapler', quantity: 5 },
      { itemCode: '', itemName: 'Paper', quantity: 2 },
      { itemCode: 'ITEM-3', itemName: '', quantity: 1 },
      { itemCode: 'ITEM-4', itemName: 'Pens', quantity: 0 },
    ]

    const insertRows = jest.fn<Promise<void>, [InventoryUploadRow[]]>().mockResolvedValue(undefined)

    const result = await handleUploadInventory(rows, true, insertRows)

    expect(result.errors).toEqual([
      { row: 2, message: 'itemCode is required' },
      { row: 3, message: 'itemName is required' },
      { row: 4, message: 'quantity must be a positive number' },
    ])
    expect(insertRows).not.toHaveBeenCalled()
  })
})
